import { AuthContext } from "./AuthContext.tsx";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/auth.ts";
import { type ReactNode, useState } from "react";
import apiClient from "../api/client.ts";

function getInitialUser(): JwtPayload | null {
    const token = localStorage.getItem("token");
    if (!token) {
        return null;
    }

    try {
        const payload = jwtDecode<JwtPayload & { exp?: number }>(token);
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            return null;
        }
        return payload;
    } catch {
        localStorage.removeItem("token");
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<JwtPayload | null>(getInitialUser());

    async function login(email: string, password: string): Promise<JwtPayload> {
        const response = await apiClient.post("/auth/login", { email, password });
        const token: string = response.data.data.token;
        localStorage.setItem("token", token);

        const authenticatedUser = jwtDecode<JwtPayload>(token);
        setUser(authenticatedUser);
        return authenticatedUser;
    }

    async function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
