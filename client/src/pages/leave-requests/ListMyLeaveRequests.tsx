import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";

import type { LeaveRequest } from "../../types/leaveRequest.ts";
import { useEmployee } from "../../contexts/EmployeeContext.tsx";
import { deleteLeaveRequest, getLeaveRequestByEmployeeId } from "../../api/leaveRequestApi.ts";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";
import StatusBadge from "../../components/ui/StatusBadge.tsx";

export default function ListMyLeaveRequests() {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { employee, loading: employeeLoading, error: employeeError } = useEmployee();

    useEffect(() => {
        if (!employee) return;

        const employeeId = employee.id;

        async function fetchLeaveRequests(): Promise<void> {
            try {
                setLoading(true);
                setError(null);

                const response = await getLeaveRequestByEmployeeId(employeeId);

                setLeaveRequests(response);
            } catch (e) {
                console.error(e);

                setError(getErrorMessage(e, "Gagal mengambil riwayat pengajuan cuti."));
            } finally {
                setLoading(false);
            }
        }

        void fetchLeaveRequests();
    }, [employee]);

    async function handleDeleteLeaveRequest(leaveRequest: LeaveRequest): Promise<void> {
        const confirmed = window.confirm("Yakin ingin menghapus pengajuan cuti ini?");

        if (!confirmed) return;

        try {
            setDeletingId(leaveRequest.id);
            setError(null);

            await deleteLeaveRequest(leaveRequest.id);

            setLeaveRequests((current) =>
                current.filter((request) => request.id !== leaveRequest.id),
            );
        } catch (e) {
            console.error(e);

            setError(getErrorMessage(e, "Gagal menghapus pengajuan cuti."));
        } finally {
            setDeletingId(null);
        }
    }

    if (employeeLoading) {
        return (
            <div className="space-y-6">
                <div className="bg-border h-7 w-40 animate-pulse rounded" />

                <div className="border-border bg-surface overflow-hidden rounded-lg border">
                    <div className="border-border bg-bg h-12 animate-pulse border-b" />

                    <div className="space-y-3 p-4">
                        <div className="bg-bg h-12 animate-pulse rounded" />
                        <div className="bg-bg h-12 animate-pulse rounded" />
                        <div className="bg-bg h-12 animate-pulse rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (employeeError) {
        return (
            <div className="border-rejected-bg bg-rejected-bg/40 text-rejected-text rounded-lg border px-4 py-3 text-sm">
                {employeeError}
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="border-border bg-surface text-text-secondary rounded-lg border px-5 py-4 text-sm">
                Anda belum terhubung ke data karyawan.
            </div>
        );
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="bg-border h-7 w-40 animate-pulse rounded" />
                        <div className="bg-border mt-2 h-4 w-64 animate-pulse rounded" />
                    </div>

                    <div className="bg-border h-9 w-32 animate-pulse rounded" />
                </div>

                <div className="border-border bg-surface overflow-hidden rounded-lg border">
                    <div className="border-border bg-bg h-12 animate-pulse border-b" />

                    <div className="space-y-3 p-4">
                        <div className="bg-bg h-12 animate-pulse rounded" />
                        <div className="bg-bg h-12 animate-pulse rounded" />
                        <div className="bg-bg h-12 animate-pulse rounded" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-text text-2xl font-semibold">Cuti Saya</h1>

                    <p className="text-text-secondary mt-1 text-sm">Riwayat pengajuan cuti Anda.</p>
                </div>

                <Link
                    to="/leave-requests/add"
                    className="bg-accent hover:bg-accent-hover inline-flex w-fit items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition"
                >
                    <Plus size={16} />
                    Ajukan Cuti
                </Link>
            </div>

            {/* Error */}
            {error && (
                <div className="border-rejected-bg bg-rejected-bg/40 text-rejected-text rounded-md border px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            {/* Empty state */}
            {leaveRequests.length === 0 && !error && (
                <div className="border-border bg-surface rounded-lg border px-6 py-12 text-center">
                    <p className="text-text text-sm font-medium">Belum ada pengajuan cuti</p>

                    <p className="text-text-secondary mt-1 text-sm">
                        Anda belum memiliki riwayat pengajuan cuti.
                    </p>

                    <Link
                        to="/leave-requests/add"
                        className="text-accent hover:text-accent-hover mt-4 inline-flex items-center gap-2 text-sm font-medium"
                    >
                        Ajukan cuti
                        <ArrowRight size={15} />
                    </Link>
                </div>
            )}

            {/* Table */}
            {leaveRequests.length > 0 && (
                <div className="border-border bg-surface overflow-hidden rounded-lg border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead>
                                <tr className="border-border bg-bg border-b">
                                    <th className="text-text-secondary px-5 py-3 font-medium">
                                        Tanggal Mulai
                                    </th>

                                    <th className="text-text-secondary px-5 py-3 font-medium">
                                        Tanggal Selesai
                                    </th>

                                    <th className="text-text-secondary px-5 py-3 font-medium">
                                        Alasan
                                    </th>

                                    <th className="text-text-secondary px-5 py-3 font-medium">
                                        Status
                                    </th>

                                    <th className="text-text-secondary px-5 py-3 text-right font-medium">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {leaveRequests.map((leaveRequest) => (
                                    <tr
                                        key={leaveRequest.id}
                                        className="border-border border-b last:border-b-0"
                                    >
                                        <td className="text-text px-5 py-4 whitespace-nowrap">
                                            {new Date(leaveRequest.startDate).toLocaleDateString(
                                                "id-ID",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                },
                                            )}
                                        </td>

                                        <td className="text-text px-5 py-4 whitespace-nowrap">
                                            {new Date(leaveRequest.endDate).toLocaleDateString(
                                                "id-ID",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                },
                                            )}
                                        </td>

                                        <td className="text-text-secondary max-w-xs px-5 py-4">
                                            <span className="block truncate">
                                                {leaveRequest.reason || "-"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <StatusBadge status={leaveRequest.status} />
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    to={`/leave-requests/${leaveRequest.id}`}
                                                    className="text-text-secondary hover:text-text transition"
                                                >
                                                    Lihat
                                                </Link>

                                                <Link
                                                    to={`/leave-requests/edit/${leaveRequest.id}`}
                                                    className="text-accent hover:text-accent-hover transition"
                                                >
                                                    Ubah
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        void handleDeleteLeaveRequest(leaveRequest)
                                                    }
                                                    disabled={deletingId === leaveRequest.id}
                                                    className="text-rejected-text transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {deletingId === leaveRequest.id
                                                        ? "Menghapus..."
                                                        : "Hapus"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
