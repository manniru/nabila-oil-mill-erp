import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const trips = await prisma.haulageTrip.findMany({
      orderBy: { loadDate: 'desc' },
    })
    return NextResponse.json({ success: true, trips })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      loadDate,
      transporter,
      truckNumber,
      product,
      driverName,
      driverPhone,
      origin,
      destination,
      waybillNumber,
      weightQuantity,
      price,
      shortageQty = 0,
      shortageAmount = 0
    } = body

    if (!loadDate || !truckNumber || !product || !driverName || !origin || !destination || weightQuantity === undefined || price === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Auto calculate haulageAmount
    const qty = parseFloat(weightQuantity)
    const prc = parseFloat(price)
    const haulageAmount = qty * prc

    const newTrip = await prisma.haulageTrip.create({
      data: {
        loadDate: new Date(loadDate),
        transporter: transporter || 'NABILA OIL MILL',
        truckNumber: truckNumber.trim().toUpperCase(),
        product: product.trim().toUpperCase(),
        driverName: driverName.trim().toUpperCase(),
        driverPhone: driverPhone ? driverPhone.trim() : null,
        origin: origin.trim().toUpperCase(),
        destination: destination.trim().toUpperCase(),
        waybillNumber: waybillNumber ? waybillNumber.trim() : null,
        weightQuantity: qty,
        price: prc,
        haulageAmount: haulageAmount,
        shortageQty: parseFloat(shortageQty),
        shortageAmount: parseFloat(shortageAmount)
      }
    })

    return NextResponse.json({ success: true, trip: newTrip })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      loadDate,
      transporter,
      truckNumber,
      product,
      driverName,
      driverPhone,
      origin,
      destination,
      waybillNumber,
      weightQuantity,
      price,
      shortageQty,
      shortageAmount
    } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing trip ID' }, { status: 400 })
    }

    const qty = parseFloat(weightQuantity)
    const prc = parseFloat(price)
    const haulageAmount = qty * prc

    const updatedTrip = await prisma.haulageTrip.update({
      where: { id },
      data: {
        loadDate: loadDate ? new Date(loadDate) : undefined,
        transporter: transporter || undefined,
        truckNumber: truckNumber ? truckNumber.trim().toUpperCase() : undefined,
        product: product ? product.trim().toUpperCase() : undefined,
        driverName: driverName ? driverName.trim().toUpperCase() : undefined,
        driverPhone: driverPhone !== undefined ? driverPhone : undefined,
        origin: origin ? origin.trim().toUpperCase() : undefined,
        destination: destination ? destination.trim().toUpperCase() : undefined,
        waybillNumber: waybillNumber !== undefined ? waybillNumber : undefined,
        weightQuantity: qty,
        price: prc,
        haulageAmount: haulageAmount,
        shortageQty: shortageQty !== undefined ? parseFloat(shortageQty) : undefined,
        shortageAmount: shortageAmount !== undefined ? parseFloat(shortageAmount) : undefined
      }
    })

    return NextResponse.json({ success: true, trip: updatedTrip })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing trip ID' }, { status: 400 })
    }

    await prisma.haulageTrip.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Trip deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
