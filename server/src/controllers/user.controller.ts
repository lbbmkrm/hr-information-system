import UserService from "../services/user.service.js";
import type { Request, Response } from "express";
import type { jwtPayload } from "../lib/jwt.js";
import type { CreateUserData, GetUsersFilter, UpdateUserData } from "../types/userTypes.js";
import AppError from "../utils/AppError.js";

export default class UserController {
    userService: UserService;
    constructor() {
        this.userService = new UserService();
    }

    public index = async (req: Request, res: Response): Promise<Response> => {
        try {
            const users = await this.userService.getAllUsers(
                req.user as jwtPayload,
                req.validatedQuery as GetUsersFilter,
            );

            return res.status(200).json({
                status: "success",
                message: "Retrieved users data successfully",
                data: users,
            });
        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.code).json({
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
            const user = await this.userService.getUserById(
                req.user as jwtPayload,
                req.params.id as string,
            );
            return res.status(200).json({
                status: "success",
                message: "retrieved user data successfully",
                data: user,
            });
        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.code).json({
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
            const user = await this.userService.addUser(
                req.user as jwtPayload,
                req.validatedBody as CreateUserData,
            );
            return res.status(201).json({
                status: "success",
                message: "Success create user",
                data: user,
            });
        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.code).json({
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
            const user = await this.userService.updateUser(
                req.user as jwtPayload,
                req.params.id as string,
                req.validatedBody as UpdateUserData,
            );
            return res.status(200).json({
                status: "success",
                message: "Success edited user",
                data: user,
            });
        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.code).json({
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
            await this.userService.deleteUser(req.user as jwtPayload, req.params.id as string);
            return res.status(200).json({
                status: "success",
                message: "Success deleted user",
            });
        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.code).json({
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
}
