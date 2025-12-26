import mongoose from "mongoose";
import { TeamRole } from "../enums";
import { ITeamMember } from "../types";

const teamMemberSchema = new mongoose.Schema<ITeamMember>(
  {
    userId: {
      type: String,
      ref: "User",
      requried: true,
    },
    teamId: {
      type: String,
      ref: "Team",
      requried: true,
    },
    role: {
      type: String,
      requried:true,
      enum: Object.values(TeamRole),
      default: TeamRole.MEMBER,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    collection: "team_members",
  }
);

teamMemberSchema.index({ userId: 1, teamId: 1 }, { unique: true });

export const TeamMember = mongoose.model<ITeamMember>(
  "TeamMember",
  teamMemberSchema
);
