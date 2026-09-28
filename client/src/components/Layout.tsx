import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";

export default function Layout() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    function handleLogout() {
        void logout();
        navigate("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="flex items-center justify-between bg-white px-6 py-4 shadow">
                <div className="flex gap-4">
                    <Link to={"/dashboard"} className="font-bold">
                        HRIS
                    </Link>
                    <Link to={"/employees"} className={"text-gray-600 hover:text-black"}>
                        Karyawan
                    </Link>
                    <Link to={"/leave-requests"} className={"text-gray-600 hover:text-black"}>
                        Cuti
                    </Link>
                    <Link to={"/leave-requests/me"} className={"text-gray-600 hover:text-black"}>
                        Riwayat Saya
                    </Link>
                    {user?.role === "ADMIN" && (
                        <Link to={"/users"} className={"text-gray-600 hover:text-black"}>
                            Users
                        </Link>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <span className={"text-sm text-gray-500"}>{user?.email}</span>
                    <button
                        onClick={handleLogout}
                        className={"text-sm text-red-500 hover:text-red-700"}
                    >
                        Logout
                    </button>
                </div>
            </nav>
            <main>
                <Outlet />
            </main>
        </div>
    );
}
