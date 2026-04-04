import mongoose from 'mongoose'

const activityLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  location:  { type: String, required: true },
  event:     { type: String, required: true },
}, { _id: false })

const shipmentSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trackingNumber:  { type: String, default: null, sparse: true },
  origin:          { type: String, required: true },
  destination:     { type: String, required: true },
  cargoType:       { type: String, required: true },
  weight:          { type: String, required: true },
  dimensions:      { type: String, default: '' },
  specialHandling: {
    fragile:    { type: Boolean, default: false },
    hazmat:     { type: Boolean, default: false },
    perishable: { type: Boolean, default: false },
  },
  notes:            { type: String, default: '' },
  status:           { type: String, enum: ['Pending','In Transit','Delayed','Delivered','Cancelled'], default: 'Pending' },
  currentLocation:  { type: String, default: '' },
  currentLat:       { type: Number, default: null },
  currentLng:       { type: Number, default: null },
  estimatedDelivery:{ type: String, default: null },
  activityLog:      [activityLogSchema],
}, { timestamps: true })

export default mongoose.model('Shipment', shipmentSchema)
