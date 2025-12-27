import mongoose, { Schema, Model } from "mongoose";
import { IAttachment } from "../types";

const attachmentSchema = new Schema<IAttachment>(
  {
    filename: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minlength: [3, "fiename contain min 3 chracter"],
      maxlength: [30, "fiename contain max 30 chracter"],
    },
    fileUrl: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: false,
    collection: "attachments",
  }
);

attachmentSchema.index({ taskId: 1 });

export const Attachment: Model<IAttachment> = mongoose.model<IAttachment>(
  "Attachment",
  attachmentSchema
);
