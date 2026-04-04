import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({ email: String, password: { type: String, required: true } })
const User = mongoose.model('UserTemp', UserSchema, 'users')

async function reset() {
  await mongoose.connect(process.env.MONGO_URI)
  const email = 'obia.colin.100@gmail.com'
  const newPass = await bcrypt.hash('Password123!', 10)
  
  // Use a direct update since I'm already hashing it here
  const res = await User.findOneAndUpdate({ email }, { password: newPass }, { new: true })
  
  if (res) {
    console.log('Password reset successfully for:', email)
    console.log('Hash initialized with Password123!')
  } else {
    console.log('User not found:', email)
  }
  process.exit(0)
}

reset()
