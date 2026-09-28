import type { User } from "./userTypes.js";

export interface CreateEmployeeData {
    name: string;
    position: string;
    department: string;
    joinDate: Date;
    phone: string | null;
    userId: string | null;
}

export interface UpdateEmployeeData {
    name: string;
    position: string;
    department: string;
    joinDate: Date;
    phone: string | null;
    userId: string | null;
}

export interface EmployeeResponse {
    id: string;
    name: string;
    position: string;
    department: string;
    joinDate: Date;
    phone: string | null;
    userId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface EmployeeFilter {
    department: string;
    position: string;
    joinDate: Date;
}

export interface EmployeeWithRelations {
    id: string;
    name: string;
    user: User;
}
