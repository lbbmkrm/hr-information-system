export type Role = "ADMIN" | "HR" | "EMPLOYEE";

export interface JwtPayload {
    userId: string;
    email: string;
    role: Role;
}

export interface LoginResponse {
    status: string;
    message: string;
    data: {
        user: {
            id: string;
            email: string;
            role: Role;
        };
        token: string;
    };
}
