import AuthService from "../services/auth.service.js";
import type { Request, Response } from "express";
import type { LoginPayload } from "../types/userTypes.js";

export default class AuthController {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    login = async (req: Request, res: Response): Promise<Response> => {
        const result = await this.authService.login(req.validatedBody as LoginPayload);
        return res.status(200).json({
            status: "success",
            message: "Login Berhasil",
            data: result,
        });
    };
}
