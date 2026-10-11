import { type SubmitEvent, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { createEmployee } from "../../api/employeeApi.ts";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";

export default function CreateEmployee() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [department, setDepartment] = useState("");
    const [joinDate, setJoinDate] = useState("");
    const [phone, setPhone] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await createEmployee({
                name,
                position,
                department,
                joinDate,
                phone: phone || undefined,
            });

            navigate("/employees");
        } catch (error) {
            console.error(error);

            setError(getErrorMessage(error, "Gagal menambahkan karyawan."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl space-y-6">
            {/* Page heading */}
            <section>
                <button
                    type="button"
                    onClick={() => navigate("/employees")}
                    className="text-text-secondary hover:text-text mb-4 inline-flex items-center gap-1.5 text-sm transition"
                >
                    <ArrowLeft className="size-4" />
                    Kembali ke daftar karyawan
                </button>

                <h1 className="text-text text-xl font-semibold">Tambah Karyawan</h1>

                <p className="text-text-secondary mt-1 text-sm">
                    Tambahkan informasi karyawan baru ke dalam sistem.
                </p>
            </section>

            {/* Form */}
            <section className="border-border bg-surface rounded-lg border">
                <div className="border-border border-b px-5 py-4">
                    <h2 className="text-text text-sm font-semibold">Informasi Karyawan</h2>

                    <p className="text-text-secondary mt-1 text-xs">
                        Isi informasi dasar karyawan.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-5">
                    {error && (
                        <div className="border-rejected-bg bg-rejected-bg mb-5 rounded-md border px-4 py-3">
                            <p className="text-rejected-text text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Name */}
                        <div className="md:col-span-2">
                            <label
                                htmlFor="name"
                                className="text-text mb-1.5 block text-sm font-medium"
                            >
                                Nama
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={loading}
                                placeholder="Masukkan nama lengkap"
                                className="border-border bg-surface text-text placeholder:text-text-muted focus:border-accent focus:ring-accent/10 disabled:bg-bg w-full rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Position */}
                        <div>
                            <label
                                htmlFor="position"
                                className="text-text mb-1.5 block text-sm font-medium"
                            >
                                Posisi
                            </label>

                            <input
                                id="position"
                                type="text"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                required
                                disabled={loading}
                                placeholder="Contoh: Software Engineer"
                                className="border-border bg-surface text-text placeholder:text-text-muted focus:border-accent focus:ring-accent/10 disabled:bg-bg w-full rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Department */}
                        <div>
                            <label
                                htmlFor="department"
                                className="text-text mb-1.5 block text-sm font-medium"
                            >
                                Departemen
                            </label>

                            <input
                                id="department"
                                type="text"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                                disabled={loading}
                                placeholder="Contoh: IT"
                                className="border-border bg-surface text-text placeholder:text-text-muted focus:border-accent focus:ring-accent/10 disabled:bg-bg w-full rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Join Date */}
                        <div>
                            <label
                                htmlFor="joinDate"
                                className="text-text mb-1.5 block text-sm font-medium"
                            >
                                Tanggal Bergabung
                            </label>

                            <input
                                id="joinDate"
                                type="date"
                                value={joinDate}
                                onChange={(e) => setJoinDate(e.target.value)}
                                required
                                disabled={loading}
                                className="border-border bg-surface text-text focus:border-accent focus:ring-accent/10 disabled:bg-bg w-full rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label
                                htmlFor="phone"
                                className="text-text mb-1.5 block text-sm font-medium"
                            >
                                Nomor Telepon
                                <span className="text-text-muted ml-1">(opsional)</span>
                            </label>

                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={loading}
                                placeholder="Contoh: 08123456789"
                                className="border-border bg-surface text-text placeholder:text-text-muted focus:border-accent focus:ring-accent/10 disabled:bg-bg w-full rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="border-border mt-6 flex items-center justify-end gap-3 border-t pt-5">
                        <button
                            type="button"
                            onClick={() => navigate("/employees")}
                            disabled={loading}
                            className="border-border text-text-secondary hover:bg-bg hover:text-text rounded-md border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-accent hover:bg-accent-hover inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Save className="size-4" />

                            {loading ? "Menyimpan..." : "Simpan Karyawan"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
