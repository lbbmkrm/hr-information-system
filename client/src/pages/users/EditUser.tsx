import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editUser, getUserById } from "../../api/userApi.ts";
import { ROLE, type EditUserPayload, type User } from "../../types/user.ts";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";

interface UserFormData {
    email: string;
    password: string;
    role: ROLE;
}

export default function EditUser() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<UserFormData>({
        email: "",
        password: "",
        role: ROLE.EMPLOYEE,
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
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
                const user: User = await getUserById(id);
                if (isMounted) {
                    setFormData({
                        email: user.email,
                        password: "",
                        role: user.role,
                    });
                }
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

    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!id) {
            setError("ID user tidak ditemukan.");
            return;
        }

        const payload: EditUserPayload = {
            email: formData.email,
            role: formData.role,
            ...(formData.password ? { password: formData.password } : {}),
        };

        try {
            setSubmitting(true);
            setError(null);
            await editUser(id, payload);
            navigate(`/users/${id}`, { replace: true });
        } catch (requestError) {
            console.error(requestError);
            setError(getErrorMessage(requestError, "Gagal memperbarui user."));
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return <div className="p-8 text-gray-500">Memuat data user...</div>;
    }

    if (error && !formData.email) {
        return <div role="alert" className="p-8 text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto max-w-lg p-6">
            <h1 className="mb-6 text-2xl font-semibold text-gray-800">Ubah User</h1>

            <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-6 shadow">
                {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

                <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">
                        Role
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full rounded border px-3 py-2"
                    >
                        <option value="ADMIN">ADMIN</option>
                        <option value="HR">HR</option>
                        <option value="EMPLOYEE">EMPLOYEE</option>
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Password baru (opsional)
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        minLength={6}
                        className="w-full rounded border px-3 py-2"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Kosongkan jika tidak ingin mengubah password.
                    </p>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => navigate(`/users/${id}`)}
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
