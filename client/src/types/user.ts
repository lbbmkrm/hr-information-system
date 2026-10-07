export enum ROLE {
    ADMIN = "ADMIN",
    HR = "HR",
    EMPLOYEE = "EMPLOYEE",
}

export interface User {
    id: string;
    email: string;
    role: ROLE;
    createdAt: string;
    updatedAt: string;
    employee?: {
        id: string;
        name: string;
        position?: string;
        department?: string;
    } | null;
}

export interface GetUsersFilter {
    role?: ROLE;
    createdAfter?: Date;
    createdBefore?: Date;
    assigned?: boolean;
}

export interface CreateUserPayload {
    email: string;
    password: string;
}

export interface EditUserPayload {
    email?: string;
    password?: string;
    role?: ROLE;
}
