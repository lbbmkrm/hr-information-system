import {createContext, useContext} from "react";
import type {JwtPayload} from "../types/auth.ts";
interface AuthContextType {
    user: JwtPayload | null;
    login: (email: string, password: string) => Promise<JwtPayload>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(){
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within the AuthProvider");
    }

    return context;
}