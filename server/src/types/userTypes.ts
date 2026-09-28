import { Role } from "../generated/prisma/index.js";

export interface User {
    id: string;
    email: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserData {
    email: string;
    password: string;
}
export interface UpdateUserData {
    email?: string;
    password?: string;
    role?: Role;
}
export interface UsersResponse {
    id: string;
    email: string;
    role: Role;
    createdAt: Date;
}
export interface UserResponse {
    id: string;
    email: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    employee: {
        id: string;
        name: string;
        position: string;
        department: string;
    } | null;
}

export interface GetUsersFilter {
    role?: Role;
    createdAfter?: Date;
    createdBefore?: Date;
    assigned: boolean;
}

export interface LoginResponse {
    user: {
        id: string;
        email: string;
        role: Role;
    };
    token: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}
