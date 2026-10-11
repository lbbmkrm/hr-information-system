import { useCallback, useEffect, useState } from "react";
import type { User } from "../../types/user.ts";
import { deleteUser, getUsers } from "../../api/userApi.ts";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";
import { ErrorState } from "../../components/ui/ErrorState.tsx";
import { Link } from "react-router-dom";

export default function ListUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getUsers();
            setUsers(response);
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err, "Gagal mengambil data users."));
        } finally {
            setLoading(false);
        }
    }, []);

    async function handleDelete(id: string) {
        const confirmed = window.confirm("Yakin ingin menghapus user ini?");

        if (!confirmed) return;

        try {
            setDeletingId(id);
            setError(null);

            await deleteUser(id);

            setUsers((current) => current.filter((user) => user.id !== id));
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err, "Gagal menghapus user."));
        } finally {
            setDeletingId(null);
        }
    }

    useEffect(() => {
        void fetchUsers();
    }, [fetchUsers]);

    if (loading) {
        return (
            <div className="mx-auto max-w-5xl">
                <div className="mb-6">
                    <div className="bg-border h-8 w-40 animate-pulse rounded" />
                    <div className="bg-border mt-2 h-4 w-72 animate-pulse rounded" />
                </div>

                <div className="border-border bg-surface overflow-hidden rounded-lg border">
                    <div className="space-y-4 p-6">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="grid grid-cols-5 gap-4">
                                {Array.from({ length: 5 }).map((_, columnIndex) => (
                                    <div
                                        key={columnIndex}
                                        className="bg-border h-5 animate-pulse rounded"
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error && users.length === 0) {
        return <ErrorState message={error} onRetry={() => void fetchUsers()} />;
    }

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-text text-2xl font-semibold tracking-tight">Users</h1>

                    <p className="text-text-secondary mt-1 text-sm">
                        Kelola akun pengguna dan hak akses sistem.
                    </p>
                </div>

                <Link
                    to="/users/add"
                    className="bg-accent hover:bg-accent-hover inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition"
                >
                    Tambah User
                </Link>
            </div>

            {error && (
                <div className="border-rejected-bg bg-rejected-bg text-rejected-text mb-4 rounded-md border px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            <div className="border-border bg-surface overflow-hidden rounded-lg border">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="border-border bg-bg border-b">
                            <tr>
                                <th className="text-text-muted px-5 py-3 text-xs font-medium tracking-wide uppercase">
                                    Email
                                </th>

                                <th className="text-text-muted px-5 py-3 text-xs font-medium tracking-wide uppercase">
                                    Role
                                </th>

                                <th className="text-text-muted px-5 py-3 text-xs font-medium tracking-wide uppercase">
                                    Dibuat
                                </th>

                                <th className="text-text-muted px-5 py-3 text-xs font-medium tracking-wide uppercase">
                                    Diperbarui
                                </th>

                                <th className="text-text-muted px-5 py-3 text-right text-xs font-medium tracking-wide uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-border hover:bg-bg/60 border-b last:border-b-0"
                                >
                                    <td className="text-text px-5 py-4 font-medium">
                                        {user.email}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={[
                                                "inline-flex rounded-md px-2.5 py-1 text-xs font-medium",
                                                user.role === "ADMIN"
                                                    ? "bg-accent-soft text-accent"
                                                    : user.role === "HR"
                                                      ? "bg-pending-bg text-pending-text"
                                                      : "bg-bg text-text-secondary",
                                            ].join(" ")}
                                        >
                                            {user.role}
                                        </span>
                                    </td>

                                    <td className="text-text-secondary px-5 py-4">
                                        {new Date(user.createdAt).toLocaleDateString("id-ID")}
                                    </td>

                                    <td className="text-text-secondary px-5 py-4">
                                        {new Date(user.updatedAt).toLocaleDateString("id-ID")}
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                to={`/users/${user.id}`}
                                                className="border-border text-text-secondary hover:bg-bg hover:text-text rounded-md border px-3 py-1.5 text-xs font-medium transition"
                                            >
                                                Detail
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => void handleDelete(user.id)}
                                                disabled={deletingId === user.id}
                                                className="text-rejected-text hover:bg-rejected-bg rounded-md px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {deletingId === user.id ? "Menghapus..." : "Hapus"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center">
                                        <p className="text-text text-sm font-medium">
                                            Belum ada user
                                        </p>

                                        <p className="text-text-secondary mt-1 text-sm">
                                            Tambahkan user baru untuk mulai mengelola akun pengguna.
                                        </p>

                                        <Link
                                            to="/users/add"
                                            className="bg-accent hover:bg-accent-hover mt-4 inline-flex rounded-md px-4 py-2 text-sm font-medium text-white transition"
                                        >
                                            Tambah User
                                        </Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
