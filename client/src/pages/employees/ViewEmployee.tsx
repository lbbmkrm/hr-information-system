import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Pencil, Phone, Trash2, User } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { deleteEmployee, getEmployeesById } from "../../api/employeeApi.ts";
import EmployeePolicy from "../../policies/EmployeePolicy.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";
import type { Employee } from "../../types/employee.ts";
import type { JwtPayload } from "../../types/auth.ts";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";

export default function ViewEmployee() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { user } = useAuth();

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            } catch (e) {
                console.error(e);

                setError(getErrorMessage(e, "Gagal mengambil data karyawan."));
            } finally {
                setLoading(false);
            }
        }

        void fetchEmployee();
    }, [id]);

    async function handleDeleteEmployee() {
        if (!employee) {
            return;
        }

        const confirmed = window.confirm(
            `Apakah Anda yakin ingin menghapus data ${employee.name}?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError(null);

            await deleteEmployee(employee.id);

            navigate("/employees");
        } catch (e) {
            console.error(e);

            setError(getErrorMessage(e, "Gagal menghapus data karyawan."));
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="bg-bg h-5 w-40 animate-pulse rounded" />

                <div className="border-border bg-surface rounded-lg border p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-bg size-16 animate-pulse rounded-full" />

                        <div className="space-y-2">
                            <div className="bg-bg h-5 w-40 animate-pulse rounded" />
                            <div className="bg-bg h-4 w-24 animate-pulse rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !employee) {
        return (
            <div className="border-border bg-surface rounded-lg border p-6">
                <p className="text-text text-sm font-medium">Gagal memuat data karyawan</p>

                <p className="text-text-secondary mt-1 text-sm">
                    {error ?? "Data karyawan tidak ditemukan."}
                </p>

                <Link
                    to="/employees"
                    className="text-accent hover:text-accent-hover mt-4 inline-flex items-center gap-1.5 text-sm font-medium"
                >
                    <ArrowLeft className="size-4" />
                    Kembali ke daftar karyawan
                </Link>
            </div>
        );
    }

    const canDelete = EmployeePolicy.delete(user as JwtPayload);

    const initial = employee.name.charAt(0).toUpperCase();

    const formattedJoinDate = new Date(employee.joinDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="max-w-4xl space-y-6">
            {/* Back navigation */}
            <Link
                to="/employees"
                className="text-text-secondary hover:text-text inline-flex items-center gap-1.5 text-sm transition"
            >
                <ArrowLeft className="size-4" />
                Kembali ke daftar karyawan
            </Link>

            {/* Profile header */}
            <section className="border-border bg-surface rounded-lg border">
                <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-accent-soft text-accent flex size-16 shrink-0 items-center justify-center rounded-full text-xl font-semibold">
                            {initial}
                        </div>

                        <div>
                            <h1 className="text-text text-xl font-semibold">{employee.name}</h1>

                            <p className="text-text-secondary mt-1 text-sm">{employee.position}</p>

                            <p className="text-text-muted mt-0.5 text-xs">{employee.department}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to={`/employees/edit/${employee.id}`}
                            className="border-border text-text-secondary hover:bg-bg hover:text-text inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition"
                        >
                            <Pencil className="size-4" />
                            Edit
                        </Link>

                        {canDelete && (
                            <button
                                type="button"
                                onClick={handleDeleteEmployee}
                                disabled={deleting}
                                className="border-rejected-bg text-rejected-text hover:bg-rejected-bg inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Trash2 className="size-4" />
                                {deleting ? "Menghapus..." : "Hapus"}
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Error after action */}
            {error && (
                <div className="border-rejected-bg bg-rejected-bg rounded-md border px-4 py-3">
                    <p className="text-rejected-text text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Employee information */}
            <section className="border-border bg-surface rounded-lg border">
                <div className="border-border border-b px-5 py-4">
                    <h2 className="text-text text-sm font-semibold">Informasi Karyawan</h2>

                    <p className="text-text-secondary mt-1 text-xs">
                        Informasi dasar mengenai karyawan.
                    </p>
                </div>

                <div className="grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2">
                    {/* Name */}
                    <div className="flex gap-3">
                        <User className="text-text-muted mt-0.5 size-4 shrink-0" />

                        <div>
                            <p className="text-text-muted text-xs">Nama</p>

                            <p className="text-text mt-1 text-sm font-medium">{employee.name}</p>
                        </div>
                    </div>

                    {/* Position */}
                    <div className="flex gap-3">
                        <User className="text-text-muted mt-0.5 size-4 shrink-0" />

                        <div>
                            <p className="text-text-muted text-xs">Posisi</p>

                            <p className="text-text mt-1 text-sm font-medium">
                                {employee.position}
                            </p>
                        </div>
                    </div>

                    {/* Department */}
                    <div className="flex gap-3">
                        <User className="text-text-muted mt-0.5 size-4 shrink-0" />

                        <div>
                            <p className="text-text-muted text-xs">Departemen</p>

                            <p className="text-text mt-1 text-sm font-medium">
                                {employee.department}
                            </p>
                        </div>
                    </div>

                    {/* Join date */}
                    <div className="flex gap-3">
                        <CalendarDays className="text-text-muted mt-0.5 size-4 shrink-0" />

                        <div>
                            <p className="text-text-muted text-xs">Tanggal Bergabung</p>

                            <p className="text-text mt-1 text-sm font-medium">
                                {formattedJoinDate}
                            </p>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex gap-3">
                        <Phone className="text-text-muted mt-0.5 size-4 shrink-0" />

                        <div>
                            <p className="text-text-muted text-xs">Nomor Telepon</p>

                            <p className="text-text mt-1 text-sm font-medium">
                                {employee.phone || "Belum tersedia"}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
