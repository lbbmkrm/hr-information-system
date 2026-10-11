import type { Employee } from "../generated/prisma/index.js";
import type {
    CreateEmployeeData,
    EmployeeFilter,
    UpdateEmployeeData,
} from "../types/employeeTypes.js";
export default class EmployeeRepository {
    create(data: CreateEmployeeData): Promise<Employee>;
    findAll(filter: EmployeeFilter): Promise<Employee[]>;
    findById(id: string): Promise<Employee | null>;
    findByUserId(userId: string): Promise<Employee | null>;
    update(id: string, data: UpdateEmployeeData): Promise<Employee>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=employee.repository.d.ts.map
