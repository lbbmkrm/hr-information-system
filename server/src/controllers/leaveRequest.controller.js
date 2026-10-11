import LeaveRequestService from "../services/leaveRequest.service.js";
export default class LeaveRequestController {
    leaveRequestService;
    constructor() {
        this.leaveRequestService = new LeaveRequestService();
    }
    index = async (req, res) => {
        const leaveRequests = await this.leaveRequestService.getAllLeaveRequests(req.user, req.validatedQuery);
        return res.status(200).json({
            status: "success",
            message: "Data pengajuan cuti berhasil dimuat.",
            data: leaveRequests,
        });
    };
    show = async (req, res) => {
        const leaveRequest = await this.leaveRequestService.getLeaveRequest(req.user, req.params.id);
        return res.status(200).json({
            status: "success",
            message: "Detail pengajuan cuti berhasil dimuat.",
            data: leaveRequest,
        });
    };
    showByEmployee = async (req, res) => {
        const leaveRequest = await this.leaveRequestService.getEmployeeLeaveRequest(req.user, req.params.id);
        return res.status(200).json({
            status: "success",
            message: "Detail pengajuan cuti karyawan berhasil dimuat.",
            data: leaveRequest,
        });
    };
    store = async (req, res) => {
        const leaveRequest = await this.leaveRequestService.addLeaveRequest(req.user, req.validatedBody);
        return res.status(201).json({
            status: "success",
            message: "Pengajuan cuti baru berhasil dikirim.",
            data: leaveRequest,
        });
    };
    edit = async (req, res) => {
        const leaveRequest = await this.leaveRequestService.updateLeaveRequest(req.user, req.params.id, req.validatedBody);
        return res.status(200).json({
            status: "success",
            message: "Data pengajuan cuti berhasil diperbarui.",
            data: leaveRequest,
        });
    };
    editStatus = async (req, res) => {
        const data = req.validatedBody;
        data.reviewedBy = req.user?.userId;
        const leaveRequest = await this.leaveRequestService.updateStatusLeaveRequest(req.user, req.params.id, data);
        return res.status(200).json({
            status: "success",
            message: "Status pengajuan cuti berhasil diperbarui.",
            data: leaveRequest,
        });
    };
    destroy = async (req, res) => {
        await this.leaveRequestService.deleteLeaveRequest(req.user, req.params.id);
        return res.status(200).json({
            status: "success",
            message: "Pengajuan cuti berhasil dihapus.",
        });
    };
}
//# sourceMappingURL=leaveRequest.controller.js.map