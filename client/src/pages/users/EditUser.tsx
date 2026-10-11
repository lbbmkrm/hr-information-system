import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
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
        return (
            <div className="mx-auto max-w-3xl">
                <div className="mb-6">
                    <div className="bg-border h-4 w-24 animate-pulse rounded" />
                    <div className="bg-border mt-4 h-8 w-48 animate-pulse rounded" />
                    <div className="bg-border mt-2 h-4 w-72 animate-pulse rounded" />
                </div>

                <div className="border-border bg-surface space-y-6 rounded-lg border p-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index}>
                            <div className="bg-border h-4 w-24 animate-pulse rounded" />
                            <div className="bg-border mt-2 h-10 w-full animate-pulse rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error && !formData.email) {
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

                <button
                    type="button"
                    onClick={() => navigate("/users")}
                    className="border-border text-text-secondary hover:bg-bg mt-4 rounded-md border px-4 py-2 text-sm font-medium transition"
                >
                    Kembali
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            <Link
                to={`/users/${id}`}
                className="text-text-secondary hover:text-text text-sm transition"
            >
                ← Kembali ke Detail User
            </Link>

            <div className="mt-4 mb-6">
                <h1 className="text-text text-2xl font-semibold tracking-tight">Ubah User</h1>

                <p className="text-text-secondary mt-1 text-sm">
                    Perbarui informasi akun dan hak akses pengguna.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="border-border bg-surface overflow-hidden rounded-lg border"
            >
                <div className="space-y-5 p-6">
                    <div>
                        <h2 className="text-text text-base font-semibold">Informasi Akun</h2>

                        <p className="text-text-secondary mt-1 text-sm">
                            Ubah email, role, atau password akun pengguna.
                        </p>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="border-rejected-bg bg-rejected-bg text-rejected-text rounded-md border px-4 py-3 text-sm"
                        >
                            {error}
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="email"
                            className="text-text mb-1.5 block text-sm font-medium"
                        >
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
                            disabled={submitting}
                            className="border-border bg-surface text-text focus:border-accent focus:ring-accent-soft disabled:bg-bg w-full rounded-md border px-3 py-2.5 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="role"
                            className="text-text mb-1.5 block text-sm font-medium"
                        >
                            Role
                        </label>

                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={submitting}
                            className="border-border bg-surface text-text focus:border-accent focus:ring-accent-soft disabled:bg-bg w-full rounded-md border px-3 py-2.5 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                        >
                            <option value={ROLE.ADMIN}>ADMIN</option>
                            <option value={ROLE.HR}>HR</option>
                            <option value={ROLE.EMPLOYEE}>EMPLOYEE</option>
                        </select>

                        <p className="text-text-secondary mt-2 text-xs">
                            Role menentukan hak akses pengguna di dalam sistem.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="text-text mb-1.5 block text-sm font-medium"
                        >
                            Password Baru
                            <span className="text-text-muted ml-1 font-normal">(Opsional)</span>
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            minLength={6}
                            placeholder="Masukkan password baru"
                            disabled={submitting}
                            className="border-border bg-surface text-text placeholder:text-text-muted focus:border-accent focus:ring-accent-soft disabled:bg-bg w-full rounded-md border px-3 py-2.5 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                        />

                        <p className="text-text-secondary mt-2 text-xs">
                            Kosongkan jika tidak ingin mengubah password.
                        </p>
                    </div>
                </div>

                <div className="border-border bg-bg/50 flex flex-col-reverse gap-2 border-t px-6 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={() => navigate(`/users/${id}`)}
                        disabled={submitting}
                        className="border-border bg-surface text-text-secondary hover:bg-bg rounded-md border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Batal
                    </button>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-accent hover:bg-accent-hover rounded-md px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </form>
        </div>
    );
}
