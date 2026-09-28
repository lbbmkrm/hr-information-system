import { useEffect, useState, type SubmitEvent } from "react";
import type { LeaveRequestPayload } from "../../types/leaveRequest.ts";
import { createLeaveRequest } from "../../api/leaveRequestApi.ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.tsx";
import type { Employee } from "../../types/employee.ts";
import { getEmployeeByUserId } from "../../api/employeeApi.ts";
import { AxiosError } from "axios";

export default function LeaveRequestForm() {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState<Employee>();
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [reason, setReason] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuth();

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!employee) {
                setError("No employee found");
                return;
            }
            await createLeaveRequest({
                employeeId: employee?.id,
                startDate: startDate,
                endDate: endDate,
                reason: reason,
            } as LeaveRequestPayload);
            navigate("/leave-requests");
        } catch (error) {
            console.log(error);
            setError("gagal membuat permintaan cuti");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const authenticatedUser = user;

        async function fetchEmployeeData() {
            try {
                setLoading(true);
                const response = await getEmployeeByUserId(authenticatedUser.userId);
                setEmployee(response);
            } catch (e) {
                console.log(e);
                if (e instanceof AxiosError && e.response?.status == 404) {
                    alert("this user does not has employee data");
                    navigate("/leave-requests");
                }
            } finally {
                setLoading(false);
            }
        }

        void fetchEmployeeData();
    }, [user]);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }
    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto w-full max-w-lg p-6">
            <h1 className="mb-6 text-2xl font-semibold text-gray-800">Tambah Permintaan Cuti</h1>
            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-md"
            >
                <div>
                    <label
                        htmlFor={"startDate"}
                        className="mb-1 block text-sm font-medium text-gray-600"
                    >
                        Tanggal Mulai
                    </label>
                    <input
                        id={"startDate"}
                        type={"date"}
                        value={startDate as string}
                        onChange={(e) => setStartDate(e.target.value as string)}
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label
                        htmlFor={"endDate"}
                        className="mb-1 block text-sm font-medium text-gray-600"
                    >
                        Tanggal Berakhir
                    </label>
                    <input
                        id={"endDate"}
                        type={"date"}
                        value={endDate as string}
                        onChange={(e) => setEndDate(e.target.value as string)}
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label
                        htmlFor={"reason"}
                        className="mb-1 block text-sm font-medium text-gray-600"
                    >
                        Alasan
                    </label>
                    <input
                        id={"reason"}
                        type={"text"}
                        value={reason as string}
                        onChange={(e) => setReason(e.target.value as string)}
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white transition duration-200 hover:bg-blue-700"
                    >
                        Kirim
                    </button>
                </div>
            </form>
        </div>
    );
}
