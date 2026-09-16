import { useEffect, useState } from "react";
import {  getEmployees } from "../api/employeeApi.ts";
import type {Employee} from "../types/employee.ts";
import {Link} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext.tsx";

export default function EmployeeList() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {user} = useAuth();

    useEffect(() => {
        async function fetchEmployees(): Promise<void> {
            try {
                setLoading(true);
                const data = await getEmployees();
                setEmployees(data);
            } catch (error) {
                console.log(error);
                setError("failed to fetch employees data");
            } finally {
                setLoading(false);
            }
        }
        void fetchEmployees();
    }, []);

    if (!user) {
        return <p>anda belum login</p>;
    }

    if (loading) {
        return <p>loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="p-8">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">Daftar Karyawan</h1>
                {(user.role === "ADMIN" || user.role === "HR") && (
                    <Link to={"/employees/new"} className="rounded bg-blue-500 px-4 py-2 text-white">
                        + Tambah Karyawan
                    </Link>
                )}
            </div>

            <table className="w-full border-collapse rounded bg-white shadow">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-3">Nama</th>
                        <th className="p-3">Posisi</th>
                        <th className="p-3">Departemen</th>
                        <th className="p-3">Tanggal Bergabung</th>
                        <th className="p-3">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee, index) => (
                        <tr key={index}>
                            <td className="p-3">{employee.name}</td>
                            <td className="p-3">{employee.position}</td>
                            <td className="p-3">{employee.department}</td>
                            <td className={"p-3"}>
                                {new Date(employee.joinDate).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </td>
                            <td className="p-3">
                                <button className={"text-sky-600 hover:underline"}>
                                    <Link to={`${employee.id}`} state={employee.id}>detail</Link>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
