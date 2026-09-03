import EmployeeService from "../services/employee.service.js";
import type { Request, Response } from "express";
import AppError from "../utils/AppError.js";
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
        try {
            const employees = await this.employeeService.getAllEmployees(
                req.user as jwtPayload,
                req.validatedQuery as EmployeeFilter,
            );
            return res.status(200).json({
                status: "success",
                message: "Retrived employees data successfully",
                data: employees,
            });
        } catch (err) {
            if (err instanceof AppError) {
                return res.status(err.code).json({
                    status: "error",
                    message: err.message,
                });
            }
            return res.status(500).json({
                status: "error",
                message: "Something went wrong",
            });
        }
    };

    public show = async (req: Request, res: Response): Promise<Response> => {
        try {
            const employee = await this.employeeService.getEmployeeById(
                req.user as jwtPayload,
                req.params.id as string,
            );
            return res.status(200).json({
                status: "success",
                message: "Retrieved employee data successfully",
                data: employee,
            });
        } catch (err) {
            if (err instanceof AppError) {
                return res.status(err.code).json({
                    status: "error",
                    message: err.message,
                });
            }
            return res.status(500).json({
                status: "error",
                message: "Something went wrong",
            });
        }
    };

    public showByUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const employee = await this.employeeService.getEmployeeByUserId(
                req.params.id as string,
            );
            return res.status(200).json({
                status: "success",
                message: "Retrieved employee data successfully",
                data: employee,
            });
        } catch (err) {
            if (err instanceof AppError) {
                return res.status(err.code).json({
                    status: "error",
                    message: err.message,
                });
            }
            return res.status(500).json({
                status: "error",
                message: "Something went wrong",
            });
        }
    };

    public store = async (req: Request, res: Response): Promise<Response> => {
        try {
            const employee = await this.employeeService.addEmployee(
                req.user as jwtPayload,
                req.validatedBody as CreateEmployeeData,
            );
            return res.status(201).json({
                status: "success",
                message: "Created employee data successfully",
                data: employee,
            });
        } catch (err) {
            if (err instanceof AppError) {
                return res.status(err.code).json({
                    status: "error",
                    message: err.message,
                });
            }
            return res.status(500).json({
                status: "error",
                message: "Something went wrong",
            });
        }
    };
    public edit = async (req: Request, res: Response): Promise<Response> => {
        try {
            const employee = await this.employeeService.updateEmployee(
                req.user as jwtPayload,
                req.params.id as string,
                req.validatedBody as UpdateEmployeeData,
            );
            return res.status(200).json({
                status: "success",
                message: "Updated employee data successfully",
                data: employee,
            });
        } catch (err) {
            if (err instanceof AppError) {
                return res.status(err.code).json({
                    status: "error",
                    message: err.message,
                });
            }
            return res.status(500).json({
                status: "error",
                message: "Something went wrong",
            });
        }
    };

    public destroy = async (req: Request, res: Response): Promise<Response> => {
        try {
            await this.employeeService.deleteEmployee(
                req.user as jwtPayload,
                req.params.id as string,
            );
            return res.status(200).json({
                status: "success",
                message: "Deleted employee data successfully",
            });
        } catch (err) {
            if (err instanceof AppError) {
                return res.status(err.code).json({
                    status: "error",
                    message: err.message,
                });
            }
            return res.status(500).json({});
        }
    };
}
