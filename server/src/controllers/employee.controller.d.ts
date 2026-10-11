import type { Request, Response } from "express";
export default class EmployeeController {
    private employeeService;
    constructor();
    index: (req: Request, res: Response) => Promise<Response>;
    show: (req: Request, res: Response) => Promise<Response>;
    showByUser: (req: Request, res: Response) => Promise<Response>;
    store: (req: Request, res: Response) => Promise<Response>;
    edit: (req: Request, res: Response) => Promise<Response>;
    destroy: (req: Request, res: Response) => Promise<Response>;
}
//# sourceMappingURL=employee.controller.d.ts.map
