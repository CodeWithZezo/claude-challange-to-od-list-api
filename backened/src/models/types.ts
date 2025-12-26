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

export interface IUser {
    _id:string;
    email:string
    password:string;
    firstName:string;
    lastName:string;
    role:string;
    isActive:Boolean;
    organizationId:string;
    lastLoginAt?:Date | null;
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ITeam {
    _id:string;
    name:string;
    description:string;
    organizationId:string;
     deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}