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

    const handleDelete = async (id: string) => {
        if (!window.confirm("Yakin ingin menghapus user ini?")) return;

        try {
            await deleteUser(id);
            await fetchUsers();
        } catch (error) {
            console.error(error);
            setError(getErrorMessage(error, "Gagal menghapus user."));
        }
    };

    useEffect(() => {
        void fetchUsers();
    }, [fetchUsers]);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Memuat data...</div>;
    }

    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={() => void fetchUsers()}
            />
        );
    }

    return (
        <div className="container mx-auto max-w-4xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">Daftar Users</h1>
                <Link
                    to="/users/add"
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Tambah User
                </Link>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
                    <tr>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Dibuat</th>
                        <th className="px-4 py-3">Diperbarui</th>
                        <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">{user.email}</td>
                            <td className="px-4 py-3">{user.role}</td>
                            <td className="px-4 py-3">
                                {new Date(user.createdAt).toLocaleDateString("id-ID")}
                            </td>
                            <td className="px-4 py-3">
                                {new Date(user.updatedAt).toLocaleDateString("id-ID")}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex justify-center gap-2">
                                    <Link
                                        to={`/users/${user.id}`}
                                        className="rounded bg-sky-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-sky-700"
                                    >
                                        Detail
                                    </Link>
                                    <Link
                                        to={`/users/edit/${user.id}`}
                                        className="rounded bg-yellow-500 px-3 py-1 text-xs font-medium text-white transition hover:bg-yellow-600"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-red-700"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                Belum ada user.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}