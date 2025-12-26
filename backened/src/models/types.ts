import mongoose from "mongoose";

export interface IOrganization {
    _id: string;
    name: string;
    subdomain: string;
    plan: string;
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}