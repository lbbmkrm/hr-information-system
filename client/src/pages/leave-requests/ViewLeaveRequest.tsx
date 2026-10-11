import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, ClipboardCheck, FileText, User } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import type { LeaveRequest } from "../../types/leaveRequest.ts";
import { getLeaveRequestById } from "../../api/leaveRequestApi.ts";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";
import LeaveRequestPolicy from "../../policies/LeaveRequestPolicy.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";
import type { JwtPayload } from "../../types/auth.ts";
import StatusBadge from "../../components/ui/StatusBadge.tsx";

export default function ViewLeaveRequest() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { user } = useAuth();

    const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(
        (location.state as LeaveRequest) ?? null,
    );

    const [loading, setLoading] = useState(!location.state);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (location.state) {
            return;
        }

        if (!id) {
            setError("ID pengajuan cuti tidak ditemukan.");
            setLoading(false);
            return;
        }

        async function fetchLeaveRequest() {
            try {
                setLoading(true);
                setError(null);

                const data = await getLeaveRequestById(id as string);

                setLeaveRequest(data);
            } catch (e) {
                console.error(e);

                setError(getErrorMessage(e, "Gagal mengambil data pengajuan cuti."));
            } finally {
                setLoading(false);
            }
        }

        void fetchLeaveRequest();
    }, [id, location.state]);

    if (loading) {
        return (
            <div className="max-w-3xl space-y-6">
                <div className="bg-bg h-5 w-48 animate-pulse rounded" />

                <div className="border-border bg-surface rounded-lg border p-6">
                    <div className="space-y-5">
                        <div className="bg-bg h-5 w-48 animate-pulse rounded" />
                        <div className="bg-bg h-10 animate-pulse rounded" />
                        <div className="bg-bg h-10 animate-pulse rounded" />
                        <div className="bg-bg h-10 animate-pulse rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !leaveRequest) {
        return (
            <div className="border-border bg-surface rounded-lg border p-6">
                <p className="text-text text-sm font-medium">Gagal memuat pengajuan cuti</p>

                <p className="text-text-secondary mt-1 text-sm">
                    {error ?? "Data pengajuan cuti tidak ditemukan."}
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/leave-requests")}
                    className="text-accent hover:text-accent-hover mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition"
                >
                    <ArrowLeft className="size-4" />
                    Kembali ke pengajuan cuti
                </button>
            </div>
        );
    }

    const canReview = LeaveRequestPolicy.review(user as JwtPayload, leaveRequest);

    const formattedStartDate = new Date(leaveRequest.startDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const formattedEndDate = new Date(leaveRequest.endDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="max-w-3xl space-y-6">
            <Link
                to="/leave-requests"
                className="text-text-secondary hover:text-text inline-flex items-center gap-1.5 text-sm transition"
            >
                <ArrowLeft className="size-4" />
                Kembali ke pengajuan cuti
            </Link>

            <section className="border-border bg-surface rounded-lg border">
                <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-accent-soft text-accent flex size-14 shrink-0 items-center justify-center rounded-full">
                            <CalendarDays className="size-6" />
                        </div>

                        <div>
                            <h1 className="text-text text-xl font-semibold">
                                Detail Pengajuan Cuti
                            </h1>

                            <p className="text-text-secondary mt-1 text-sm">
                                {leaveRequest.employee?.name ?? "-"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <StatusBadge status={leaveRequest.status} />

                        {canReview && (
                            <Link
                                to={`/leave-requests/edit/${leaveRequest.id}/status`}
                                state={leaveRequest}
                                className="bg-accent hover:bg-accent-hover inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white transition"
                            >
                                <ClipboardCheck className="size-4" />
                                Review
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            <section className="border-border bg-surface rounded-lg border">
                <div className="border-border border-b px-5 py-4">
                    <h2 className="text-text text-sm font-semibold">Informasi Pengajuan</h2>

                    <p className="text-text-secondary mt-1 text-xs">
                        Informasi mengenai pengajuan cuti karyawan.
                    </p>
                </div>

                <div className="grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2">
                    <div className="flex gap-3">
                        <User className="text-text-muted mt-0.5 size-4 shrink-0" />

                        <div>
                            <p className="text-text-muted text-xs">Nama Karyawan</p>

                            <p className="text-text mt-1 text-sm font-medium">
                                {leaveRequest.employee?.name ?? "-"}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <CalendarDays className="text-text-muted mt-0.5 size-4 shrink-0" />

                        <div>
                            <p className="text-text-muted text-xs">Periode Cuti</p>

                            <p className="text-text mt-1 text-sm font-medium">
                                {formattedStartDate}
                                {" — "}
                                {formattedEndDate}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <FileText className="text-text-muted mt-0.5 size-4 shrink-0" />

                        <div className="sm:col-span-2">
                            <p className="text-text-muted text-xs">Alasan</p>

                            <p className="text-text mt-1 text-sm font-medium">
                                {leaveRequest.reason || "Tidak ada alasan."}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <ClipboardCheck className="text-text-muted mt-0.5 size-4 shrink-0" />

                        <div>
                            <p className="text-text-muted text-xs">Status</p>

                            <div className="mt-1">
                                <StatusBadge status={leaveRequest.status} />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <User className="text-text-muted mt-0.5 size-4 shrink-0" />

                        <div>
                            <p className="text-text-muted text-xs">Direview Oleh</p>

                            <p className="text-text mt-1 text-sm font-medium">
                                {leaveRequest.reviewer?.email ?? "Belum direview"}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
