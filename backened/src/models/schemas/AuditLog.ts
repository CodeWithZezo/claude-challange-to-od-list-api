import mongoose, { Schema, Model } from 'mongoose';
import { IAuditLog } from '../types';

const auditLogSchema = new Schema<IAuditLog>(
  {
    _id: { 
      type: String, 
      default: () => new mongoose.Types.ObjectId().toString() 
    },
    action: { 
      type: String, 
      required: true, 
      trim: true 
    },
    entity: { 
      type: String, 
      required: true, 
      trim: true 
    },
    entityId: { 
      type: String, 
      required: true, 
      trim: true 
    },
    userId: { 
      type: String, 
      ref: 'User', 
      required: true 
    },
    changes: { 
      type: Schema.Types.Mixed, 
      required: true 
    },
    ipAddress: { 
      type: String, 
      default: null 
    },
    userAgent: { 
      type: String, 
      default: null 
    }
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
    collection: 'audit_logs'
  }
);

// Indexes for efficient queries
auditLogSchema.index({ entityId: 1 });
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ entity: 1, action: 1 }); // Compound index for common queries

export const AuditLog: Model<IAuditLog> = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
