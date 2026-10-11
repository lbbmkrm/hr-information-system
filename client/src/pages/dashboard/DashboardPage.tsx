import { CalendarDays, CheckCircle2, Clock3, UserRound, Users, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { getDashboard } from "../../api/dashboardApi.ts";
import { ErrorState } from "../../components/ui/ErrorState.tsx";
import StatCard from "../../components/ui/StatCard.tsx";
import StatusBadge from "../../components/ui/StatusBadge.tsx";
import type { DashboardData, DashboardStatVariant } from "../../types/dashboard.ts";

const statIcons = {
    employees: Users,
    users: UserRound,
    requests: CalendarDays,
    pending: Clock3,
    approved: CheckCircle2,
    rejected: XCircle,
} satisfies Record<DashboardStatVariant, typeof Users>;

const dashboardDescriptions = {
    ADMIN: "Berikut ringkasan informasi organisasi saat ini.",
    HR: "Berikut ringkasan pengajuan cuti dan data karyawan yang perlu dipantau.",
    EMPLOYEE: "Berikut ringkasan pengajuan cuti Anda.",
} satisfies Record<DashboardData["role"], string>;

export default function DashboardPage() {
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadDashboard() {
            try {
                setLoading(true);
                setError(null);

                const dashboardData = await getDashboard();
                setDashboard(dashboardData);
            } catch {
                setError("Gagal memuat data dashboard.");
            } finally {
                setLoading(false);
            }
        }

        void loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <p className="text-text-secondary text-sm">Memuat dashboard...</p>
            </div>
        );
    }

    if (error || !dashboard) {
        return <ErrorState message={error ?? "Data dashboard tidak tersedia."} />;
    }

    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-text text-xl font-semibold">Selamat datang kembali</h1>

                <p className="text-text-secondary mt-1 text-sm">
                    {dashboardDescriptions[dashboard.role]}
                </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {dashboard.stats.map((stat) => (
                    <StatCard
                        key={stat.key}
                        label={stat.label}
                        value={stat.value}
                        icon={statIcons[stat.variant]}
                    />
                ))}
            </section>

            <section className="border-border bg-surface rounded-lg border">
                <div className="border-border border-b px-5 py-4">
                    <h2 className="text-text text-sm font-semibold">Pengajuan Cuti Terbaru</h2>

                    <p className="text-text-secondary mt-1 text-xs">
                        Lima pengajuan cuti terakhir.
                    </p>
                </div>

                {dashboard.recentLeaveRequests.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                        <p className="text-text-secondary text-sm">Belum ada pengajuan cuti.</p>
                    </div>
                ) : (
                    <div className="divide-border divide-y">
                        {dashboard.recentLeaveRequests.map((request) => (
                            <div
                                key={request.id}
                                className="flex items-center justify-between gap-4 px-5 py-4"
                            >
                                <div className="min-w-0">
                                    <p className="text-text truncate text-sm font-medium">
                                        {request.employee.name}
                                    </p>

                                    <p className="text-text-secondary mt-1 text-xs">
                                        {request.employee.department}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-4">
                                    <div className="hidden text-right sm:block">
                                        <p className="text-text-secondary text-xs">
                                            {request.startDate.slice(0, 10)}
                                            {" - "}
                                            {request.endDate.slice(0, 10)}
                                        </p>
                                    </div>

                                    <StatusBadge status={request.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
