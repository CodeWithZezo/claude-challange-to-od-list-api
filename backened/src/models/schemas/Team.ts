import mongoose from "mongoose";
import { ITeam } from "../types";
const teamSchema = new mongoose.Schema<ITeam>(
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
      maxlength: [300, "discription only contain 300 words"],
    },
    organizationId: {
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
    collection: "teams",
  }
);

teamSchema.index({ organizationId: 1 });

export const Team = mongoose.model<ITeam>("Team", teamSchema);
