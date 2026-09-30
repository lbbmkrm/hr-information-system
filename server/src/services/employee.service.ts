import EmployeeRepository from "../repositories/employee.repository.js";
import UserRepository from "../repositories/user.repository.js";
import AppError from "../utils/AppError.js";
import type {
    CreateEmployeeData,
    UpdateEmployeeData,
    EmployeeResponse,
    EmployeeFilter,
} from "../types/employeeTypes.js";
import type { jwtPayload } from "../lib/jwt.js";
import EmployeePolicy from "../policies/employee.policy.js";

export default class EmployeeService {
    private employeeRepository: EmployeeRepository;
    private userRepository: UserRepository;

    constructor() {
        this.employeeRepository = new EmployeeRepository();
        this.userRepository = new UserRepository();
    }

    private async getEmployee(id: string): Promise<EmployeeResponse> {
        const employee = await this.employeeRepository.findById(id);
        if (!employee) {
            throw new AppError("Data karyawan tidak ditemukan", 404);
        }
        return employee;
    }

    async addEmployee(user: jwtPayload, data: CreateEmployeeData): Promise<EmployeeResponse> {
        if (!EmployeePolicy.create(user)) {
            throw new AppError("Anda tidak memiliki izin untuk menambah data karyawan", 403);
        }

        if (data.userId) {
            const user = await this.userRepository.findById(data.userId);
            if (!user) {
                throw new AppError("User tidak ditemukan", 404);
            }

            const employee = await this.employeeRepository.findByUserId(data.userId);
            if (employee) {
                throw new AppError("User ini sudah memiliki data karyawan", 409);
            }
        }

        return this.employeeRepository.create(data);
    }

    async getAllEmployees(user: jwtPayload, filter: EmployeeFilter): Promise<EmployeeResponse[]> {
        if (!EmployeePolicy.viewAny(user)) {
            throw new AppError("Anda tidak memiliki izin untuk melihat data karyawan", 403);
        }
        return this.employeeRepository.findAll(filter);
    }

    async getEmployeeById(user: jwtPayload, id: string): Promise<EmployeeResponse> {
        const employee = await this.getEmployee(id);
        if (!EmployeePolicy.view(user, employee)) {
            throw new AppError("Anda tidak memiliki izin untuk melihat data karyawan ini", 403);
        }
        return employee;
    }

    async getEmployeeByUserId(id: string): Promise<EmployeeResponse> {
        const employee = await this.employeeRepository.findByUserId(id);
        if (!employee) {
            throw new AppError("Data karyawan untuk user ini tidak ditemukan", 404);
        }
        return employee;
    }

    async updateEmployee(
        user: jwtPayload,
        id: string,
        data: UpdateEmployeeData,
    ): Promise<EmployeeResponse> {
        const employee = await this.getEmployee(id);

        if (data.userId) {
            const employeeUser = await this.userRepository.findById(data.userId as string);
            if (!employeeUser) {
                throw new AppError("User tidak ditemukan", 404);
            }
        }

        if (!EmployeePolicy.update(user, employee)) {
            throw new AppError("Anda tidak memiliki izin untuk mengubah data karyawan ini", 403);
        }

        return this.employeeRepository.update(id, data);
    }

    async deleteEmployee(user: jwtPayload, id: string): Promise<void> {
        if (!EmployeePolicy.delete(user)) {
            throw new AppError("Anda tidak memiliki izin untuk menghapus data karyawan", 403);
        }
        await this.getEmployee(id);
        await this.employeeRepository.delete(id);
        return;
    }
}
