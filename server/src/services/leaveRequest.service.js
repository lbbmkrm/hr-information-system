import LeaveRequestRepository from "../repositories/leaveRequest.repository.js";
import EmployeeRepository from "../repositories/employee.repository.js";
import AppError from "../utils/AppError.js";
import EmployeeService from "./employee.service.js";
import dateValidator from "../utils/dateValidator.js";
import LeaveRequestPolicy from "../policies/leaveRequest.policy.js";
export default class LeaveRequestService {
    leaveRequestRepository;
    employeeRepository;
    employeeService;
    constructor() {
        this.leaveRequestRepository = new LeaveRequestRepository();
        this.employeeRepository = new EmployeeRepository();
        this.employeeService = new EmployeeService();
    }
    async getAllLeaveRequests(user, filter) {
        if (!LeaveRequestPolicy.viewAny(user)) {
            throw new AppError("Anda tidak memiliki izin untuk melihat daftar pengajuan cuti", 403);
        }
        return this.leaveRequestRepository.findAll(filter);
    }
    async getLeaveRequest(user, id) {
        const leaveRequest = await this.leaveRequestRepository.findById(id);
        if (!leaveRequest) {
            throw new AppError("Pengajuan cuti tidak ditemukan", 404);
        }
        if (!LeaveRequestPolicy.view(user, leaveRequest)) {
            throw new AppError("Anda tidak memiliki izin untuk melihat pengajuan cuti ini", 403);
        }
        return leaveRequest;
    }
    async getEmployeeLeaveRequest(user, id) {
        await this.employeeService.getEmployeeById(user, id);
        return this.leaveRequestRepository.findByEmployee(id);
    }
    async addLeaveRequest(user, data) {
        const employee = await this.employeeRepository.findById(data.employeeId);
        if (!employee) {
            throw new AppError("Data karyawan tidak ditemukan", 404);
        }
        if (!LeaveRequestPolicy.create(user, employee)) {
            throw new AppError("Anda tidak memiliki izin untuk membuat pengajuan cuti untuk karyawan ini", 403);
        }
        return this.leaveRequestRepository.create(data);
    }
    async updateLeaveRequest(user, id, data) {
        const oldLeaveRequest = await this.getLeaveRequest(user, id);
        if (!LeaveRequestPolicy.update(user, oldLeaveRequest)) {
            throw new AppError("Anda tidak memiliki izin untuk mengubah pengajuan cuti ini", 403);
        }
        const startDate = data.startDate ?? oldLeaveRequest.startDate;
        const endDate = data.endDate ?? oldLeaveRequest.endDate;
        dateValidator(startDate, endDate);
        return this.leaveRequestRepository.update(id, data);
    }
    async updateStatusLeaveRequest(user, id, data) {
        const leaveRequest = await this.getLeaveRequest(user, id);
        if (!LeaveRequestPolicy.review(user, leaveRequest)) {
            throw new AppError("Anda tidak memiliki izin untuk mereview pengajuan cuti ini", 403);
        }
        return this.leaveRequestRepository.updateStatus(id, data);
    }
    async deleteLeaveRequest(user, id) {
        const leaveRequest = await this.getLeaveRequest(user, id);
        if (!LeaveRequestPolicy.delete(user, leaveRequest)) {
            throw new AppError("Anda tidak memiliki izin untuk menghapus pengajuan cuti ini", 403);
        }
        return this.leaveRequestRepository.delete(id);
    }
}
//# sourceMappingURL=leaveRequest.service.js.map