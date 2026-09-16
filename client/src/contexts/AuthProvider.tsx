import {AuthContext} from "./AuthContext.tsx"
import {jwtDecode} from "jwt-decode";
import type {JwtPayload} from "../types/auth.ts";
import {type ReactNode, useState} from "react";
import apiClient from "../api/client.ts";

function getInitialUser(): JwtPayload | null{
    const token = localStorage.getItem("token");
    if (!token) {
        return null;
    }
    return jwtDecode<JwtPayload>(token);
}


export function AuthProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<JwtPayload | null>(getInitialUser());

    async function login(email: string, password: string): Promise<JwtPayload> {
        const response = await  apiClient.post("/auth/login", {email, password});
        localStorage.setItem("token", response.data.data.token);
        return response.data.data.user
    }

    async function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user,login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}