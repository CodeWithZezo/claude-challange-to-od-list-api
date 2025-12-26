import mongoose, { Schema, Model } from "mongoose";
import { ITask } from "../types";
import { TaskStatus, Priority } from "../enums";

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: [50, "enter less then 50"],
    },
    description: {
      type: String,
      default: null,
      maxlength: [300, "discription only contain 300 words"],
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    priority: {
      type: String,
      enum: Object.values(Priority),
      default: Priority.MEDIUM,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", default: null },
    position: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: "tasks",
  }
);

taskSchema.index({ projectId: 1 });
taskSchema.index({ creatorId: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });

export const Task: Model<ITask> = mongoose.model<ITask>("Task", taskSchema);
