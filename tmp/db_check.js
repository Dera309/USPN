import 'dotenv/config'
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({ email: String, role: String })
const User = mongoose.model('User', UserSchema)

const ShipmentSchema = new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, trackingNumber: String, origin: String, destination: String })
const Shipment = mongoose.model('Shipment', ShipmentSchema)

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    const users = await User.find({}, 'email role')
    const shipments = await Shipment.find({})
    
    console.log('--- USERS ---')
    users.forEach(u => console.log(`ID: ${u._id} | Email: ${u.email} | Role: ${u.role}`))
    
    console.log('\n--- SHIPMENTS ---')
    shipments.forEach(s => console.log(`ID: ${s._id} | UserID: ${s.userId} | Tracking: ${s.trackingNumber} | ${s.origin} -> ${s.destination}`))
    
    process.exit(0)
  } catch (err) {
    console.error('Check failed:', err.message)
    process.exit(1)
  }
}

check()
