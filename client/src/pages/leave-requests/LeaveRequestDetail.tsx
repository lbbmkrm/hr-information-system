import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { LeaveRequest } from "../../types/leaveRequest.ts";
import { getLeaveRequestById } from "../../api/leaveRequestApi.ts";

export default function LeaveRequestDetail() {
    const location = useLocation();
    const { id } = useParams<{ id: string }>();

    const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(
        (location.state as LeaveRequest) ?? null,
    );
    const [loading, setLoading] = useState<boolean>(!location.state);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (location.state) {
            return;
        }

        async function fetchLeaveRequest() {
            try {
                setLoading(true);
                const response = await getLeaveRequestById(id as string);
                setLeaveRequest(response);
            } catch (err) {
                console.error(err);
                setError("Gagal mengambil data cuti");
            } finally {
                setLoading(false);
            }
        }

        void fetchLeaveRequest();
    }, [id, location.state]);

    if (loading) {
        return <div className="p-8 text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-500">{error}</div>;
    }

    if (!leaveRequest) {
        return <div className="p-8">Data tidak ditemukan</div>;
    }

    return (
        <div className="container mx-auto max-w-2xl p-6">
            <div className={"flex items-center justify-between p-2"}>
                <h1 className="text-2xl font-semibold text-gray-800">Detail Permintaan Cuti</h1>
                <button
                    className={
                        "cursor-pointer rounded border border-sky-500 p-2 hover:bg-sky-500 hover:text-white"
                    }
                >
                    <Link
                        to={`/leave-requests/edit/${leaveRequest.id}/status`}
                        state={leaveRequest}
                    >
                        Update status
                    </Link>
                </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm text-gray-700">
                    <tbody>
                        <tr className="border-b border-gray-200">
                            <th className="w-48 bg-gray-50 px-4 py-3 font-medium text-gray-600">
                                Nama
                            </th>
                            <td className="px-4 py-3">{leaveRequest.employee?.name || "-"}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <th className="w-48 bg-gray-50 px-4 py-3 font-medium text-gray-600">
                                Alasan
                            </th>
                            <td className="px-4 py-3">{leaveRequest.reason || "-"}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <th className="w-48 bg-gray-50 px-4 py-3 font-medium text-gray-600">
                                Tanggal Mulai
                            </th>
                            <td className="px-4 py-3">
                                {new Date(leaveRequest.startDate).toLocaleDateString("id-ID")}
                            </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <th className="w-48 bg-gray-50 px-4 py-3 font-medium text-gray-600">
                                Tanggal Berakhir
                            </th>
                            <td className="px-4 py-3">
                                {new Date(leaveRequest.endDate).toLocaleDateString("id-ID")}
                            </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <th className="w-48 bg-gray-50 px-4 py-3 font-medium text-gray-600">
                                Status
                            </th>
                            <td className="px-4 py-3">{leaveRequest.status || "-"}</td>
                        </tr>
                        <tr>
                            <th className="w-48 bg-gray-50 px-4 py-3 font-medium text-gray-600">
                                Di review oleh
                            </th>
                            <td className="px-4 py-3">
                                {leaveRequest.reviewer?.employee.name || "-"}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
