import mongoose, { Schema, Model } from 'mongoose'
import { IWebhookDelivery } from '../types'
import { DeliveryStatus } from '../enums'

const webhookDeliverySchema = new Schema<IWebhookDelivery>({
  webhookId: {
    type: Schema.Types.ObjectId,
    ref: 'Webhook',
    required: true,
    index: true,
  },

  event: {
    type: String,
    required: true,
    index: true,
  },

  payload: {
    type: Schema.Types.Mixed,
    required: true,
  },

  status: {
    type: String,
    enum: Object.values(DeliveryStatus),
    default: DeliveryStatus.PENDING,
    index: true,
  },

  attempts: {
    type: Number,
    default: 0,
    min: 0,
    max: 10, // ⛔ protect from infinite retry loops
  },

  lastAttempt: {
    type: Date,
    default: null,
  },

  nextRetry: {
    type: Date,
    default: null,
    index: true,
  },

  response: {
    type: String,
    default: null,
  },

  deletedAt: {
    type: Date,
    default: null,
    index: true,
  },
}, {
  timestamps: true,
  collection: 'webhook_deliveries',
})

webhookDeliverySchema.index({ webhookId: 1 });
webhookDeliverySchema.index({ status: 1 });

export const WebhookDelivery: Model<IWebhookDelivery> = mongoose.model<IWebhookDelivery>('WebhookDelivery', webhookDeliverySchema);
