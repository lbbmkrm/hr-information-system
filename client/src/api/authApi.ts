import apiClient from "./client.ts";
import type { LoginResponse } from "../types/auth.ts";

export async function login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/api/auth/login", { email, password });
    return response.data;
}

export interface jwtPayload {
    id: string;
    email: string;
    role: string;
}
