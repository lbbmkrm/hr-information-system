import { type ChangeEvent, type SubmitEvent, useEffect, useState } from "react";
import type {
    LeaveRequest,
    LeaveRequestUpdateStatus,
    status as LeaveStatus,
} from "../../types/leaveRequest.ts";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
        if (location.state) return;

        let isMounted = true;
        async function fetchLeaveRequest() {
            try {
                setLoading(true);
                setError(null);
                const response = await getLeaveRequestById(id as string);
                if (isMounted) setLeaveRequest(response);
            } catch (e) {
                console.error(e);
                if (isMounted) {
                    setError(getErrorMessage(e, "Gagal memuat data pengajuan cuti."));
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        void fetchLeaveRequest();
        return () => {
            isMounted = false;
        };
    }, [location.state, id]);

    const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as LeaveStatus;
        setLeaveRequest((prev) => (prev ? { ...prev, status: value } : prev));
    };

    const handleSubmit = async (e: SubmitEvent) => {
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
    };

    if (loading) {
        return (
            <div className="container mx-auto max-w-2xl p-6">
                <p>Memuat data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto max-w-2xl p-6">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!leaveRequest) {
        return (
            <div className="container mx-auto max-w-2xl p-6">
                <p>Data pengajuan cuti tidak ditemukan.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl rounded-lg border p-6">
            <h1 className="mb-4 text-xl font-semibold">Ubah Status Pengajuan Cuti</h1>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                    <label htmlFor="name">Nama</label>
                    <span>:</span>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={leaveRequest.employee.name}
                        readOnly
                        className="w-2/3 rounded border bg-gray-100 px-2 py-1"
                    />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <label htmlFor="reason">Alasan</label>
                    <span>:</span>
                    <input
                        id="reason"
                        name="reason"
                        type="text"
                        value={leaveRequest.reason ?? ""}
                        readOnly
                        className="w-2/3 rounded border bg-gray-100 px-2 py-1"
                    />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <label htmlFor="startDate">Tanggal Mulai</label>
                    <span>:</span>
                    <input
                        id="startDate"
                        name="startDate"
                        type="text"
                        value={new Date(leaveRequest.startDate).toLocaleDateString("id-ID")}
                        readOnly
                        className="w-2/3 rounded border bg-gray-100 px-2 py-1"
                    />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <label htmlFor="endDate">Tanggal Berakhir</label>
                    <span>:</span>
                    <input
                        id="endDate"
                        name="endDate"
                        type="text"
                        value={new Date(leaveRequest.endDate).toLocaleDateString("id-ID")}
                        readOnly
                        className="w-2/3 rounded border bg-gray-100 px-2 py-1"
                    />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <label htmlFor="status">Status</label>
                    <span>:</span>
                    <select
                        id="status"
                        name="status"
                        value={leaveRequest.status}
                        onChange={handleStatusChange}
                        className="w-2/3 rounded border px-2 py-1"
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {submitError && <p className="text-sm text-red-600">{submitError}</p>}

                <div className="flex justify-end gap-2 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="rounded border px-4 py-1"
                        disabled={submitting}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="rounded bg-blue-600 px-4 py-1 text-white disabled:opacity-50"
                        disabled={submitting}
                    >
                        {submitting ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            </form>
        </div>
    );
}
