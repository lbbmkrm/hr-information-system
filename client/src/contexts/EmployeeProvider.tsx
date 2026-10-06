import { type ReactNode, useEffect, useState } from "react";
import type { Employee } from "../types/employee.ts";
import { getEmployeeByUserId } from "../api/employeeApi.ts";
import { useAuth } from "./AuthContext.tsx";
import { EmployeeContext } from "./EmployeeContext.tsx";
import axios from "axios";
import { getErrorMessage } from "../utils/getErrorMessage.ts";

interface EmployeeState {
    employee: Employee | null;
    loading: boolean;
    error: string | null;
}
export default function EmployeeProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [state, setState] = useState<EmployeeState>({
        employee: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        if (!user) {
            return;
        }

        async function fetchEmployee() {
            setState({
                employee: null,
                loading: true,
                error: null,
            });

            try {
                const data = await getEmployeeByUserId(user?.userId as string);
                setState({
                    loading: false,
                    employee: data,
                    error: null,
                });
            } catch (error) {
                console.error(error);
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    setState({
                        employee: null,
                        loading: false,
                        error: null,
                    });
                    return;
                }

                setState({
                    employee: null,
                    loading: false,
                    error: getErrorMessage(error, "Gagal mengambil data karyawan."),
                });
            }
        }

        void fetchEmployee();
    }, [user]);

    const value: EmployeeState = user ? state : { employee: null, loading: false, error: null };

    return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
}
