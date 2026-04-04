import 'dotenv/config'
import mongoose from 'mongoose'
import User from './models/User.js'
import Shipment from './models/Shipment.js'

try {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  })
  console.log('Connected to MongoDB')

  await User.deleteMany({})
  await Shipment.deleteMany({})
  console.log('Cleared existing data')

  const admin = await User.create({
    name: 'Admin',
    email: 'unitedstatespsn4@gmail.com',
    password: 'Edozie@sp4',
    role: 'admin'
  })

  const jane = await User.create({
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  })

  const s1 = await Shipment.create({
    userId: jane._id,
    trackingNumber: 'USPN-9928-EL',
    origin: 'Hamburg, Germany',
    destination: 'Tokyo, Japan',
    cargoType: 'Industrial Equipment',
    weight: '1240',
    dimensions: '120x80x100',
    specialHandling: { fragile: true, hazmat: false, perishable: false },
    status: 'In Transit',
    currentLocation: 'Dubai Transit Hub',
    currentLat: 25.2048,
    currentLng: 55.2708,
    estimatedDelivery: '2024-10-28',
    activityLog: [
      { location: 'Hamburg, Germany', event: 'Shipment booked. Awaiting processing.' },
      { location: 'Hamburg Container Terminal, Germany', event: 'Departed Port of Departure' },
      { location: 'Dubai Central Logistics Park, UAE', event: 'Arrived at Sort Facility' },
    ]
  })

  const s2 = await Shipment.create({
    userId: jane._id,
    trackingNumber: 'USPN-9011-BX',
    origin: 'London, UK',
    destination: 'Berlin, Germany',
    cargoType: 'Electronics',
    weight: '320',
    dimensions: '60x40x30',
    specialHandling: { fragile: true, hazmat: false, perishable: false },
    status: 'Delayed',
    currentLocation: 'London Heathrow Hub',
    currentLat: 51.4700,
    currentLng: -0.4543,
    activityLog: [
      { location: 'London, UK', event: 'Shipment booked. Awaiting processing.' },
      { location: 'London Heathrow Hub', event: 'Delay: Customs hold' },
    ]
  })

  console.log('Seeded successfully:')
  console.log(' Admin:', admin.email)
  console.log(' User: ', jane.email)
  console.log(' Shipments:', s1.trackingNumber, s2.trackingNumber)

} catch (err) {
  console.error('Seed failed:', err.message)
  process.exit(1)
} finally {
  await mongoose.disconnect()
  process.exit(0)
}
