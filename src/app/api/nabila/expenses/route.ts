import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: 'desc' },
    })
    return NextResponse.json({ success: true, expenses })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      date,
      particulars,
      description,
      amount,
      modeOfPayment,
      cashReceived = 0,
      dateReceived,
      receivedFrom
    } = body

    if (!date || !particulars || !description || amount === undefined || !modeOfPayment) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const newExpense = await prisma.expense.create({
      data: {
        date: new Date(date),
        particulars: particulars.trim().toUpperCase(),
        description: description.trim(),
        amount: parseFloat(amount),
        modeOfPayment: modeOfPayment.trim().toUpperCase(),
        cashReceived: parseFloat(cashReceived),
        dateReceived: dateReceived ? new Date(dateReceived) : null,
        receivedFrom: receivedFrom ? receivedFrom.trim().toUpperCase() : null
      }
    })

    return NextResponse.json({ success: true, expense: newExpense })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      date,
      particulars,
      description,
      amount,
      modeOfPayment,
      cashReceived,
      dateReceived,
      receivedFrom
    } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing expense ID' }, { status: 400 })
    }

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
        particulars: particulars ? particulars.trim().toUpperCase() : undefined,
        description: description !== undefined ? description.trim() : undefined,
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        modeOfPayment: modeOfPayment ? modeOfPayment.trim().toUpperCase() : undefined,
        cashReceived: cashReceived !== undefined ? parseFloat(cashReceived) : undefined,
        dateReceived: dateReceived !== undefined ? (dateReceived ? new Date(dateReceived) : null) : undefined,
        receivedFrom: receivedFrom !== undefined ? (receivedFrom ? receivedFrom.trim().toUpperCase() : null) : undefined
      }
    })

    return NextResponse.json({ success: true, expense: updatedExpense })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing expense ID' }, { status: 400 })
    }

    await prisma.expense.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Expense deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
