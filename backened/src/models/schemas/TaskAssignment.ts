import mongoose, { Schema, Model } from "mongoose";
import { ITaskAssignment } from "../types";

const taskAssignmentSchema = new Schema<ITaskAssignment>(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    collection: "task_assignments",
  }
);

taskAssignmentSchema.index({ taskId: 1, userId: 1 }, { unique: true });

export const TaskAssignment: Model<ITaskAssignment> =
  mongoose.model<ITaskAssignment>("TaskAssignment", taskAssignmentSchema);
