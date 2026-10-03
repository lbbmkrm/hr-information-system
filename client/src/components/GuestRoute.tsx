import { useAuth } from "../contexts/AuthContext.tsx";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestRoute() {
    const { user } = useAuth();
    return user ? <Navigate to={"/dashboard"} replace={true} /> : <Outlet />;
}
