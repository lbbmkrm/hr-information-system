import UserService from "../services/user.service.js";
export default class UserController {
    userService;
    constructor() {
        this.userService = new UserService();
    }
    index = async (req, res) => {
        const users = await this.userService.getAllUsers(req.user, req.validatedQuery);
        return res.status(200).json({
            status: "success",
            message: "Data pengguna berhasil dimuat",
            data: users,
        });
    };
    show = async (req, res) => {
        const user = await this.userService.getUserById(req.user, req.params.id);
        return res.status(200).json({
            status: "success",
            message: "Detail pengguna berhasil dimuat",
            data: user,
        });
    };
    store = async (req, res) => {
        const user = await this.userService.addUser(req.user, req.validatedBody);
        return res.status(201).json({
            status: "success",
            message: "Pengguna baru berhasil ditambahkan",
            data: user,
        });
    };
    edit = async (req, res) => {
        const user = await this.userService.updateUser(req.user, req.params.id, req.validatedBody);
        return res.status(200).json({
            status: "success",
            message: "Data pengguna berhasil diperbarui",
            data: user,
        });
    };
    destroy = async (req, res) => {
        await this.userService.deleteUser(req.user, req.params.id);
        return res.status(200).json({
            status: "success",
            message: "Pengguna berhasil dihapus",
        });
    };
}
//# sourceMappingURL=user.controller.js.map