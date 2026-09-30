import UserService from "../services/user.service.js";
import type { Request, Response } from "express";
import type { jwtPayload } from "../lib/jwt.js";
import type { CreateUserData, GetUsersFilter, UpdateUserData } from "../types/userTypes.js";

export default class UserController {
    userService: UserService;
    constructor() {
        this.userService = new UserService();
    }

    public index = async (req: Request, res: Response): Promise<Response> => {
        const users = await this.userService.getAllUsers(
            req.user as jwtPayload,
            req.validatedQuery as GetUsersFilter,
        );

        return res.status(200).json({
            status: "success",
            message: "Data pengguna berhasil dimuat",
            data: users,
        });
    };

    public show = async (req: Request, res: Response): Promise<Response> => {
        const user = await this.userService.getUserById(
            req.user as jwtPayload,
            req.params.id as string,
        );
        return res.status(200).json({
            status: "success",
            message: "Detail pengguna berhasil dimuat",
            data: user,
        });
    };

    public store = async (req: Request, res: Response): Promise<Response> => {
        const user = await this.userService.addUser(
            req.user as jwtPayload,
            req.validatedBody as CreateUserData,
        );
        return res.status(201).json({
            status: "success",
            message: "Pengguna baru berhasil ditambahkan",
            data: user,
        });
    };

    public edit = async (req: Request, res: Response): Promise<Response> => {
        const user = await this.userService.updateUser(
            req.user as jwtPayload,
            req.params.id as string,
            req.validatedBody as UpdateUserData,
        );
        return res.status(200).json({
            status: "success",
            message: "Data pengguna berhasil diperbarui",
            data: user,
        });
    };

    public destroy = async (req: Request, res: Response): Promise<Response> => {
        await this.userService.deleteUser(req.user as jwtPayload, req.params.id as string);
        return res.status(200).json({
            status: "success",
            message: "Pengguna berhasil dihapus",
        });
    };
}
