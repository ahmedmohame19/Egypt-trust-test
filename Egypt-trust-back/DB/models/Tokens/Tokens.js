import mongoose from 'mongoose'

const { model, Schema } = mongoose

const tokensSchema = new Schema(
  {
    tokenType: {
      type: String,
      required: true,
      enum: ['Personal', 'Business']
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['Available', 'Assigned', 'Used', 'Expired', 'Damaged'],
      default: 'Available'
    },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: 'Warehouses',
      required: true
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'Users'
    },
    assignedToBranch: {
      type: Schema.Types.ObjectId,
      ref: 'Branches'
    },
    expiryDate: {
      type: Date
    },
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    price: {
      type: Number,
      required: true
    },
    notes: {
      type: String
    }
  },
  {
    collection: 'Tokens',
    timestamps: true
  }
)

tokensSchema.set('toJSON', { virtuals: true })
tokensSchema.set('toObject', { virtuals: true })

export const Tokens = model('Tokens', tokensSchema)
