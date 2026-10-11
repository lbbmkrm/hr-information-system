import AuthService from "../services/auth.service.js";
export default class AuthController {
    authService;
    constructor() {
        this.authService = new AuthService();
    }
    login = async (req, res) => {
        const result = await this.authService.login(req.validatedBody);
        return res.status(200).json({
            status: "success",
            message: "Login Berhasil",
            data: result,
        });
    };
}
//# sourceMappingURL=auth.controller.js.map