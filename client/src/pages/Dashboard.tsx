import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/auth.ts";

export default function Dashboard() {
    const token = localStorage.getItem("token");
    if (!token) {
        return <p>unauthenticated</p>;
    }
    const user = jwtDecode<JwtPayload>(token as string);
    return (
        <div>
            <h1>Dashboard</h1>
            <p>halo: {user.email}</p>
        </div>
    );
}
