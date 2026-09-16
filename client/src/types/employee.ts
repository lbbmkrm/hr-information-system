export interface Employee {
    id: string;
    name: string;
    position: string;
    department: string;
    joinDate: string;
    phone?: string;
    userId?: string;
}

export interface CreateEmployeePayload {
    name: string;
    position: string;
    department: string;
    joinDate: string;
    phone?: string | null;
}

export interface UpdateEmployeePayload {
    name?: string;
    position?: string;
    department?: string;
    joinDate?: string;
    phone?: string | null;
    userId?: string | null;
}

export interface filterGetEmployeesPayload {
    department?: string;
    position?: string;
    joinDate?: string;
}