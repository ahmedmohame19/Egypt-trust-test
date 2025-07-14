import mongoose from 'mongoose'

const { model, Schema } = mongoose

const branchesSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true 
    },
    location: { 
      type: String, 
      required: true 
    },
    phoneNumber: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    branchAdmin: { 
      type: Schema.Types.ObjectId, 
      ref: 'Users', 
      required: true 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  {
    collection: 'Branches',
    timestamps: true
  }
)

branchesSchema.set('toJSON', { virtuals: true })
branchesSchema.set('toObject', { virtuals: true })

export const Branches = model('Branches', branchesSchema) 