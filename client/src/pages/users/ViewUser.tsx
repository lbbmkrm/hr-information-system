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
                if (isMounted) setUser(response);
            } catch (requestError) {
                console.error(requestError);
                if (isMounted) {
                    setError(getErrorMessage(requestError, "Gagal mengambil data user."));
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        void fetchUser();
        return () => {
            isMounted = false;
        };
    }, [id]);

    if (loading) {
        return <div className="p-8 text-gray-500">Memuat data user...</div>;
    }

    if (error) {
        return <div role="alert" className="p-8 text-red-600">{error}</div>;
    }

    if (!user) {
        return <div className="p-8 text-gray-600">Data user tidak ditemukan.</div>;
    }

    return (
        <div className="container mx-auto max-w-2xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">Detail User</h1>
                <Link
                    to={`/users/edit/${user.id}`}
                    className="rounded bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
                >
                    Edit User
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <dl className="divide-y divide-gray-200">
                    <div className="grid grid-cols-3 gap-4 px-4 py-3">
                        <dt className="font-medium text-gray-600">Email</dt>
                        <dd className="col-span-2 text-gray-800">{user.email}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 px-4 py-3">
                        <dt className="font-medium text-gray-600">Role</dt>
                        <dd className="col-span-2 text-gray-800">{user.role}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 px-4 py-3">
                        <dt className="font-medium text-gray-600">Dibuat</dt>
                        <dd className="col-span-2 text-gray-800">
                            {new Date(user.createdAt).toLocaleString("id-ID")}
                        </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 px-4 py-3">
                        <dt className="font-medium text-gray-600">Diperbarui</dt>
                        <dd className="col-span-2 text-gray-800">
                            {new Date(user.updatedAt).toLocaleString("id-ID")}
                        </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 px-4 py-3">
                        <dt className="font-medium text-gray-600">Employee</dt>
                        <dd className="col-span-2 text-gray-800">
                            {user.employee
                                ? `${user.employee.name} (${user.employee.position}, ${user.employee.department})`
                                : "Belum terhubung"}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}
