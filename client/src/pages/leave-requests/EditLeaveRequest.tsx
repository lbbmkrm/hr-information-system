import { type ChangeEvent, type SubmitEvent, useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getLeaveRequestById, editLeaveRequest } from "../../api/leaveRequestApi.ts";
import type { LeaveRequest } from "../../types/leaveRequest.ts";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";
import LeaveRequestPolicy from "../../policies/LeaveRequestPolicy.ts";
import type { JwtPayload } from "../../types/auth.ts";

interface FormData {
    startDate: string;
    endDate: string;
    reason: string;
}

export default function EditLeaveRequest() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();

    const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(null);

    const [formData, setFormData] = useState<FormData>({
        startDate: "",
        endDate: "",
        reason: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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

                if (!LeaveRequestPolicy.update(user as JwtPayload, data)) {
                    alert("Anda tidak dapat mengedit permintaan cuti ini.");

                    navigate(-1);
                    return;
                }

                setLeaveRequest(data);

                setFormData({
                    startDate: new Date(data.startDate).toISOString().split("T")[0],
                    endDate: new Date(data.endDate).toISOString().split("T")[0],
                    reason: data.reason ?? "",
                });
            } catch (e) {
                console.error(e);

                setError(getErrorMessage(e, "Gagal mengambil data pengajuan cuti."));
            } finally {
                setLoading(false);
            }
        }

        void fetchLeaveRequest();
    }, [id, user, navigate]);

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!id) {
            setError("ID pengajuan cuti tidak ditemukan.");
            return;
        }

        try {
            setSaving(true);
            setError(null);

            await editLeaveRequest(id, {
                startDate: formData.startDate,
                endDate: formData.endDate,
                reason: formData.reason || undefined,
            });

            navigate(`/leave-requests/${id}`);
        } catch (e) {
            console.error(e);

            setError(getErrorMessage(e, "Gagal mengubah pengajuan cuti."));
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="max-w-3xl space-y-6">
                <div className="bg-bg h-5 w-48 animate-pulse rounded" />

                <div className="border-border bg-surface rounded-lg border p-6">
                    <div className="space-y-5">
                        <div className="bg-bg h-10 animate-pulse rounded" />
                        <div className="bg-bg h-10 animate-pulse rounded" />
                        <div className="bg-bg h-24 animate-pulse rounded" />
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

                <Link
                    to="/leave-requests/me"
                    className="text-accent hover:text-accent-hover mt-4 inline-flex items-center gap-1.5 text-sm font-medium"
                >
                    <ArrowLeft className="size-4" />
                    Kembali ke riwayat saya
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl space-y-6">
            <section>
                <Link
                    to={`/leave-requests/${leaveRequest.id}`}
                    className="text-text-secondary hover:text-text mb-4 inline-flex items-center gap-1.5 text-sm transition"
                >
                    <ArrowLeft className="size-4" />
                    Kembali ke detail pengajuan
                </Link>

                <h1 className="text-text text-xl font-semibold">Edit Pengajuan Cuti</h1>

                <p className="text-text-secondary mt-1 text-sm">
                    Perbarui informasi pengajuan cuti Anda.
                </p>
            </section>

            <section className="border-border bg-surface rounded-lg border">
                <div className="border-border border-b px-5 py-4">
                    <h2 className="text-text text-sm font-semibold">Informasi Cuti</h2>

                    <p className="text-text-secondary mt-1 text-xs">
                        Ubah tanggal dan alasan pengajuan cuti.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-5">
                    {error && (
                        <div className="border-rejected-bg bg-rejected-bg mb-5 rounded-md border px-4 py-3">
                            <p className="text-rejected-text text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label
                                htmlFor="startDate"
                                className="text-text mb-1.5 block text-sm font-medium"
                            >
                                Tanggal Mulai
                            </label>

                            <input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                disabled={saving}
                                className="border-border bg-surface text-text focus:border-accent focus:ring-accent/10 disabled:bg-bg w-full rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
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
                                name="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                disabled={saving}
                                className="border-border bg-surface text-text focus:border-accent focus:ring-accent/10 disabled:bg-bg w-full rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="reason"
                                className="text-text mb-1.5 block text-sm font-medium"
                            >
                                Alasan
                            </label>

                            <textarea
                                id="reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                rows={4}
                                disabled={saving}
                                placeholder="Masukkan alasan pengajuan cuti"
                                className="border-border bg-surface text-text placeholder:text-text-muted focus:border-accent focus:ring-accent/10 disabled:bg-bg w-full resize-none rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="border-border mt-6 flex justify-end gap-3 border-t pt-5">
                        <button
                            type="button"
                            onClick={() => navigate(`/leave-requests/${leaveRequest.id}`)}
                            disabled={saving}
                            className="border-border text-text-secondary hover:bg-bg hover:text-text rounded-md border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-accent hover:bg-accent-hover inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Save className="size-4" />

                            {saving ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
