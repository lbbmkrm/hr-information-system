import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../../api/userApi.ts";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";

export default function CreateUser() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setLoading(true);
            setError(null);

            await createUser({ email, password });

            navigate("/users", { replace: true });
        } catch (requestError) {
            console.error(requestError);
            setError(getErrorMessage(requestError, "Gagal membuat user."));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-3xl">
            <Link to="/users" className="text-text-secondary hover:text-text text-sm transition">
                ← Kembali ke Users
            </Link>

            <div className="mt-4 mb-6">
                <h1 className="text-text text-2xl font-semibold tracking-tight">Tambah User</h1>

                <p className="text-text-secondary mt-1 text-sm">
                    Buat akun pengguna baru untuk mengakses sistem.
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
                            Masukkan email dan password untuk akun baru.
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
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="email"
                            placeholder="nama@perusahaan.com"
                            required
                            disabled={loading}
                            className="border-border bg-surface text-text placeholder:text-text-muted focus:border-accent focus:ring-accent-soft disabled:bg-bg w-full rounded-md border px-3 py-2.5 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="text-text mb-1.5 block text-sm font-medium"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="new-password"
                            minLength={6}
                            placeholder="Masukkan password"
                            required
                            disabled={loading}
                            className="border-border bg-surface text-text placeholder:text-text-muted focus:border-accent focus:ring-accent-soft disabled:bg-bg w-full rounded-md border px-3 py-2.5 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                        />

                        <p className="text-text-secondary mt-2 text-xs">
                            User baru akan dibuat dengan role EMPLOYEE.
                        </p>
                    </div>
                </div>

                <div className="border-border bg-bg/50 flex flex-col-reverse gap-2 border-t px-6 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={() => navigate("/users")}
                        disabled={loading}
                        className="border-border bg-surface text-text-secondary hover:bg-bg rounded-md border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Batal
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-accent hover:bg-accent-hover rounded-md px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Menyimpan..." : "Simpan User"}
                    </button>
                </div>
            </form>
        </div>
    );
}
