import type { Request, Response } from "express";
export default class LeaveRequestController {
    private leaveRequestService;
    constructor();
    index: (req: Request, res: Response) => Promise<Response>;
    show: (req: Request, res: Response) => Promise<Response>;
    showByEmployee: (req: Request, res: Response) => Promise<Response>;
    store: (req: Request, res: Response) => Promise<Response>;
    edit: (req: Request, res: Response) => Promise<Response>;
    editStatus: (req: Request, res: Response) => Promise<Response>;
    destroy: (req: Request, res: Response) => Promise<Response>;
}
//# sourceMappingURL=leaveRequest.controller.d.ts.map
