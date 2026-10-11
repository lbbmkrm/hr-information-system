import EmployeeService from "../services/employee.service.js";
import type { Request, Response } from "express";
import type {
    CreateEmployeeData,
    EmployeeFilter,
    UpdateEmployeeData,
} from "../types/employeeTypes.js";
import type { jwtPayload } from "../lib/jwt.js";

export default class EmployeeController {
    private employeeService: EmployeeService;

    constructor() {
        this.employeeService = new EmployeeService();
    }

    public index = async (req: Request, res: Response): Promise<Response> => {
        const employees = await this.employeeService.getAllEmployees(
            req.user as jwtPayload,
            req.validatedQuery as EmployeeFilter,
        );

        return res.status(200).json({
            status: "success",
            message: "Data karyawan berhasil dimuat.",
            data: employees,
        });
    };

    public show = async (req: Request, res: Response): Promise<Response> => {
        const employee = await this.employeeService.getEmployeeById(
            req.user as jwtPayload,
            req.params.id as string,
        );

        return res.status(200).json({
            status: "success",
            message: "Detail data karyawan berhasil dimuat.",
            data: employee,
        });
    };

    public showByUser = async (req: Request, res: Response): Promise<Response> => {
        const employee = await this.employeeService.getEmployeeByUserId(
            req.user as jwtPayload,
            req.params.id as string,
        );

        return res.status(200).json({
            status: "success",
            message: "Data akun karyawan berhasil dimuat.",
            data: employee,
        });
    };

    public store = async (req: Request, res: Response): Promise<Response> => {
        const employee = await this.employeeService.addEmployee(
            req.user as jwtPayload,
            req.validatedBody as CreateEmployeeData,
        );

        return res.status(201).json({
            status: "success",
            message: "Data karyawan baru berhasil ditambahkan.",
            data: employee,
        });
    };

    public edit = async (req: Request, res: Response): Promise<Response> => {
        const employee = await this.employeeService.updateEmployee(
            req.user as jwtPayload,
            req.params.id as string,
            req.validatedBody as UpdateEmployeeData,
        );

        return res.status(200).json({
            status: "success",
            message: "Data karyawan berhasil diperbarui.",
            data: employee,
        });
    };

    public destroy = async (req: Request, res: Response): Promise<Response> => {
        await this.employeeService.deleteEmployee(req.user as jwtPayload, req.params.id as string);

        return res.status(200).json({
            status: "success",
            message: "Data karyawan berhasil dihapus.",
        });
    };
}
