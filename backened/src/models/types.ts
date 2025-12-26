import { Types } from "mongoose";

export interface IOrganization {
  _id: Types.ObjectId;
  name: string;
  subdomain: string;
  plan: string;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: Boolean;
  organizationId: Types.ObjectId;
  lastLoginAt?: Date | null;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITeam {
  _id: Types.ObjectId;
  name: string;
  description: string;
  organizationId: Types.ObjectId;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITeamMember {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  teamId: Types.ObjectId;
  joinedAt?: Date;
  role: string;
}

export interface IProject {
  _id: Types.ObjectId;
  name: string;
  description: string;
  status: string;
  organizationId: Types.ObjectId;
  teamId: Types.ObjectId;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITask {
  _id: Types.ObjectId;
  title:string;
  description:string;
  status:string;
  priority:string;
  dueDate:Date;
  projectId:Types.ObjectId;
  creatorId:Types.ObjectId;
  parentId:Types.ObjectId;
  position:number;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
