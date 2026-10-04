import { useEffect, useState } from "react";
import type { LeaveRequest } from "../../types/leaveRequest.ts";
import { useEmployee } from "../../contexts/EmployeeContext.tsx";
import { deleteLeaveRequest, getLeaveRequestByEmployeeId } from "../../api/leaveRequestApi.ts";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";

export default function ListMyLeaveRequests() {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { employee, loading: employeeLoading, error: employeeError } = useEmployee();

    useEffect(() => {
        if (!employee) return;

        async function fetchLeaveRequests(): Promise<void> {
            try {
                setLoading(true);
                const response = await getLeaveRequestByEmployeeId(employee!.id);
                setLeaveRequests(response);
            } catch (e) {
                console.error(e);
                setError(getErrorMessage(e, "Gagal mengambil riwayat pengajuan cuti."));
            } finally {
                setLoading(false);
            }
        }

        void fetchLeaveRequests();
    }, [employee]);

    async function handleDeleteLeaveRequest(leaveRequest: LeaveRequest) {
        const confirmed = window.confirm("Yakin ingin menghapus pengajuan cuti ini?");
        if (!confirmed) return;

        try {
            setDeletingId(leaveRequest.id);
            setError(null);
            await deleteLeaveRequest(leaveRequest.id);
            setLeaveRequests(
                (current) => current?.filter((request) => request.id !== leaveRequest.id) ?? null,
            );
        } catch (deleteError) {
            console.error(deleteError);
            setError(getErrorMessage(deleteError, "Gagal menghapus pengajuan cuti."));
        } finally {
            setDeletingId(null);
        }
    }

    if (employeeLoading) {
        return <div>Memuat data karyawan...</div>;
    }

    if (employeeError) {
        return <div>{employeeError}</div>;
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
                            <th className={"p-3"}></th>
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
                                <td className="p-3">
                                    <Link
                                        to={`/leave-requests/edit/${lr.id}`}
                                        className="text-sky-600 hover:underline"
                                    >
                                        Ubah
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => void handleDeleteLeaveRequest(lr)}
                                        disabled={deletingId === lr.id}
                                        className="ml-3 text-red-600 hover:underline disabled:opacity-50"
                                    >
                                        {deletingId === lr.id ? "Menghapus..." : "Hapus"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
