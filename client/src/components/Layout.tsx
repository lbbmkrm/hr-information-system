import { Outlet } from "react-router-dom";

import Header from "./Header.tsx";
import Sidebar from "./Sidebar.tsx";
import { useState } from "react";

export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div className="bg-bg flex min-h-screen">
            <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex min-w-0 flex-1 flex-col">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
