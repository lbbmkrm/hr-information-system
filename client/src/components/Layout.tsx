import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";
import { useEffect, useState } from "react";
import { getEmployeeByUserId } from "../api/employeeApi.ts";
import type { Employee } from "../types/employee.ts";
import EmployeePolicy from "../policies/EmployeePolicy.ts";
import type { JwtPayload } from "../types/auth.ts";
import { getErrorMessage } from "../utils/getErrorMessage.ts";
import LeaveRequestPolicy from "../policies/LeaveRequestPolicy.ts";

export default function Layout() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [error, setError] = useState<string | null>(null);
    function handleLogout() {
        void logout();
        navigate("/login");
    }

    useEffect(() => {
        async function getEmployeeData(id: string) {
            try {
                const res = await getEmployeeByUserId(id);
                setEmployee(res);
            } catch (e) {
                console.error("Error getEmployeeData:", e);
                setError(getErrorMessage(e, "Gagal mengambil data karyawan."));
            }
        }

        void getEmployeeData(user?.userId as string);
    }, [user]);

    if (error) {
        return <div>{error}</div>;
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="flex items-center justify-between bg-white px-6 py-4 shadow">
                <div className="flex gap-4">
                    <Link to={"/dashboard"} className="font-bold">
                        HRIS
                    </Link>
                    {EmployeePolicy.viewAny(user as JwtPayload) && (
                        <Link to={"/employees"} className={"text-gray-600 hover:text-black"}>
                            Karyawan
                        </Link>
                    )}
                    {LeaveRequestPolicy.viewAny(user as JwtPayload) && (
                        <Link to={"/leave-requests"} className={"text-gray-600 hover:text-black"}>
                            Cuti
                        </Link>
                    )}
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
                    <Link
                        to={`/employees/${employee?.id}`}
                        state={employee?.id}
                        className={"text-sm text-gray-500"}
                    >
                        {user?.email}
                    </Link>
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
