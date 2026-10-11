import { useEffect, useState, type SubmitEvent } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import type { Employee } from "../../types/employee.ts";
import { getEmployeeByUserId } from "../../api/employeeApi.ts";
import { createLeaveRequest } from "../../api/leaveRequestApi.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";

export default function CreateLeaveRequest() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [employee, setEmployee] = useState<Employee | null>(null);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            return;
        }

        async function fetchEmployeeData() {
            try {
                setLoading(true);
                setError(null);

                const response = await getEmployeeByUserId(user?.userId as string);

                setEmployee(response);
            } catch (e) {
                console.error(e);

                if (e instanceof AxiosError && e.response?.status === 404) {
                    setError("Akun ini belum terhubung dengan data karyawan.");
                } else {
                    setError(getErrorMessage(e, "Gagal mengambil data karyawan."));
                }
            } finally {
                setLoading(false);
            }
        }

        void fetchEmployeeData();
    }, [user]);

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();

        if (!employee) {
            setError("Data karyawan tidak ditemukan.");
            return;
        }

        try {
            setSaving(true);
            setError(null);

            await createLeaveRequest({
                employeeId: employee.id,
                startDate,
                endDate,
                reason: reason || undefined,
            });

            navigate("/leave-requests/me");
        } catch (e) {
            console.error(e);
            setError(getErrorMessage(e, "Gagal membuat pengajuan cuti."));
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="bg-border h-7 w-56 animate-pulse rounded" />

                <div className="border-border bg-surface max-w-2xl rounded-lg border p-6">
                    <div className="space-y-5">
                        <div className="bg-bg h-10 animate-pulse rounded" />
                        <div className="bg-bg h-10 animate-pulse rounded" />
                        <div className="bg-bg h-10 animate-pulse rounded" />
                        <div className="bg-bg h-24 animate-pulse rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (error && !employee) {
        return (
            <div className="space-y-6">
                <div>
                    <Link
                        to="/leave-requests/me"
                        className="text-text-secondary hover:text-text mb-4 inline-flex items-center gap-2 text-sm transition"
                    >
                        <ArrowLeft size={16} />
                        Kembali
                    </Link>

                    <h1 className="text-text text-2xl font-semibold">Tambah Permintaan Cuti</h1>
                </div>

                <div className="border-rejected-bg bg-rejected-bg/40 text-rejected-text rounded-lg border px-4 py-3 text-sm">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl">
            <div className="mb-6">
                <Link
                    to="/leave-requests/me"
                    className="text-text-secondary hover:text-text mb-4 inline-flex items-center gap-2 text-sm transition"
                >
                    <ArrowLeft size={16} />
                    Kembali
                </Link>

                <h1 className="text-text text-2xl font-semibold">Tambah Permintaan Cuti</h1>

                <p className="text-text-secondary mt-1 text-sm">
                    Ajukan permintaan cuti untuk diproses oleh HR.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="border-border bg-surface rounded-lg border">
                <div className="border-border border-b px-6 py-5">
                    <h2 className="text-text text-sm font-semibold">Informasi Pengajuan</h2>
                </div>

                <div className="space-y-5 p-6">
                    {/* Employee */}
                    <div>
                        <label className="text-text mb-1.5 block text-sm font-medium">
                            Karyawan
                        </label>

                        <div className="border-border bg-bg rounded-md border px-3 py-2.5">
                            <p className="text-text text-sm font-medium">{employee?.name}</p>

                            <p className="text-text-secondary mt-0.5 text-xs">
                                {employee?.position} · {employee?.department}
                            </p>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="startDate"
                                className="text-text mb-1.5 block text-sm font-medium"
                            >
                                Tanggal Mulai
                            </label>

                            <input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                                className="border-border bg-surface text-text focus:border-accent focus:ring-accent-soft w-full rounded-md border px-3 py-2.5 text-sm transition outline-none focus:ring-2"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="endDate"
                                className="text-text mb-1.5 block text-sm font-medium"
                            >
                                Tanggal Berakhir
                            </label>

                            <input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                                className="border-border bg-surface text-text focus:border-accent focus:ring-accent-soft w-full rounded-md border px-3 py-2.5 text-sm transition outline-none focus:ring-2"
                            />
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <label
                            htmlFor="reason"
                            className="text-text mb-1.5 block text-sm font-medium"
                        >
                            Alasan
                        </label>

                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            placeholder="Masukkan alasan pengajuan cuti..."
                            className="border-border bg-surface text-text placeholder:text-text-muted focus:border-accent focus:ring-accent-soft w-full resize-none rounded-md border px-3 py-2.5 text-sm transition outline-none focus:ring-2"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="border-rejected-bg bg-rejected-bg/40 text-rejected-text rounded-md border px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="border-border flex items-center justify-end gap-3 border-t px-6 py-4">
                    <Link
                        to="/leave-requests/me"
                        className="border-border text-text-secondary hover:bg-bg hover:text-text rounded-md border px-4 py-2 text-sm font-medium transition"
                    >
                        Batal
                    </Link>

                    <button
                        type="submit"
                        disabled={saving || !employee}
                        className="bg-accent hover:bg-accent-hover inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Send size={16} />

                        {saving ? "Mengirim..." : "Kirim Pengajuan"}
                    </button>
                </div>
            </form>
        </div>
    );
}
