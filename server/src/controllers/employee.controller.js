import EmployeeService from "../services/employee.service.js";
export default class EmployeeController {
    employeeService;
    constructor() {
        this.employeeService = new EmployeeService();
    }
    index = async (req, res) => {
        const employees = await this.employeeService.getAllEmployees(req.user, req.validatedQuery);
        return res.status(200).json({
            status: "success",
            message: "Data karyawan berhasil dimuat.",
            data: employees,
        });
    };
    show = async (req, res) => {
        const employee = await this.employeeService.getEmployeeById(req.user, req.params.id);
        return res.status(200).json({
            status: "success",
            message: "Detail data karyawan berhasil dimuat.",
            data: employee,
        });
    };
    showByUser = async (req, res) => {
        const employee = await this.employeeService.getEmployeeByUserId(req.user, req.params.id);
        return res.status(200).json({
            status: "success",
            message: "Data akun karyawan berhasil dimuat.",
            data: employee,
        });
    };
    store = async (req, res) => {
        const employee = await this.employeeService.addEmployee(req.user, req.validatedBody);
        return res.status(201).json({
            status: "success",
            message: "Data karyawan baru berhasil ditambahkan.",
            data: employee,
        });
    };
    edit = async (req, res) => {
        const employee = await this.employeeService.updateEmployee(req.user, req.params.id, req.validatedBody);
        return res.status(200).json({
            status: "success",
            message: "Data karyawan berhasil diperbarui.",
            data: employee,
        });
    };
    destroy = async (req, res) => {
        await this.employeeService.deleteEmployee(req.user, req.params.id);
        return res.status(200).json({
            status: "success",
            message: "Data karyawan berhasil dihapus.",
        });
    };
}
//# sourceMappingURL=employee.controller.js.map