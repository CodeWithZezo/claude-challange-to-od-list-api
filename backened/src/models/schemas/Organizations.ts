import mongoose from "mongoose";
import { Plan } from "../enums";
import { IOrganization } from "../types";

const OrganizationSchema = new mongoose.Schema<IOrganization>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: [3, "Organization name must be at least 3 characters long"],
      maxLength: [50, "Organization name must be at most 50 characters long"],
      index: true,
      validate: {
        validator: function (v: string) {
          return v.length >= 3 && v.length <= 50 && /^[a-z0-9\s]+$/.test(v);
        },
        message: "Organization name must be between 3 and 50 characters long",
      },
    },
    subdomain: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: [3, "Subdomain must be at least 3 characters long"],
      maxLength: [30, "Subdomain must be at most 30 characters long"],
      index: true,
      validate: {
        validator: function (v: string) {
          return v.length >= 3 && v.length <= 30 && /^[a-z0-9-]+$/.test(v);
        },
        message:
          "Subdomain must be between 3 and 30 characters long and contain only lowercase letters, numbers, and hyphens",
      },
    },
    plan: {
      type: String,
      default: Plan.FREE,
      required: true,
      enum: Object.values(Plan),
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "organizations",
  }
);

OrganizationSchema.index({ subdomain: 1 });

OrganizationSchema.virtual("users", {
  ref: "User",
  localField: "_id",
  foreignField: "organizationId",
});

OrganizationSchema.virtual("teams", {
  ref: "Team",
  localField: "_id",
  foreignField: "organizationId",
});

export const Organization = mongoose.model<IOrganization>(
  "Organization",
  OrganizationSchema
);
