import { CalendarDays, History, LayoutDashboard, LogOut, Users, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.tsx";
import { useEmployee } from "../contexts/EmployeeContext.tsx";
import EmployeePolicy from "../policies/EmployeePolicy.ts";
import LeaveRequestPolicy from "../policies/LeaveRequestPolicy.ts";
import type { JwtPayload } from "../types/auth.ts";

type SidebarProps = {
    open: boolean;
    onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
    const navigate = useNavigate();

    const { user, logout } = useAuth();
    const { employee } = useEmployee();

    function handleLogout() {
        void logout();
        navigate("/login");
    }

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
            isActive
                ? "bg-accent-soft text-accent font-medium"
                : "text-text-secondary hover:bg-bg hover:text-text"
        }`;

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/20 md:hidden"
                />
            )}

            <nav
                className={`bg-surface border-border fixed inset-y-0 left-0 z-50 w-60 transform border-r transition-transform duration-200 md:static md:z-auto md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"} `}
            >
                <div className="flex h-full flex-col p-4">
                    {/* Brand */}
                    <div className="flex items-center justify-between px-2 py-2">
                        <Link
                            to="/dashboard"
                            onClick={onClose}
                            className="text-text text-lg font-semibold"
                        >
                            HRIS
                        </Link>

                        <button
                            type="button"
                            onClick={onClose}
                            className="text-text-secondary hover:bg-bg hover:text-text rounded-md p-1 md:hidden"
                            aria-label="Close sidebar"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 flex flex-1 flex-col gap-6">
                        {/* Main */}
                        <div>
                            <p className="text-text-muted mb-2 px-2 text-xs font-medium tracking-wide uppercase">
                                Main
                            </p>

                            <ul className="space-y-1">
                                <li>
                                    <NavLink
                                        to="/dashboard"
                                        onClick={onClose}
                                        className={navLinkClass}
                                    >
                                        <LayoutDashboard className="size-4" />
                                        <span>Dashboard</span>
                                    </NavLink>
                                </li>

                                {EmployeePolicy.viewAny(user as JwtPayload) && (
                                    <li>
                                        <NavLink
                                            to="/employees"
                                            onClick={onClose}
                                            className={navLinkClass}
                                        >
                                            <Users className="size-4" />
                                            <span>Karyawan</span>
                                        </NavLink>
                                    </li>
                                )}

                                {LeaveRequestPolicy.viewAny(user as JwtPayload) && (
                                    <li>
                                        <NavLink
                                            to="/leave-requests"
                                            onClick={onClose}
                                            className={navLinkClass}
                                        >
                                            <CalendarDays className="size-4" />
                                            <span>Pengajuan Cuti</span>
                                        </NavLink>
                                    </li>
                                )}

                                <li>
                                    <NavLink
                                        to="/leave-requests/me"
                                        onClick={onClose}
                                        className={navLinkClass}
                                    >
                                        <History className="size-4" />
                                        <span>Riwayat Saya</span>
                                    </NavLink>
                                </li>
                            </ul>
                        </div>

                        {/* Administration */}
                        {user?.role === "ADMIN" && (
                            <div>
                                <p className="text-text-muted mb-2 px-2 text-xs font-medium tracking-wide uppercase">
                                    Administration
                                </p>

                                <ul className="space-y-1">
                                    <li>
                                        <NavLink
                                            to="/users"
                                            onClick={onClose}
                                            className={navLinkClass}
                                        >
                                            <Users className="size-4" />
                                            <span>Users</span>
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* User Area */}
                    <div className="border-border border-t pt-4">
                        {employee ? (
                            <Link
                                to={`/employees/${employee.id}`}
                                onClick={onClose}
                                className="hover:bg-bg block rounded-md px-2 py-2"
                            >
                                <p className="text-text text-sm font-medium">{employee.name}</p>

                                <p className="text-text-muted mt-0.5 truncate text-xs">
                                    {user?.email}
                                </p>
                            </Link>
                        ) : (
                            <div className="px-2 py-2">
                                <p className="text-text text-sm font-medium">{user?.role}</p>

                                <p className="text-text-muted mt-0.5 truncate text-xs">
                                    {user?.email}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleLogout}
                            className="text-text-secondary hover:bg-bg hover:text-text mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition"
                        >
                            <LogOut className="size-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}
