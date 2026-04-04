import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 8 },
  role:      { type: String, enum: ['user', 'admin'], default: 'user' },
  status:    { type: String, enum: ['active', 'suspended'], default: 'active' },
  phone:     { type: String, default: '' },
}, { timestamps: true })

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.matchPassword = function(plain) {
  return bcrypt.compare(plain, this.password)
}

// Never return password in JSON responses
userSchema.set('toJSON', {
  transform(doc, ret) { delete ret.password; return ret }
})

export default mongoose.model('User', userSchema)
