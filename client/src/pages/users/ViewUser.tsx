import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUserById } from "../../api/userApi.ts";
import type { User } from "../../types/user.ts";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";

export default function ViewUser() {
    const { id } = useParams<{ id: string }>();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchUser() {
            if (!id) {
                setError("ID user tidak ditemukan.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await getUserById(id);

                if (isMounted) {
                    setUser(response);
                }
            } catch (requestError) {
                console.error(requestError);

                if (isMounted) {
                    setError(getErrorMessage(requestError, "Gagal mengambil data user."));
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        void fetchUser();

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (loading) {
        return (
            <div className="mx-auto max-w-3xl">
                <div className="mb-6">
                    <div className="bg-border h-4 w-24 animate-pulse rounded" />
                    <div className="bg-border mt-4 h-8 w-48 animate-pulse rounded" />
                    <div className="bg-border mt-2 h-4 w-72 animate-pulse rounded" />
                </div>

                <div className="border-border bg-surface overflow-hidden rounded-lg border">
                    <div className="border-border border-b p-6">
                        <div className="bg-border h-5 w-40 animate-pulse rounded" />
                        <div className="bg-border mt-3 h-4 w-56 animate-pulse rounded" />
                    </div>

                    <div className="space-y-6 p-6">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4"
                            >
                                <div className="bg-border h-4 w-24 animate-pulse rounded" />
                                <div className="bg-border h-4 w-48 animate-pulse rounded sm:col-span-2" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-3xl">
                <Link
                    to="/users"
                    className="text-text-secondary hover:text-text text-sm transition"
                >
                    ← Kembali ke Users
                </Link>

                <div
                    role="alert"
                    className="border-rejected-bg bg-rejected-bg text-rejected-text mt-6 rounded-lg border p-5 text-sm"
                >
                    {error}
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="mx-auto max-w-3xl">
                <Link
                    to="/users"
                    className="text-text-secondary hover:text-text text-sm transition"
                >
                    ← Kembali ke Users
                </Link>

                <div className="border-border bg-surface mt-6 rounded-lg border p-6">
                    <p className="text-text text-sm font-medium">Data user tidak ditemukan.</p>
                    <p className="text-text-secondary mt-1 text-sm">
                        Periksa kembali data pengguna yang ingin Anda lihat.
                    </p>
                </div>
            </div>
        );
    }

    const roleClassName = {
        ADMIN: "bg-accent-soft text-accent",
        HR: "bg-pending-bg text-pending-text",
        EMPLOYEE: "bg-bg text-text-secondary",
    }[user.role];

    return (
        <div className="mx-auto max-w-3xl">
            <Link to="/users" className="text-text-secondary hover:text-text text-sm transition">
                ← Kembali ke Users
            </Link>

            <div className="mt-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-text text-2xl font-semibold tracking-tight">Detail User</h1>

                    <p className="text-text-secondary mt-1 text-sm">
                        Informasi akun, hak akses, dan keterkaitan karyawan.
                    </p>
                </div>

                <Link
                    to={`/users/edit/${user.id}`}
                    className="bg-accent hover:bg-accent-hover inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition"
                >
                    Edit User
                </Link>
            </div>

            <div className="border-border bg-surface overflow-hidden rounded-lg border">
                <div className="border-border border-b px-6 py-5">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="bg-accent-soft text-accent flex h-11 w-11 items-center justify-center rounded-full text-base font-semibold">
                            {user.email.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                            <h2 className="text-text text-base font-semibold break-all">
                                {user.email}
                            </h2>

                            <p className="text-text-secondary mt-1 text-sm">
                                Informasi akun pengguna
                            </p>
                        </div>

                        <span
                            className={`rounded-md px-2.5 py-1 text-xs font-medium ${roleClassName}`}
                        >
                            {user.role}
                        </span>
                    </div>
                </div>

                <dl className="divide-border divide-y">
                    <div className="grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-3 sm:gap-4">
                        <dt className="text-text-secondary text-sm">Email</dt>
                        <dd className="text-text text-sm font-medium break-all sm:col-span-2">
                            {user.email}
                        </dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-3 sm:gap-4">
                        <dt className="text-text-secondary text-sm">Role</dt>
                        <dd className="sm:col-span-2">
                            <span
                                className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${roleClassName}`}
                            >
                                {user.role}
                            </span>
                        </dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-3 sm:gap-4">
                        <dt className="text-text-secondary text-sm">Dibuat</dt>
                        <dd className="text-text text-sm sm:col-span-2">
                            {new Date(user.createdAt).toLocaleString("id-ID", {
                                dateStyle: "long",
                                timeStyle: "short",
                            })}
                        </dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-3 sm:gap-4">
                        <dt className="text-text-secondary text-sm">Terakhir diperbarui</dt>
                        <dd className="text-text text-sm sm:col-span-2">
                            {new Date(user.updatedAt).toLocaleString("id-ID", {
                                dateStyle: "long",
                                timeStyle: "short",
                            })}
                        </dd>
                    </div>
                </dl>

                <div className="border-border bg-bg/50 border-t px-6 py-5">
                    <h3 className="text-text text-sm font-semibold">Data Karyawan</h3>

                    <p className="text-text-secondary mt-1 text-sm">
                        Informasi karyawan yang terhubung dengan akun ini.
                    </p>

                    {user.employee ? (
                        <div className="border-border bg-surface mt-4 rounded-md border p-4">
                            <p className="text-text text-sm font-medium">{user.employee.name}</p>

                            <p className="text-text-secondary mt-1 text-sm">
                                {user.employee.position}
                                {" · "}
                                {user.employee.department}
                            </p>
                        </div>
                    ) : (
                        <p className="border-border bg-surface text-text-secondary mt-4 rounded-md border px-4 py-3 text-sm">
                            Akun ini belum terhubung dengan data karyawan.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
