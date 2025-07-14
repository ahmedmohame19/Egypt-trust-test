import mongoose from 'mongoose'

const { model, Schema } = mongoose

const requestsSchema = new Schema(
  {
    requestingBranch: {
      type: Schema.Types.ObjectId,
      ref: 'Branches',
      required: true
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: 'Warehouses',
      required: true
    },
    tokenType: {
      type: String,
      required: true,
      enum: ['Personal', 'Business']
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users'
    },
    approvedAt: {
      type: Date
    },
    notes: {
      type: String
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    expectedDeliveryDate: {
      type: Date
    },
    actualDeliveryDate: {
      type: Date
    }
  },
  {
    collection: 'Requests',
    timestamps: true
  }
)

requestsSchema.set('toJSON', { virtuals: true })
requestsSchema.set('toObject', { virtuals: true })

export const Requests = model('Requests', requestsSchema)
