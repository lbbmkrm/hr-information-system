import { useEffect, useState } from "react";
import type { LeaveRequest } from "../../types/leaveRequest.ts";
import { getLeaveRequests } from "../../api/leaveRequestApi.ts";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";

export default function LeaveRequestList() {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLeaveRequests() {
            try {
                setLoading(true);
                const leaveRequests = await getLeaveRequests();
                setLeaveRequests(leaveRequests);
            } catch (e) {
                console.error(e);
                setError(getErrorMessage(e, "Gagal mengambil daftar pengajuan cuti."));
            } finally {
                setLoading(false);
            }
        }
        void fetchLeaveRequests();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6 flex w-full items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">Leave Request</h1>
                <div className="flex flex-wrap">
                    <button className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-blue-700">
                        <Link to={"/leave-requests/add"}>Tambah Permintaan Cuti</Link>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm text-gray-700">
                    <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
                        <tr>
                            <th className="px-4 py-3">Nama</th>
                            <th className="px-4 py-3">Mulai</th>
                            <th className="px-4 py-3">Berakhir</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveRequests.map((l: LeaveRequest, index) => (
                            <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-3">{l.employee.name}</td>
                                <td className="px-4 py-3">
                                    {new Date(l.startDate).toLocaleDateString("id-ID")}
                                </td>
                                <td className="px-4 py-3">
                                    {new Date(l.endDate).toLocaleDateString("id-ID")}
                                </td>
                                <td className="px-4 py-3">{l.status}</td>
                                <td className="px-4 py-3">
                                    <Link to={`/leave-requests/${l.id}`} state={l}>
                                        Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
