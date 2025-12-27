import mongoose, { Schema, Model } from 'mongoose'
import { IWebhook } from '../types'

const webhookSchema = new Schema<IWebhook>({
  url: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [
      /^(https?):\/\/[^\s/$.?#].[^\s]*$/,
      'Invalid webhook URL',
    ],
    index: true,
  },

  events: {
    type: [String],
    required: true,
    default: [],
    index: true,
  },

  secret: {
    type: String,
    required: true,
    select: false, // ⛔ never expose webhook secrets
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },

  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },

  deletedAt: {
    type: Date,
    default: null,
    index: true,
  },
}, {
  timestamps: true,
  collection: 'webhooks',
})


webhookSchema.index({ organizationId: 1 });


export const Webhook: Model<IWebhook> = mongoose.model<IWebhook>('Webhook', webhookSchema)
