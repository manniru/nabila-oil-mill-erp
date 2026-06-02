import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const totalTrips = await prisma.haulageTrip.count()
    const trips = await prisma.haulageTrip.findMany()
    
    // Revenue and Shortages Sums from Trips
    const totalRevenue = trips.reduce((sum, t) => sum + t.haulageAmount, 0)
    const totalShortageAmount = trips.reduce((sum, t) => sum + t.shortageAmount, 0)
    const totalWeight = trips.reduce((sum, t) => sum + t.weightQuantity, 0)

    // Outstanding shortages from dedicated Shortages tracker
    const outstandingShortagesCount = await prisma.shortage.count({
      where: { resolved: false }
    })
    const outstandingShortages = await prisma.shortage.findMany({
      where: { resolved: false }
    })
    const totalOutstandingShortageQty = outstandingShortages.reduce((sum, s) => sum + s.shortageQty, 0)

    // Expenses total
    const expenses = await prisma.expense.findMany()
    const totalExpensesAmount = expenses.reduce((sum, e) => sum + e.amount, 0)

    // Recent logs
    const recentExpenses = await prisma.expense.findMany({
      orderBy: { date: 'desc' },
      take: 5
    })
    const recentTrips = await prisma.haulageTrip.findMany({
      orderBy: { loadDate: 'desc' },
      take: 5
    })

    // Charts Data:
    // 1. Monthly revenue
    const revenueByMonthMap: { [key: string]: number } = {}
    trips.forEach(t => {
      // Safely check loadDate
      try {
        const monthStr = new Date(t.loadDate).toLocaleString('default', { month: 'short', year: '2-digit' })
        revenueByMonthMap[monthStr] = (revenueByMonthMap[monthStr] || 0) + t.haulageAmount
      } catch (e) {}
    })
    const monthlyRevenue = Object.keys(revenueByMonthMap).map(key => ({
      name: key,
      Revenue: revenueByMonthMap[key]
    }))

    // 2. Shortages by Truck
    const shortageByTruckMap: { [key: string]: number } = {}
    const allShortages = await prisma.shortage.findMany()
    allShortages.forEach(s => {
      shortageByTruckMap[s.truckNumber] = (shortageByTruckMap[s.truckNumber] || 0) + s.shortageQty
    })
    const shortagesByTruck = Object.keys(shortageByTruckMap).map(key => ({
      truck: key,
      Quantity: shortageByTruckMap[key]
    })).slice(0, 8) // Limit to top 8

    // 3. Expenses distribution
    const expenseMap: { [key: string]: number } = {}
    expenses.forEach(e => {
      const part = e.particulars.toUpperCase().trim()
      expenseMap[part] = (expenseMap[part] || 0) + e.amount
    })
    const expensesByCategory = Object.keys(expenseMap).map(key => ({
      name: key,
      value: expenseMap[key]
    })).slice(0, 5)

    return NextResponse.json({
      success: true,
      stats: {
        totalTrips,
        totalRevenue,
        totalShortageAmount,
        totalWeight,
        outstandingShortagesCount,
        totalOutstandingShortageQty,
        totalExpensesAmount
      },
      recentExpenses,
      recentTrips,
      charts: {
        monthlyRevenue,
        shortagesByTruck,
        expensesByCategory
      }
    })
  } catch (error: any) {
    console.error('Dashboard Aggregation API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
