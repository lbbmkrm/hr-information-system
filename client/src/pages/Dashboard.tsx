import {useAuth} from "../contexts/AuthContext.tsx";
import {useLocation} from "react-router-dom";
import type {JwtPayload} from "../types/auth.ts";

export default function Dashboard() {
    const location = useLocation();
    const authContext = useAuth();
    const user: JwtPayload | null = location.state?.user ?? authContext.user;
    return (
        <div>
            <h1>Dashboard</h1>
            <p>halo: {user?.email}</p>
        </div>
    );
}
