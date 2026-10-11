import { type ChangeEvent, type SubmitEvent, useEffect, useState } from "react";
import type {
    LeaveRequest,
    LeaveRequestUpdateStatus,
    Status as LeaveStatus,
} from "../../types/leaveRequest.ts";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getLeaveRequestById, updateLeaveRequestStatus } from "../../api/leaveRequestApi.ts";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";

const STATUS_OPTIONS: { label: string; value: LeaveStatus }[] = [
    { label: "Menunggu", value: "PENDING" },
    { label: "Disetujui", value: "APPROVED" },
    { label: "Ditolak", value: "REJECTED" },
];

export default function ReviewLeaveRequest() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(
        (location.state as LeaveRequest) ?? null,
    );

    const [loading, setLoading] = useState<boolean>(!location.state);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (location.state || !id) return;

        let isMounted = true;

        async function fetchLeaveRequest() {
            try {
                setLoading(true);
                setError(null);

                const response = await getLeaveRequestById(id as string);

                if (isMounted) {
                    setLeaveRequest(response);
                }
            } catch (e) {
                console.error(e);

                if (isMounted) {
                    setError(getErrorMessage(e, "Gagal memuat data pengajuan cuti."));
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        void fetchLeaveRequest();

        return () => {
            isMounted = false;
        };
    }, [location.state, id]);

    function handleStatusChange(e: ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value as LeaveStatus;

        setLeaveRequest((prev) =>
            prev
                ? {
                      ...prev,
                      status: value,
                  }
                : prev,
        );
    }

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();

        if (!leaveRequest || !id) return;

        try {
            setSubmitting(true);
            setSubmitError(null);

            const payload: LeaveRequestUpdateStatus = {
                status: leaveRequest.status,
            };

            await updateLeaveRequestStatus(id, payload);

            navigate(`/leave-requests/${leaveRequest.id}`);
        } catch (e) {
            console.error(e);

            setSubmitError(getErrorMessage(e, "Gagal memperbarui status pengajuan cuti."));
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="mx-auto max-w-3xl">
                <div className="mb-6">
                    <div className="bg-border h-4 w-24 animate-pulse rounded" />
                    <div className="bg-border mt-4 h-8 w-72 animate-pulse rounded" />
                    <div className="bg-border mt-2 h-4 w-96 max-w-full animate-pulse rounded" />
                </div>

                <div className="border-border bg-surface rounded-lg border">
                    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index}>
                                <div className="bg-border h-4 w-24 animate-pulse rounded" />
                                <div className="bg-border mt-2 h-5 w-40 animate-pulse rounded" />
                            </div>
                        ))}
                    </div>

                    <div className="border-border border-t p-6">
                        <div className="bg-border h-4 w-16 animate-pulse rounded" />
                        <div className="bg-border mt-2 h-10 w-full animate-pulse rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-3xl">
                <Link to="/leave-requests" className="text-text-secondary hover:text-text text-sm">
                    ← Kembali ke Pengajuan Cuti
                </Link>

                <div className="border-border bg-surface mt-6 rounded-lg border p-6">
                    <p className="text-rejected-text text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (!leaveRequest) {
        return (
            <div className="mx-auto max-w-3xl">
                <Link to="/leave-requests" className="text-text-secondary hover:text-text text-sm">
                    ← Kembali ke Pengajuan Cuti
                </Link>

                <div className="border-border bg-surface mt-6 rounded-lg border p-6">
                    <p className="text-text-secondary text-sm">
                        Data pengajuan cuti tidak ditemukan.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            <Link
                to={`/leave-requests/${leaveRequest.id}`}
                className="text-text-secondary hover:text-text text-sm"
            >
                ← Kembali ke Detail Pengajuan
            </Link>

            <div className="mt-4 mb-6">
                <h1 className="text-text text-2xl font-semibold">Review Pengajuan Cuti</h1>

                <p className="text-text-secondary mt-1 text-sm">
                    Tinjau pengajuan cuti dan tentukan status persetujuannya.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="border-border bg-surface overflow-hidden rounded-lg border">
                    <div className="border-border border-b px-6 py-5">
                        <h2 className="text-text text-base font-semibold">Informasi Pengajuan</h2>

                        <p className="text-text-secondary mt-1 text-sm">
                            Informasi pengajuan hanya dapat dilihat pada halaman review.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-6 md:grid-cols-2">
                        <div>
                            <dt className="text-text-muted text-xs font-medium tracking-wide uppercase">
                                Nama Karyawan
                            </dt>
                            <dd className="text-text mt-1 text-sm">{leaveRequest.employee.name}</dd>
                        </div>

                        <div>
                            <dt className="text-text-muted text-xs font-medium tracking-wide uppercase">
                                Status Saat Ini
                            </dt>
                            <dd className="text-text mt-1 text-sm">
                                {
                                    STATUS_OPTIONS.find(
                                        (option) => option.value === leaveRequest.status,
                                    )?.label
                                }
                            </dd>
                        </div>

                        <div>
                            <dt className="text-text-muted text-xs font-medium tracking-wide uppercase">
                                Tanggal Mulai
                            </dt>
                            <dd className="text-text mt-1 text-sm">
                                {new Date(leaveRequest.startDate).toLocaleDateString("id-ID")}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-text-muted text-xs font-medium tracking-wide uppercase">
                                Tanggal Berakhir
                            </dt>
                            <dd className="text-text mt-1 text-sm">
                                {new Date(leaveRequest.endDate).toLocaleDateString("id-ID")}
                            </dd>
                        </div>

                        <div className="md:col-span-2">
                            <dt className="text-text-muted text-xs font-medium tracking-wide uppercase">
                                Alasan
                            </dt>
                            <dd className="text-text mt-1 text-sm whitespace-pre-wrap">
                                {leaveRequest.reason || "Tidak ada alasan."}
                            </dd>
                        </div>
                    </div>

                    <div className="border-border border-t px-6 py-5">
                        <label htmlFor="status" className="text-text block text-sm font-medium">
                            Status Pengajuan
                        </label>

                        <p className="text-text-secondary mt-1 text-sm">
                            Tentukan hasil review pengajuan cuti ini.
                        </p>

                        <select
                            id="status"
                            name="status"
                            value={leaveRequest.status}
                            onChange={handleStatusChange}
                            disabled={submitting}
                            className="border-border bg-surface text-text focus:border-accent focus:ring-accent-soft disabled:bg-bg mt-3 w-full rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {submitError && (
                            <p className="text-rejected-text mt-3 text-sm">{submitError}</p>
                        )}
                    </div>

                    <div className="border-border flex flex-col-reverse gap-2 border-t px-6 py-4 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            disabled={submitting}
                            className="border-border text-text-secondary hover:bg-bg rounded-md border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-accent hover:bg-accent-hover rounded-md px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting ? "Menyimpan..." : "Simpan Review"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
