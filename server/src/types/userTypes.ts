import {Role} from "../generated/prisma/index.js"
export interface RegisterUserData {
    email: string;
    password: string;
}
export interface UpdateUserData {
    email?: string;
    password?: string;
    role?: Role;
}
export interface UserResponse {
    id: string;
    email: string;
    role: Role;
}

export interface LoginResponse {
    user: {
        id: string;
        email: string;
        role: Role;
    },
    token : string;
}
