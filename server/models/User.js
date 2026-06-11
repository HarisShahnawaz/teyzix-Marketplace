import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['customer', 'provider', 'admin'], 
    default: 'customer' 
  },
  // Service Provider Specific Fields
  avatar: { type: String, default: '' },
  skills: [{ type: String }],
  experience: { type: String, default: '' },
  pricing: { type: Number, default: 0 },
  portfolio: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('User', UserSchema);