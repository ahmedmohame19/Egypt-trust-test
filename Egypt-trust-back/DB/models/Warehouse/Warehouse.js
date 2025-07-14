import mongoose from 'mongoose'

const { model, Schema } = mongoose

const warehouseSchema = new Schema(
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
    warehouseAdmin: { 
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
    collection: 'Warehouses',
    timestamps: true
  }
)

warehouseSchema.set('toJSON', { virtuals: true })
warehouseSchema.set('toObject', { virtuals: true })

export const Warehouse = model('Warehouses', warehouseSchema)
