import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, FileText } from "lucide-react";
import { Link } from "react-router-dom";

import type { LeaveRequest } from "../../types/leaveRequest.ts";
import { getLeaveRequests } from "../../api/leaveRequestApi.ts";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";
import StatusBadge from "../../components/ui/StatusBadge.tsx";

export default function ListLeaveRequests() {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLeaveRequests() {
            try {
                setLoading(true);
                setError(null);

                const data = await getLeaveRequests();
                setLeaveRequests(data);
            } catch (e) {
                console.error(e);

                setError(getErrorMessage(e, "Gagal mengambil daftar pengajuan cuti."));
            } finally {
                setLoading(false);
            }
        }

        void fetchLeaveRequests();
    }, []);

    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-text text-xl font-semibold">Pengajuan Cuti</h1>

                <p className="text-text-secondary mt-1 text-sm">
                    Lihat dan kelola pengajuan cuti karyawan.
                </p>
            </section>

            <section className="border-border bg-surface overflow-hidden rounded-lg border">
                <div className="border-border flex items-center justify-between border-b px-5 py-4">
                    <div>
                        <h2 className="text-text text-sm font-semibold">Semua Pengajuan</h2>

                        {!loading && !error && (
                            <p className="text-text-secondary mt-1 text-xs">
                                {leaveRequests.length} pengajuan
                            </p>
                        )}
                    </div>

                    <CalendarDays className="text-text-muted size-5" />
                </div>

                {loading ? (
                    <div className="space-y-4 p-5">
                        <div className="bg-bg h-4 w-1/3 animate-pulse rounded" />
                        <div className="bg-bg h-10 animate-pulse rounded" />
                        <div className="bg-bg h-10 animate-pulse rounded" />
                        <div className="bg-bg h-10 animate-pulse rounded" />
                    </div>
                ) : error ? (
                    <div className="p-6">
                        <p className="text-text text-sm font-medium">Gagal memuat pengajuan cuti</p>

                        <p className="text-text-secondary mt-1 text-sm">{error}</p>
                    </div>
                ) : leaveRequests.length === 0 ? (
                    <div className="flex flex-col items-center px-6 py-12 text-center">
                        <div className="bg-bg flex size-12 items-center justify-center rounded-full">
                            <FileText className="text-text-muted size-5" />
                        </div>

                        <h3 className="text-text mt-4 text-sm font-semibold">
                            Belum ada pengajuan cuti
                        </h3>

                        <p className="text-text-secondary mt-1 max-w-sm text-sm">
                            Pengajuan cuti yang dibuat oleh karyawan akan ditampilkan di sini.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] border-collapse text-left">
                            <thead>
                                <tr className="border-border bg-bg/60 border-b">
                                    <th className="text-text-secondary px-5 py-3 text-xs font-medium tracking-wide uppercase">
                                        Nama
                                    </th>

                                    <th className="text-text-secondary px-5 py-3 text-xs font-medium tracking-wide uppercase">
                                        Mulai
                                    </th>

                                    <th className="text-text-secondary px-5 py-3 text-xs font-medium tracking-wide uppercase">
                                        Berakhir
                                    </th>

                                    <th className="text-text-secondary px-5 py-3 text-xs font-medium tracking-wide uppercase">
                                        Status
                                    </th>

                                    <th className="text-text-secondary px-5 py-3 text-right text-xs font-medium tracking-wide uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-border divide-y">
                                {leaveRequests.map((leaveRequest) => (
                                    <tr
                                        key={leaveRequest.id}
                                        className="hover:bg-bg/50 transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="text-text text-sm font-medium">
                                                {leaveRequest.employee.name}
                                            </p>

                                            <p className="text-text-muted mt-0.5 text-xs">
                                                {leaveRequest.employee.department}
                                            </p>
                                        </td>

                                        <td className="text-text-secondary px-5 py-4 text-sm whitespace-nowrap">
                                            {new Date(leaveRequest.startDate).toLocaleDateString(
                                                "id-ID",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                },
                                            )}
                                        </td>

                                        <td className="text-text-secondary px-5 py-4 text-sm whitespace-nowrap">
                                            {new Date(leaveRequest.endDate).toLocaleDateString(
                                                "id-ID",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                },
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            <StatusBadge status={leaveRequest.status} />
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <Link
                                                to={`/leave-requests/${leaveRequest.id}`}
                                                state={leaveRequest}
                                                className="text-accent hover:text-accent-hover inline-flex items-center gap-1 text-sm font-medium transition"
                                            >
                                                Detail
                                                <ArrowRight className="size-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}
