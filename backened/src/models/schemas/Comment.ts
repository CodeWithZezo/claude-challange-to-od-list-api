import mongoose, { Schema, Model } from 'mongoose';
import { IComment } from '../types';

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 2000,
      trim: true,
    },

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'comments',
  }
);

commentSchema.index({ taskId: 1 });

export const Comment: Model<IComment> = mongoose.model<IComment>(
  'Comment',
  commentSchema
);
