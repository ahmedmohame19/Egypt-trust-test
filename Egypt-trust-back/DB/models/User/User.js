import mongoose from 'mongoose'

const { model, Schema } = mongoose

const usersechema = new Schema(
  {
    name: { type: String, default: 'User' },
    email: { type: String, required: true, unique: true },
    avatar: {
      type: String
    },
    password: { type: String, required: true },
    phoneNumber: { type: String, default: '' },
    role: {
      type: String,
      enum: ['Admin', 'WarehouseAdmin', 'BranchAdmin'],
      default: `BranchAdmin`
    },
    isActive: { type: Boolean, default: true }
  },
  {
    collection: 'Users',
    timestamps: true
  }
)

usersechema.set('toJSON', { virtuals: true })
usersechema.set('toObject', { virtuals: true })

export const User = model('Users', usersechema)
