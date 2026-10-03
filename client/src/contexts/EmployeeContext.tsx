import type { Employee } from "../types/employee.ts";
import { createContext, useContext } from "react";

export interface EmployeeContextType {
    employee: Employee | null;
    loading: boolean;
    error: string | null;
}

export const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function useEmployee() {
    const context = useContext(EmployeeContext);
    if (!context) {
        throw new Error("useEmployee must be used within EmployeeProvider");
    }
    return context;
}
