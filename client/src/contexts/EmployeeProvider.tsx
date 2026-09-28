import { type ReactNode, useEffect, useState } from "react";
import type { Employee } from "../types/employee.ts";
import { getEmployeeByUserId } from "../api/employeeApi.ts";
import { useAuth } from "./AuthContext.tsx";
import { EmployeeContext } from "./EmployeeContext.tsx";
import { AxiosError } from "axios";

interface EmployeeState {
    employee: Employee | null;
    loading: boolean;
}
export default function EmployeeProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [state, setState] = useState<EmployeeState>({ employee: null, loading: true });

    useEffect(() => {
        if (!user) {
            return;
        }

        async function fetchEmployee() {
            setState({
                employee: null,
                loading: true,
            });

            try {
                const data = await getEmployeeByUserId(user?.userId as string);
                setState({
                    loading: false,
                    employee: data,
                });
            } catch (error) {
                if (error instanceof AxiosError && error.response?.status === 404) {
                    setState({
                        employee: null,
                        loading: false,
                    });
                } else {
                    console.error(error);
                    setState({
                        employee: null,
                        loading: false,
                    });
                }
            }
        }

        void fetchEmployee();
    }, [user]);

    const value: EmployeeState = user ? state : { employee: null, loading: false };

    return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
}
