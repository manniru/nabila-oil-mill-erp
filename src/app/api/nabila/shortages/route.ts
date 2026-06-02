import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const shortages = await prisma.shortage.findMany({
      orderBy: { date: 'desc' },
    })
    return NextResponse.json({ success: true, shortages })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      date,
      truckNumber,
      ullageN1 = 0,
      ullageN2 = 0,
      ullageN3 = 0,
      qtyDepots,
      shortageQty,
      resolved = false
    } = body

    if (!truckNumber || qtyDepots === undefined || shortageQty === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const newShortage = await prisma.shortage.create({
      data: {
        date: date ? new Date(date) : new Date(),
        truckNumber: truckNumber.trim().toUpperCase(),
        ullageN1: parseFloat(ullageN1),
        ullageN2: parseFloat(ullageN2),
        ullageN3: parseFloat(ullageN3),
        qtyDepots: parseFloat(qtyDepots),
        shortageQty: parseFloat(shortageQty),
        resolved: !!resolved
      }
    })

    return NextResponse.json({ success: true, shortage: newShortage })
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
      truckNumber,
      ullageN1,
      ullageN2,
      ullageN3,
      qtyDepots,
      shortageQty,
      resolved
    } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing shortage ID' }, { status: 400 })
    }

    const updatedShortage = await prisma.shortage.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
        truckNumber: truckNumber ? truckNumber.trim().toUpperCase() : undefined,
        ullageN1: ullageN1 !== undefined ? parseFloat(ullageN1) : undefined,
        ullageN2: ullageN2 !== undefined ? parseFloat(ullageN2) : undefined,
        ullageN3: ullageN3 !== undefined ? parseFloat(ullageN3) : undefined,
        qtyDepots: qtyDepots !== undefined ? parseFloat(qtyDepots) : undefined,
        shortageQty: shortageQty !== undefined ? parseFloat(shortageQty) : undefined,
        resolved: resolved !== undefined ? !!resolved : undefined
      }
    })

    return NextResponse.json({ success: true, shortage: updatedShortage })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing shortage ID' }, { status: 400 })
    }

    await prisma.shortage.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Shortage deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
