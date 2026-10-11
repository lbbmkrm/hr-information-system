import z from "zod";
import type { ZodObject } from "zod";
export declare const CreateLeaveRequestSchema: ZodObject;
export declare const UpdateLeaveRequestSchema: ZodObject;
export declare const UpdateStatusLeaveRequestSchema: ZodObject;
export declare const IdParamsSchema: ZodObject<
    {
        id: z.ZodCUID2;
    },
    z.core.$strip
>;
export declare const QueryParamsSchema: ZodObject;
//# sourceMappingURL=leaveRequest.validator.d.ts.map
