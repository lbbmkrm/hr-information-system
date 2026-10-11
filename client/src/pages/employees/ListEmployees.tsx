import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Users } from "lucide-react";

import { getEmployees } from "../../api/employeeApi.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";
import type { Employee } from "../../types/employee.ts";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";

export default function ListEmployees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuth();

    useEffect(() => {
        async function fetchEmployees(): Promise<void> {
            try {
                setLoading(true);
                setError(null);

                const data = await getEmployees();
                setEmployees(data);
            } catch (e) {
                console.error(e);
                setError(getErrorMessage(e, "Gagal mengambil daftar karyawan."));
            } finally {
                setLoading(false);
            }
        }

        void fetchEmployees();
    }, []);

    if (!user) {
        return (
            <div className="border-border bg-surface rounded-lg border p-6">
                <p className="text-text-secondary text-sm">Anda belum login.</p>
            </div>
        );
    }

    const canCreateEmployee = user.role === "ADMIN" || user.role === "HR";

    return (
        <div className="space-y-6">
            {/* Page heading */}
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-text text-xl font-semibold">Daftar Karyawan</h1>

                    <p className="text-text-secondary mt-1 text-sm">
                        Kelola dan lihat informasi karyawan perusahaan.
                    </p>
                </div>

                {canCreateEmployee && (
                    <Link
                        to="/employees/add"
                        className="bg-accent hover:bg-accent-hover inline-flex items-center justify-center gap-2 self-start rounded-md px-4 py-2 text-sm font-medium text-white transition"
                    >
                        <Plus className="size-4" />
                        Tambah Karyawan
                    </Link>
                )}
            </section>

            {/* Employee table */}
            <section className="border-border bg-surface overflow-hidden rounded-lg border">
                {/* Table header */}
                <div className="border-border flex items-center justify-between border-b px-5 py-4">
                    <div>
                        <h2 className="text-text text-sm font-semibold">Semua Karyawan</h2>

                        {!loading && !error && (
                            <p className="text-text-secondary mt-1 text-xs">
                                {employees.length} karyawan
                            </p>
                        )}
                    </div>

                    <Users className="text-text-muted size-5" />
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
                        <p className="text-text text-sm font-medium">Gagal memuat karyawan</p>

                        <p className="text-text-secondary mt-1 text-sm">{error}</p>
                    </div>
                ) : employees.length === 0 ? (
                    <div className="flex flex-col items-center px-6 py-12 text-center">
                        <div className="bg-bg flex size-12 items-center justify-center rounded-full">
                            <Users className="text-text-muted size-5" />
                        </div>

                        <h3 className="text-text mt-4 text-sm font-semibold">
                            Belum ada data karyawan
                        </h3>

                        <p className="text-text-secondary mt-1 max-w-sm text-sm">
                            Data karyawan akan ditampilkan di sini setelah tersedia.
                        </p>

                        {canCreateEmployee && (
                            <Link
                                to="/employees/add"
                                className="text-accent mt-4 text-sm font-medium hover:underline"
                            >
                                Tambah karyawan
                            </Link>
                        )}
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
                                        Posisi
                                    </th>

                                    <th className="text-text-secondary px-5 py-3 text-xs font-medium tracking-wide uppercase">
                                        Departemen
                                    </th>

                                    <th className="text-text-secondary px-5 py-3 text-xs font-medium tracking-wide uppercase">
                                        Tanggal Bergabung
                                    </th>

                                    <th className="text-text-secondary px-5 py-3 text-right text-xs font-medium tracking-wide uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-border divide-y">
                                {employees.map((employee) => (
                                    <tr
                                        key={employee.id}
                                        className="hover:bg-bg/50 transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="text-text text-sm font-medium">
                                                {employee.name}
                                            </p>
                                        </td>

                                        <td className="text-text-secondary px-5 py-4 text-sm">
                                            {employee.position}
                                        </td>

                                        <td className="text-text-secondary px-5 py-4 text-sm">
                                            {employee.department}
                                        </td>

                                        <td className="text-text-secondary px-5 py-4 text-sm whitespace-nowrap">
                                            {new Date(employee.joinDate).toLocaleDateString(
                                                "id-ID",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                },
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <Link
                                                to={`/employees/${employee.id}`}
                                                className="text-accent hover:text-accent-hover inline-flex items-center gap-1 text-sm font-medium"
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
