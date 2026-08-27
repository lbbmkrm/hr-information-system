import AuthService from "../services/auth.service.js";
import type { Request, Response } from "express";
import AppError from "../utils/AppError.js";
import type { RegisterUserData, LoginPayload } from "../types/userTypes.js";

export default class AuthController {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    register = async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = await this.authService.register(req.validatedBody as RegisterUserData);

            return res.status(201).json({
                status: "success",
                message: "User registered successfully",
                data: result,
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
                message: "Internal Server Error",
            });
        }
    };

    login = async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = await this.authService.login(req.validatedBody as LoginPayload);
            return res.status(200).json({
                status: "success",
                message: "User login successfull",
                data: result,
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
                message: "Internal Server Error",
            });
        }
    };
}
