import mongoose, { Schema, Model } from "mongoose";
import { IProject } from "../types";
import { ProjectStatus } from "../enums";

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },
    description: {
      type: String,
      default: null,
      maxlength: [100, "discription only contain 100 words"],
    },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.ACTIVE,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "projects",
  }
);

projectSchema.index({ organizationId: 1 });
projectSchema.index({ teamId: 1 });

export const Project: Model<IProject> = mongoose.model<IProject>(
  "Project",
  projectSchema
);
