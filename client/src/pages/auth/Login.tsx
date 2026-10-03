import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        try {
            const user = await login(email, password);

            navigate(from, { state: { user: user }, replace: true });
        } catch (error) {
            setError(getErrorMessage(error, "Email or password is incorrect"));
            console.log(error);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-lg bg-white p-10 shadow-md"
            >
                <h1 className="mb-6 text-center text-2xl font-semibold text-gray-800">Login</h1>

                {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}

                <div className="mb-4">
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-600">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="password"
                        className="mb-1 block text-sm font-medium text-gray-600"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white transition duration-200 hover:bg-blue-700"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
