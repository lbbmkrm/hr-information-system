import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Employee } from "../../types/employee.ts";
import { deleteEmployee, getEmployeesById } from "../../api/employeeApi.ts";
import { getErrorMessage } from "../../utils/getErrorMessage.ts";
import EmployeePolicy from "../../policies/EmployeePolicy.ts";
import type { JwtPayload } from "../../types/auth.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";

export default function ViewEmployee() {
    const { id } = useParams<{ id: string }>();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const { user } = useAuth();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true);
                const data = await getEmployeesById(id as string);
                setEmployee(data);
            } catch (e) {
                console.error(e);
                setError(getErrorMessage(e, "Gagal mengambil data karyawan."));
            } finally {
                setLoading(false);
            }
        };
        void fetchData();
    }, [id]);

    const handleDeleteEmployee = async (id: string) => {
        try {
            await deleteEmployee(id);
        } catch (e) {
            console.error(e);
            setError(getErrorMessage(e, "Gagal menghapus data karyawan."));
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={"flex min-h-screen w-full items-center justify-center"}>
            <div className={"m-4 flex flex-col justify-between gap-8 p-4 md:m-8 md:p-8"}>
                <div id={"profile"} className={""}>
                    <div>{employee?.name.charAt(0).toLocaleUpperCase()}</div>
                </div>
                <div id={"information"} className={""}>
                    <ul>
                        <li>{employee?.name}</li>
                        <li>{employee?.department}</li>
                        <li>{employee?.position}</li>
                        <li>
                            {new Date(employee?.joinDate as string).toLocaleDateString("id-ID")}
                        </li>
                    </ul>
                </div>
                <div className={"flex w-full justify-between"}>
                    <button className={"text-sky-600 hover:underline"}>
                        <Link to={`/employees/edit/${employee?.id}`} state={employee?.id}>
                            edit
                        </Link>
                    </button>
                    {EmployeePolicy.delete(user as JwtPayload) && (
                        <button
                            onClick={() => handleDeleteEmployee(employee?.id as string)}
                            className={"text-red-600 hover:underline"}
                        >
                            <Link to={"/employees"}>hapus</Link>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
