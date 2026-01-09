import {Role} from '../models/enums'

export interface createUserDTO{
    email:string;
    password:string;
    firstName:string;
    lastName:string;
    role:Role;
    organizationId:string;
}