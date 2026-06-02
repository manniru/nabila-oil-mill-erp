import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Nabila Oil Mill ERP data...')

  // 1. Seed Drivers
  const drivers = [
    { name: 'LAMINU MUSTAPHA', phone: '08061241486' },
    { name: 'MUHAMMAD SANI', phone: '08032166066' },
    { name: 'USMAN ABUBAKAR', phone: '08030455628' },
    { name: 'YUSUF ISMAIL', phone: '07055153406' },
    { name: 'JIBRIN MOHAMMED', phone: '08063431169' },
    { name: 'AHMED ABDULHAMID', phone: '08062913250' },
    { name: 'MOHAMMED ADO', phone: '08065505434' },
    { name: 'RAPHAEL AGBI', phone: '09019448908' },
    { name: 'MUSAIYIB MUHAMMAD', phone: '08137377371' },
    { name: 'ILIYASU IBRAHIM', phone: '08066659151' },
    { name: 'ABUBAKAR PATIKASANGI', phone: '07035967910' },
    { name: 'SAIDU MOHAMMED', phone: '08066502988' }
  ]

  for (const driver of drivers) {
    await prisma.driver.create({
      data: {
        name: driver.name,
        phone: driver.phone,
        status: 'Active'
      }
    })
  }

  // 2. Seed Trucks
  const trucks = [
    { number: 'DKA894YF', transporter: 'NABILA OIL MILL', capacity: 50000 },
    { number: 'DKA995YF', transporter: 'NABILA OIL MILL', capacity: 45000 },
    { number: 'AJG94XA', transporter: 'NABILA OIL MILL', capacity: 50000 },
    { number: 'KEF63YW', transporter: 'NABILA OIL MILL', capacity: 45000 },
    { number: 'AKW938XA', transporter: 'NABILA OIL MILL', capacity: 45000 },
    { number: 'AKW941XA', transporter: 'NABILA OIL MILL', capacity: 45000 },
    { number: 'TRN17XX', transporter: 'NABILA OIL MILL', capacity: 45000 },
    { number: 'NSR967YQ', transporter: 'NABILA OIL MILL', capacity: 50000 },
    { number: 'GML736XX', transporter: 'NABILA OIL MILL', capacity: 45000 },
    { number: 'SAA221XA', transporter: 'ZAMSON GLOBAL', capacity: 45000 }
  ]

  for (const truck of trucks) {
    await prisma.truck.upsert({
      where: { number: truck.number },
      update: {},
      create: {
        number: truck.number,
        transporter: truck.transporter,
        capacity: truck.capacity,
        status: 'Active'
      }
    })
  }

  // 3. Seed Haulage Trips
  const trips = [
    {
      loadDate: new Date('2024-08-24'),
      transporter: 'NABILA OIL MILL',
      truckNumber: 'DKA894YF',
      product: 'JET A-1',
      driverName: 'LAMINU MUSTAPHA',
      driverPhone: '08061241486',
      origin: 'DANGOTE REFINERY LAGOS',
      destination: 'NIAMEY NIGER',
      waybillNumber: '8200003915',
      weightQuantity: 50000,
      price: 100,
      haulageAmount: 5000000,
      shortageQty: 0,
      shortageAmount: 0
    },
    {
      loadDate: new Date('2024-08-24'),
      transporter: 'NABILA OIL MILL',
      truckNumber: 'DKA995YF',
      product: 'JET A-1',
      driverName: 'MUHAMMAD SANI',
      driverPhone: '08032166066',
      origin: 'DANGOTE REFINERY LAGOS',
      destination: 'NIAMEY NIGER',
      waybillNumber: '8200003929',
      weightQuantity: 45000,
      price: 100,
      haulageAmount: 4500000,
      shortageQty: 0,
      shortageAmount: 0
    },
    {
      loadDate: new Date('2024-08-24'),
      transporter: 'NABILA OIL MILL',
      truckNumber: 'AJG94XA',
      product: 'JET A-1',
      driverName: 'USMAN ABUBAKAR',
      driverPhone: '08030455628',
      origin: 'DANGOTE REFINERY LAGOS',
      destination: 'NIAMEY NIGER',
      waybillNumber: '8200003917',
      weightQuantity: 50000,
      price: 100,
      haulageAmount: 5000000,
      shortageQty: 0,
      shortageAmount: 0
    },
    {
      loadDate: new Date('2024-08-27'),
      transporter: 'NABILA OIL MILL',
      truckNumber: 'KEF63YW',
      product: 'JET A-1',
      driverName: 'YUSUF ISMAIL',
      driverPhone: '07055153406',
      origin: 'DANGOTE REFINERY LAGOS',
      destination: 'NIAMEY NIGER',
      waybillNumber: '8200004067',
      weightQuantity: 45000,
      price: 95,
      haulageAmount: 4275000,
      shortageQty: 582,
      shortageAmount: 55290
    },
    {
      loadDate: new Date('2024-08-27'),
      transporter: 'NABILA OIL MILL',
      truckNumber: 'AKW938XA',
      product: 'JET A-1',
      driverName: 'JIBRIN MOHAMMED',
      driverPhone: '08063431169',
      origin: 'DANGOTE REFINERY LAGOS',
      destination: 'NIAMEY NIGER',
      waybillNumber: '8200004069',
      weightQuantity: 45000,
      price: 95,
      haulageAmount: 4275000,
      shortageQty: 529,
      shortageAmount: 50255
    },
    {
      loadDate: new Date('2024-10-18'),
      transporter: 'NABILA OIL MILL',
      truckNumber: 'TRN17XX',
      product: 'JET-A',
      driverName: 'MOHAMMED SANI',
      driverPhone: '08032166066',
      origin: 'DANGOTE REFINERY LAGOS',
      destination: 'KADUNA',
      waybillNumber: '490025801',
      weightQuantity: 45000,
      price: 40,
      haulageAmount: 1800000,
      shortageQty: 0,
      shortageAmount: 0
    }
  ]

  for (const trip of trips) {
    await prisma.haulageTrip.create({
      data: trip
    })
  }

  // 4. Seed Shortages
  const shortages = [
    { truckNumber: 'GML736XX', ullageN1: 0, ullageN2: 0, ullageN3: 0, qtyDepots: 44231, shortageQty: 769 },
    { truckNumber: 'AKW938XA', ullageN1: 0, ullageN2: 0, ullageN3: 0, qtyDepots: 44471, shortageQty: 529 },
    { truckNumber: 'KEF63YW', ullageN1: 0, ullageN2: 0, ullageN3: 0, qtyDepots: 44418, shortageQty: 582 }
  ]

  for (const shortage of shortages) {
    await prisma.shortage.create({
      data: {
        truckNumber: shortage.truckNumber,
        ullageN1: shortage.ullageN1,
        ullageN2: shortage.ullageN2,
        ullageN3: shortage.ullageN3,
        qtyDepots: shortage.qtyDepots,
        shortageQty: shortage.shortageQty,
        resolved: false
      }
    })
  }

  // 5. Seed Expenses
  const expenses = [
    {
      date: new Date('2025-01-01'),
      particulars: 'SCHOOL FEES',
      description: 'QURAN SCHOOL FEES FOR DECEMBER',
      amount: 30000,
      modeOfPayment: 'TRANSFER',
      cashReceived: 3210,
      receivedFrom: 'OPENING BALANCE'
    },
    {
      date: new Date('2025-01-01'),
      particulars: 'TRN15XX',
      description: 'SET OF WHEEL BOLTS, GREASE & BEARINGS @ ZARIA',
      amount: 35500,
      modeOfPayment: 'TRANSFER',
      cashReceived: 5000000,
      receivedFrom: 'ALH. SAFIYANU'
    },
    {
      date: new Date('2025-01-09'),
      particulars: 'DOG',
      description: 'DOG FEED',
      amount: 88000,
      modeOfPayment: 'TRANSFER',
      cashReceived: 5000000,
      receivedFrom: 'ALH. SAFIYANU'
    }
  ]

  for (const exp of expenses) {
    await prisma.expense.create({
      data: exp
    })
  }

  // 6. Seed Salaries
  const salaries = [
    { employeeName: 'ADAMU IDRIS', designation: 'MKA720ZB', decemberAmount: 30000, januaryAmount: 30000, comment: 'Paid' },
    { employeeName: 'MURTALA ISAH', designation: 'KZR32XC', decemberAmount: 30000, januaryAmount: 30000, comment: 'Paid' },
    { employeeName: 'LAMINU MUSTAPHA', designation: 'DKA894YF', decemberAmount: 35000, januaryAmount: 35000, comment: 'Bonus pending' },
    { employeeName: 'YUSUF ISMAIL', designation: 'KEF63YW', decemberAmount: 35000, januaryAmount: 35000, comment: 'Paid' }
  ]

  for (const sal of salaries) {
    await prisma.salary.create({
      data: sal
    })
  }

  // 7. Seed Employees
  const employees = [
    {
      nin: '12345678901',
      name: 'ADAMU IDRIS',
      phone: '08032111111',
      address: 'No. 12 Zaria Road, Kano',
      dob: new Date('1990-05-15'),
      lga: 'Kano Municipal',
      state: 'Kano',
      guarantor: 'Alh. Ibrahim Kano',
      designation: 'MKA720ZB Driver',
      dofa: new Date('2022-01-10')
    },
    {
      nin: '12345678902',
      name: 'MURTALA ISAH',
      phone: '08032222222',
      address: 'No. 45 Kaduna Bypass, Kaduna',
      dob: new Date('1988-11-20'),
      lga: 'Kaduna North',
      state: 'Kaduna',
      guarantor: 'Alh. Yusuf Kaduna',
      designation: 'KZR32XC Driver',
      dofa: new Date('2021-06-15')
    }
  ]

  for (const emp of employees) {
    await prisma.employee.create({
      data: emp
    })
  }

  console.log('Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
