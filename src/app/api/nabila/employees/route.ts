import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { name: 'asc' },
    })
    return NextResponse.json({ success: true, employees })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      nin,
      name,
      phone,
      address,
      dob,
      lga,
      state,
      guarantor,
      designation,
      dofa
    } = body

    if (!nin || !name || !phone || !address || !dob || !lga || !state || !guarantor || !designation || !dofa) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Check unique NIN
    const existing = await prisma.employee.findUnique({
      where: { nin: nin.trim() }
    })
    if (existing) {
      return NextResponse.json({ success: false, error: 'An employee with this NIN already exists' }, { status: 400 })
    }

    const newEmployee = await prisma.employee.create({
      data: {
        nin: nin.trim(),
        name: name.trim().toUpperCase(),
        phone: phone.trim(),
        address: address.trim(),
        dob: new Date(dob),
        lga: lga.trim().toUpperCase(),
        state: state.trim().toUpperCase(),
        guarantor: guarantor.trim().toUpperCase(),
        designation: designation.trim().toUpperCase(),
        dofa: new Date(dofa)
      }
    })

    return NextResponse.json({ success: true, employee: newEmployee })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      nin,
      name,
      phone,
      address,
      dob,
      lga,
      state,
      guarantor,
      designation,
      dofa
    } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing employee ID' }, { status: 400 })
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        nin: nin ? nin.trim() : undefined,
        name: name ? name.trim().toUpperCase() : undefined,
        phone: phone ? phone.trim() : undefined,
        address: address ? address.trim() : undefined,
        dob: dob ? new Date(dob) : undefined,
        lga: lga ? lga.trim().toUpperCase() : undefined,
        state: state ? state.trim().toUpperCase() : undefined,
        guarantor: guarantor ? guarantor.trim().toUpperCase() : undefined,
        designation: designation ? designation.trim().toUpperCase() : undefined,
        dofa: dofa ? new Date(dofa) : undefined
      }
    })

    return NextResponse.json({ success: true, employee: updatedEmployee })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing employee ID' }, { status: 400 })
    }

    await prisma.employee.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Employee deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
