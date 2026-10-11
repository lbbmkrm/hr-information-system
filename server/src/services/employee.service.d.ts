import type {
    CreateEmployeeData,
    UpdateEmployeeData,
    EmployeeResponse,
    EmployeeFilter,
} from "../types/employeeTypes.js";
import type { jwtPayload } from "../lib/jwt.js";
export default class EmployeeService {
    private employeeRepository;
    private userRepository;
    constructor();
    private getEmployee;
    addEmployee(user: jwtPayload, data: CreateEmployeeData): Promise<EmployeeResponse>;
    getAllEmployees(user: jwtPayload, filter: EmployeeFilter): Promise<EmployeeResponse[]>;
    getEmployeeById(user: jwtPayload, id: string): Promise<EmployeeResponse>;
    getEmployeeByUserId(user: jwtPayload, id: string): Promise<EmployeeResponse>;
    updateEmployee(
        user: jwtPayload,
        id: string,
        data: UpdateEmployeeData,
    ): Promise<EmployeeResponse>;
    deleteEmployee(user: jwtPayload, id: string): Promise<void>;
}
//# sourceMappingURL=employee.service.d.ts.map
