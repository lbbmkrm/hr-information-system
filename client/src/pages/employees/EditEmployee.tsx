import { type ChangeEvent, type SubmitEvent, useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { getEmployeesById, updateEmployee } from "../../api/employeeApi.ts";
import { getUserById } from "../../api/userApi.ts";
import type { Employee } from "../../types/employee.ts";
import type { User } from "../../types/user.ts";
import UserSearchSelect from "../../components/UserSearchSelect.tsx";
import type { jwtPayload } from "../../api/authApi.ts";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";

interface FormData {
    name: string;
    position: string;
    department: string;
    joinDate: string;
    phone?: string | null;
    userId?: string | null;
}

export default function EditEmployee() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [employeeUser, setEmployeeUser] = useState<User | null>(null);

    const [formData, setFormData] = useState<FormData>({
        name: "",
        position: "",
        department: "",
        joinDate: "",
        phone: "",
        userId: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem("token");
    const currentUser = token ? jwtDecode<jwtPayload>(token) : null;

    useEffect(() => {
        if (!id) {
            setError("ID karyawan tidak ditemukan.");
            setLoading(false);
            return;
        }

        async function fetchEmployee() {
            try {
                setLoading(true);
                setError(null);

                const data = await getEmployeesById(id as string);

                setEmployee(data);

                setFormData({
                    name: data.name,
                    position: data.position,
                    department: data.department,
                    joinDate: data.joinDate,
                    phone: data.phone,
                    userId: data.userId,
                });

                if (data.userId) {
                    const user = await getUserById(data.userId);
                    setEmployeeUser(user);
                } else {
                    setEmployeeUser(null);
                }
            } catch (e) {
                console.error(e);

                setError(getErrorMessage(e, "Gagal mengambil data karyawan."));
            } finally {
                setLoading(false);
            }
        }

        void fetchEmployee();
    }, [id]);

    function handleChangeValueInput(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleFormSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!id) {
            setError("ID karyawan tidak ditemukan.");
            return;
        }

        try {
            setSaving(true);
            setError(null);

            await updateEmployee(id, {
                ...formData,
                phone: formData.phone || undefined,
            });

            navigate(`/employees/${id}`, {
                state: {
                    message: "success",
                },
            });
        } catch (e) {
            console.error(e);

            setError(getErrorMessage(e, "Gagal mengubah data karyawan."));
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
                        <div className="bg-bg h-5 w-40 animate-pulse rounded" />
                        <div className="bg-bg h-10 animate-pulse rounded" />
                        <div className="bg-bg h-10 animate-pulse rounded" />
                        <div className="bg-bg h-10 animate-pulse rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (error && !employee) {
        return (
            <div className="border-border bg-surface rounded-lg border p-6">
                <p className="text-text text-sm font-medium">Gagal memuat data karyawan</p>

                <p className="text-text-secondary mt-1 text-sm">{error}</p>

                <button
                    type="button"
                    onClick={() => navigate("/employees")}
                    className="text-accent hover:text-accent-hover mt-4 inline-flex items-center gap-1.5 text-sm font-medium"
                >
                    <ArrowLeft className="size-4" />
                    Kembali ke daftar karyawan
                </button>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="border-border bg-surface rounded-lg border p-6">
                <p className="text-text-secondary text-sm">Data karyawan tidak ditemukan.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl space-y-6">
            <section>
                <button
                    type="button"
                    onClick={() => navigate(`/employees/${employee.id}`)}
                    className="text-text-secondary hover:text-text mb-4 inline-flex items-center gap-1.5 text-sm transition"
                >
                    <ArrowLeft className="size-4" />
                    Kembali ke detail karyawan
                </button>

                <h1 className="text-text text-xl font-semibold">Edit Karyawan</h1>

                <p className="text-text-secondary mt-1 text-sm">
                    Perbarui informasi karyawan yang tersimpan di dalam sistem.
                </p>
            </section>

            <section className="border-border bg-surface rounded-lg border">
                <div className="border-border border-b px-5 py-4">
                    <h2 className="text-text text-sm font-semibold">Informasi Karyawan</h2>

                    <p className="text-text-secondary mt-1 text-xs">
                        Ubah informasi dasar karyawan.
                    </p>
                </div>

                <form onSubmit={handleFormSubmit} className="p-5">
                    {error && (
                        <div className="border-rejected-bg bg-rejected-bg mb-5 rounded-md border px-4 py-3">
                            <p className="text-rejected-text text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label
                                htmlFor="name"
                                className="text-text mb-1.5 block text-sm font-medium"
                            >
                                Nama
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChangeValueInput}
                                required
                                disabled={saving}
                                placeholder="Masukkan nama lengkap"
                                className="border-border bg-surface text-text placeholder:text-text-muted focus:border-accent focus:ring-accent/10 disabled:bg-bg w-full rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="position"
                                className="text-text mb-1.5 block text-sm font-medium"
                            >
                                Posisi
                            </label>

                            <input
                                id="position"
                                name="position"
                                type="text"
                                value={formData.position}
                                onChange={handleChangeValueInput}
                                required
                                disabled={saving}
                                placeholder="Contoh: Software Engineer"
                                className="border-border bg-surface text-text placeholder:text-text-muted focus:border-accent focus:ring-accent/10 disabled:bg-bg w-full rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="department"
                                className="text-text mb-1.5 block text-sm font-medium"
                            >
                                Departemen
                            </label>

                            <input
                                id="department"
                                name="department"
                                type="text"
                                value={formData.department}
                                onChange={handleChangeValueInput}
                                required
                                disabled={saving}
                                placeholder="Contoh: IT"
                                className="border-border bg-surface text-text placeholder:text-text-muted focus:border-accent focus:ring-accent/10 disabled:bg-bg w-full rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="joinDate"
                                className="text-text mb-1.5 block text-sm font-medium"
                            >
                                Tanggal Bergabung
                            </label>

                            <input
                                id="joinDate"
                                name="joinDate"
                                type="date"
                                value={
                                    formData.joinDate
                                        ? new Date(formData.joinDate).toISOString().split("T")[0]
                                        : ""
                                }
                                onChange={handleChangeValueInput}
                                required
                                disabled={saving}
                                className="border-border bg-surface text-text focus:border-accent focus:ring-accent/10 disabled:bg-bg w-full rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="phone"
                                className="text-text mb-1.5 block text-sm font-medium"
                            >
                                Nomor Telepon
                                <span className="text-text-muted ml-1">(opsional)</span>
                            </label>

                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone ?? ""}
                                onChange={handleChangeValueInput}
                                disabled={saving}
                                placeholder="Contoh: 08123456789"
                                className="border-border bg-surface text-text placeholder:text-text-muted focus:border-accent focus:ring-accent/10 disabled:bg-bg w-full rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-text mb-1.5 block text-sm font-medium">
                                Akun
                            </label>

                            {employee.userId ? (
                                <div className="border-border bg-bg rounded-md border px-3 py-2.5">
                                    <p className="text-text text-sm">
                                        {employeeUser?.email ?? "Memuat..."}
                                    </p>

                                    <p className="text-text-muted mt-0.5 text-xs">
                                        Akun sudah terhubung dengan karyawan ini.
                                    </p>
                                </div>
                            ) : currentUser?.role === "ADMIN" ? (
                                <UserSearchSelect
                                    value={formData.userId ?? ""}
                                    onSelect={(userId) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            userId,
                                        }))
                                    }
                                />
                            ) : (
                                <div className="border-border bg-bg rounded-md border px-3 py-2.5">
                                    <p className="text-text-secondary text-sm italic">
                                        Belum terhubung ke akun.
                                    </p>

                                    <p className="text-text-muted mt-0.5 text-xs">
                                        Hubungi Admin untuk menghubungkan akun.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-border mt-6 flex items-center justify-end gap-3 border-t pt-5">
                        <button
                            type="button"
                            onClick={() => navigate(`/employees/${employee.id}`)}
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
