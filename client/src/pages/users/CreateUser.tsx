import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
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
        <div className="container mx-auto max-w-lg p-6">
            <h1 className="mb-6 text-2xl font-semibold text-gray-800">Tambah User</h1>

            <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-6 shadow">
                {error && <p className="text-sm text-red-600">{error}</p>}

                <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        minLength={6}
                        required
                        className="w-full rounded border px-3 py-2"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        User baru dibuat dengan role EMPLOYEE.
                    </p>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => navigate("/users")}
                        disabled={loading}
                        className="rounded border px-4 py-2 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                    >
                        {loading ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            </form>
        </div>
    );
}
