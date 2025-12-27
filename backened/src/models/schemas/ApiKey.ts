import mongoose, { Schema, Model } from 'mongoose'
import { IApiKey } from '../types'

const apiKeySchema = new Schema<IApiKey>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },

  key: {
    type: String,
    required: true,
    unique: true,
    index: true,
    select: false, // ⛔ never leak API keys
  },

  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },

  lastUsedAt: {
    type: Date,
    default: null,
  },

  expiresAt: {
    type: Date,
    default: null,
    index: true,
  },

  deletedAt: {
    type: Date,
    default: null,
    index: true,
  },
}, {
  timestamps: true,
  collection: 'api_keys',
})

apiKeySchema.index({ key: 1 });

export const ApiKey: Model<IApiKey> = mongoose.model<IApiKey>('ApiKey', apiKeySchema)