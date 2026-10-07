import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.tsx";

type HeaderProps = {
    onMenuClick: () => void;
};

export default function Header({
    onMenuClick,
}: HeaderProps) {
    const location = useLocation();
    const { user } = useAuth();

    function getPageTitle(pathname: string) {
        if (pathname === "/dashboard") {
            return "Dashboard";
        }

        if (pathname === "/employees") {
            return "Karyawan";
        }

        if (pathname.startsWith("/employees/")) {
            return "Detail Karyawan";
        }

        if (pathname === "/leave-requests") {
            return "Pengajuan Cuti";
        }

        if (pathname === "/leave-requests/me") {
            return "Riwayat Saya";
        }

        if (pathname.startsWith("/leave-requests/")) {
            return "Detail Pengajuan Cuti";
        }

        if (pathname === "/users") {
            return "Users";
        }

        if (pathname.startsWith("/users/")) {
            return "Detail User";
        }

        return "HRIS";
    }

    const pageTitle = getPageTitle(location.pathname);

    return (
        <header className="h-16 shrink-0 bg-surface border-b border-border">
            <div className="h-full flex items-center justify-between px-4 md:px-6">

                {/* Left */}
                <div className="flex items-center gap-3">

                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="rounded-md p-2 text-text-secondary hover:bg-bg hover:text-text md:hidden"
                        aria-label="Open sidebar"
                    >
                        <Menu className="size-5" />
                    </button>

                    <p className="text-sm font-medium text-text">
                        {pageTitle}
                    </p>
                </div>

                {/* User */}
                <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium text-text">
                        {user?.role}
                    </p>

                    <p className="text-xs text-text-muted">
                        {user?.email}
                    </p>
                </div>
            </div>
        </header>
    );
}