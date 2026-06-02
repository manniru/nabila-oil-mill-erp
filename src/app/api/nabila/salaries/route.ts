import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const salaries = await prisma.salary.findMany({
      orderBy: { employeeName: 'asc' },
    })
    return NextResponse.json({ success: true, salaries })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      employeeName,
      designation,
      decemberAmount = 0,
      januaryAmount = 0,
      comment
    } = body

    if (!employeeName || !designation) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const newSalary = await prisma.salary.create({
      data: {
        employeeName: employeeName.trim().toUpperCase(),
        designation: designation.trim().toUpperCase(),
        decemberAmount: parseFloat(decemberAmount),
        januaryAmount: parseFloat(januaryAmount),
        comment: comment ? comment.trim() : null
      }
    })

    return NextResponse.json({ success: true, salary: newSalary })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      employeeName,
      designation,
      decemberAmount,
      januaryAmount,
      comment
    } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing salary ID' }, { status: 400 })
    }

    const updatedSalary = await prisma.salary.update({
      where: { id },
      data: {
        employeeName: employeeName ? employeeName.trim().toUpperCase() : undefined,
        designation: designation ? designation.trim().toUpperCase() : undefined,
        decemberAmount: decemberAmount !== undefined ? parseFloat(decemberAmount) : undefined,
        januaryAmount: januaryAmount !== undefined ? parseFloat(januaryAmount) : undefined,
        comment: comment !== undefined ? comment : undefined
      }
    })

    return NextResponse.json({ success: true, salary: updatedSalary })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing salary ID' }, { status: 400 })
    }

    await prisma.salary.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Salary record deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
