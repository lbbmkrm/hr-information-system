import type { EmployeeName } from "./employee.ts";

export interface User {
    id: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface UserWithEmployee {
    id: string;
    employee: EmployeeName;
}

export enum ROLE {
    ADMIN = "ADMIN",
    HR = "HR",
    EMPLOYEE = "EMPLOYEE",
}

export interface GetUsersFilter {
    role?: ROLE;
    createdAfter?: Date;
    createdBefore?: Date;
    assigned?: boolean;
}
