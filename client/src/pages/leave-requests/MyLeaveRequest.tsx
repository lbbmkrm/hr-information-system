import { useEffect, useState } from "react";
import type { LeaveRequest } from "../../types/leaveRequest.ts";
import { useEmployee } from "../../contexts/EmployeeContext.tsx";
import { getLeaveRequestByEmployeeId } from "../../api/leaveRequestApi.ts";
import { Link } from "react-router-dom";

export default function MyLeaveRequest() {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { employee, loading: employeeLoading } = useEmployee();

    useEffect(() => {
        if (!employee) return;

        async function fetchLeaveRequests(): Promise<void> {
            try {
                setLoading(true);
                const response = await getLeaveRequestByEmployeeId(employee!.id);
                setLeaveRequests(response);
            } catch (error) {
                console.error(error);
                setError("Gagal mengambil data cuti");
            } finally {
                setLoading(false);
            }
        }

        void fetchLeaveRequests();
    }, [employee]);

    if (employeeLoading) {
        return <div>Memuat data karyawan...</div>;
    }

    if (!employee) {
        return <div>Anda belum terhubung ke data karyawan</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-8">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">Cuti Saya</h1>
                <Link to="/leave-requests/add" className="rounded bg-blue-500 px-4 py-2 text-white">
                    + Ajukan Cuti
                </Link>
            </div>

            {leaveRequests && leaveRequests.length === 0 && (
                <p className="text-gray-500">Belum ada pengajuan cuti.</p>
            )}

            {leaveRequests && leaveRequests.length > 0 && (
                <table className="w-full rounded bg-white shadow">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-3">Tanggal Mulai</th>
                            <th className="p-3">Tanggal Selesai</th>
                            <th className="p-3">Alasan</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveRequests.map((lr) => (
                            <tr key={lr.id} className="border-t">
                                <td className="p-3">
                                    {new Date(lr.startDate).toLocaleDateString("id-ID")}
                                </td>
                                <td className="p-3">
                                    {new Date(lr.endDate).toLocaleDateString("id-ID")}
                                </td>
                                <td className="p-3">{lr.reason}</td>
                                <td className="p-3">{lr.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
