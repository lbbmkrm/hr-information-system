export interface CreateEmployeeData {
    name: string;
    position: string;
    department: string;
    joinDate : Date;
    phone: string | null;
    userId: string|null;
}

export interface UpdateEmployeeData {
    name: string;
    position: string;
    department: string;
    joinDate : Date;
    phone: string | null;
    userId: string|null;
}

export interface EmployeeResponse {
    id: string;
    name: string;
    position: string;
    department: string;
    joinDate: Date;
    phone: string | null;
    userId: string|null;
}

export interface EmployeeFilter {
    department: string;
    position: string;
    joinDate: Date;
}