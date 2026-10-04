import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editLeaveRequest, getLeaveRequestById } from "../../api/leaveRequestApi.ts";
import type { LeaveRequestEditPayload } from "../../types/leaveRequest.ts";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";

interface LeaveRequestFormData {
    startDate: string;
    endDate: string;
    reason: string;
}

const EMPTY_FORM: LeaveRequestFormData = {
    startDate: "",
    endDate: "",
    reason: "",
};

export default function EditLeaveRequest() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<LeaveRequestFormData>(EMPTY_FORM);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchLeaveRequest() {
            if (!id) {
                setError("ID pengajuan cuti tidak ditemukan.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const leaveRequest = await getLeaveRequestById(id);
                if (isMounted) {
                    setFormData({
                        startDate: leaveRequest.startDate.slice(0, 10),
                        endDate: leaveRequest.endDate.slice(0, 10),
                        reason: leaveRequest.reason ?? "",
                    });
                }
            } catch (requestError) {
                console.error(requestError);
                if (isMounted) {
                    setError(getErrorMessage(requestError, "Gagal mengambil data pengajuan cuti."));
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
    }, [id]);

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!id) {
            setError("ID pengajuan cuti tidak ditemukan.");
            return;
        }

        if (formData.endDate < formData.startDate) {
            setError("Tanggal selesai tidak boleh sebelum tanggal mulai.");
            return;
        }

        const payload: LeaveRequestEditPayload = {
            startDate: formData.startDate,
            endDate: formData.endDate,
            reason: formData.reason || null,
        };

        try {
            setSubmitting(true);
            setError(null);
            await editLeaveRequest(id, payload);
            navigate("/leave-requests/me", { replace: true });
        } catch (requestError) {
            console.error(requestError);
            setError(getErrorMessage(requestError, "Gagal memperbarui pengajuan cuti."));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-gray-500">Memuat data pengajuan cuti...</div>;
    }

    if (error && !formData.startDate) {
        return <div className="p-8 text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto max-w-lg p-6">
            <h1 className="mb-6 text-2xl font-semibold text-gray-800">Ubah Pengajuan Cuti</h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-lg border bg-white p-6 shadow"
            >
                {error && <p className="text-sm text-red-600">{error}</p>}

                <div>
                    <label htmlFor="startDate" className="mb-1 block text-sm font-medium">
                        Tanggal Mulai
                    </label>
                    <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="endDate" className="mb-1 block text-sm font-medium">
                        Tanggal Selesai
                    </label>
                    <input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        min={formData.startDate}
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="reason" className="mb-1 block text-sm font-medium">
                        Alasan
                    </label>
                    <textarea
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => navigate("/leave-requests/me")}
                        disabled={submitting}
                        className="rounded border px-4 py-2 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                    >
                        {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </form>
        </div>
    );
}
