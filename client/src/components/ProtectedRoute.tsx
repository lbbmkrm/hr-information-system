import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";

export default function ProtectedRoute() {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" replace={true} state={{ from: location }} />;
    }

    return <Outlet />;
}
