import { type SubmitEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        try {
            setSubmitting(true);

            const user = await login(email, password);

            navigate(from, {
                state: { user },
                replace: true,
            });
        } catch (error) {
            console.error(error);

            setError(getErrorMessage(error, "Email atau password yang Anda masukkan salah."));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="bg-bg flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="bg-accent mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-md text-sm font-semibold text-white">
                        HR
                    </div>

                    <h1 className="text-text text-2xl font-semibold tracking-tight">
                        HR Information System
                    </h1>

                    <p className="text-text-secondary mt-2 text-sm">
                        Masuk untuk mengakses sistem informasi karyawan.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="border-border bg-surface rounded-lg border p-6"
                >
                    <div className="mb-6">
                        <h2 className="text-text text-base font-semibold">Sign in</h2>

                        <p className="text-text-secondary mt-1 text-sm">
                            Masukkan kredensial akun Anda.
                        </p>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="border-rejected-bg bg-rejected-bg text-rejected-text mb-5 rounded-md border px-3 py-2.5 text-sm"
                        >
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="text-text mb-1.5 block text-sm font-medium"
                        >
                            Email
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={submitting}
                            required
                            className="border-border bg-surface text-text placeholder:text-text-muted focus:border-accent focus:ring-accent-soft disabled:bg-bg w-full rounded-md border px-3 py-2.5 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                            placeholder="nama@perusahaan.com"
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="text-text mb-1.5 block text-sm font-medium"
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={submitting}
                            required
                            className="border-border bg-surface text-text placeholder:text-text-muted focus:border-accent focus:ring-accent-soft disabled:bg-bg w-full rounded-md border px-3 py-2.5 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                            placeholder="Masukkan password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-accent hover:bg-accent-hover w-full rounded-md px-4 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? "Memproses..." : "Masuk"}
                    </button>
                </form>

                <p className="text-text-muted mt-6 text-center text-xs">HR Information System</p>
            </div>
        </main>
    );
}
