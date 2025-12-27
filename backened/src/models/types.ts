import { Types, Document } from "mongoose";

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
  isActive: boolean;
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
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: Date;
  projectId: Types.ObjectId;
  creatorId: Types.ObjectId;
  parentId?: Types.ObjectId | null;
  position: number;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITaskAssignment {
  taskId: Types.ObjectId;
  userId: Types.ObjectId;
  assignedAt: Date;
}

export interface ITaskDependency {
  taskId: Types.ObjectId;
  dependsOnTaskId: Types.ObjectId;
  createdAt: Date;
}

export interface IAttachment {
  filename: string;
  fileUrl: string;
  uploadedBy: Types.ObjectId;
  fileSize: number;
  mimeType: string;
  taskId: Types.ObjectId;
  uploadedAt: Date;
  deletedAt?: Date | null;
}

export interface IComment {
  content: string;
  taskId: Types.ObjectId;
  userId: Types.ObjectId;
  deletedAt?: Date | null;
}

export interface IApiKey {
  name: string;
  key: string;
  organizationId: Types.ObjectId;
  isActive: boolean;
  lastUsedAt?: Date | null;
  expiresAt?: Date | null;
  deletedAt?: Date | null;
}

export interface IWebhook {
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  organizationId: Types.ObjectId;
  deletedAt?: Date | null;
}

export interface IWebhookDelivery {
  webhookId: Types.ObjectId;
  event: string;
  payload: any;
  status: string;
  attempts: number;
  lastAttempt?: Date | null;
  nextRetry?: Date | null;
  response?: string | null;
  deletedAt?: Date | null;
}

export interface IRefreshToken extends Document {
  _id: Types.ObjectId;
  token: string;
  userId: Types.ObjectId;
  expiresAt: Date;
  revokedAt?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuditLog {
  _id?: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  changes: Record<string, any>;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt?: Date;
}
