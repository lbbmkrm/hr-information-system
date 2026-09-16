import {type ChangeEvent, useState} from "react";
import {createEmployee} from "../api/employeeApi.ts";
import {useNavigate} from "react-router-dom";

export default function EmployeeForm(){
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [department, setDepartment] = useState("");
    const [joinDate, setJoinDate] = useState("");
    const [phone, setPhone] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: ChangeEvent): Promise<void> => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try{
            await createEmployee({
                name: name,
                position: position,
                department: department,
                joinDate: joinDate,
                phone: phone || undefined,
            });
            setLoading(false);
            navigate('/employees');
        }catch(err){
            setError("gagal menambahkan employee.");
            console.log(err);
        }
    }

    return (
        <div className="p-8 max-w-lg">
            <h1 className="text-xl font-bold mb-4">Tambah Karyawan</h1>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
                <label className="block text-sm font-medium mb-1">Nama</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-2 rounded mb-3"
                    required
                />

                <label className="block text-sm font-medium mb-1">Posisi</label>
                <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full border p-2 rounded mb-3"
                    required
                />

                <label className="block text-sm font-medium mb-1">Departemen</label>
                <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full border p-2 rounded mb-3"
                    required
                />

                <label className="block text-sm font-medium mb-1">Tanggal Bergabung</label>
                <input
                    type="date"
                    value={joinDate}
                    onChange={(e) => setJoinDate(e.target.value)}
                    className="w-full border p-2 rounded mb-3"
                    required
                />

                <label className="block text-sm font-medium mb-1">Nomor Telepon (opsional)</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                />

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        {loading ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/employees")}
                        className="border px-4 py-2 rounded"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
}