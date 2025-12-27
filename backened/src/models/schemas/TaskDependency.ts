import mongoose, { Schema, Model } from "mongoose";
import { ITaskDependency } from "../types";

const taskDependencySchema = new Schema<ITaskDependency>(
  {
    taskId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Task",
         required: true 
        },
    dependsOnTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    collection: "task_dependencies",
  }
);

taskDependencySchema.index({ taskId: 1, dependsOnTaskId: 1 }, { unique: true });

export const TaskDependency: Model<ITaskDependency> =
  mongoose.model<ITaskDependency>("TaskDependency", taskDependencySchema);
