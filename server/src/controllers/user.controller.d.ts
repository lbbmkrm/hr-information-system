import UserService from "../services/user.service.js";
import type { Request, Response } from "express";
export default class UserController {
    userService: UserService;
    constructor();
    index: (req: Request, res: Response) => Promise<Response>;
    show: (req: Request, res: Response) => Promise<Response>;
    store: (req: Request, res: Response) => Promise<Response>;
    edit: (req: Request, res: Response) => Promise<Response>;
    destroy: (req: Request, res: Response) => Promise<Response>;
}
//# sourceMappingURL=user.controller.d.ts.map
