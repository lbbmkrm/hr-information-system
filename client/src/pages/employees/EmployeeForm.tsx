import { type SubmitEvent, useState } from "react";
import { createEmployee } from "../../api/employeeApi.ts";
import { useNavigate } from "react-router-dom";

export default function EmployeeForm() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [department, setDepartment] = useState("");
    const [joinDate, setJoinDate] = useState("");
    const [phone, setPhone] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await createEmployee({
                name: name,
                position: position,
                department: department,
                joinDate: joinDate,
                phone: phone || undefined,
            });
            navigate("/employees");
        } catch (err) {
            setError("gagal menambahkan employees.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg p-8">
            <h1 className="mb-4 text-xl font-bold">Tambah Karyawan</h1>

            {error && <p className="mb-2 text-sm text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="rounded bg-white p-6 shadow">
                <label className="mb-1 block text-sm font-medium">Nama</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-3 w-full rounded border p-2"
                    required
                />

                <label className="mb-1 block text-sm font-medium">Posisi</label>
                <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="mb-3 w-full rounded border p-2"
                    required
                />

                <label className="mb-1 block text-sm font-medium">Departemen</label>
                <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mb-3 w-full rounded border p-2"
                    required
                />

                <label className="mb-1 block text-sm font-medium">Tanggal Bergabung</label>
                <input
                    type="date"
                    value={joinDate}
                    onChange={(e) => setJoinDate(e.target.value)}
                    className="mb-3 w-full rounded border p-2"
                    required
                />

                <label className="mb-1 block text-sm font-medium">Nomor Telepon (opsional)</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mb-4 w-full rounded border p-2"
                />

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
                    >
                        {loading ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/employees")}
                        className="rounded border px-4 py-2"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
}
