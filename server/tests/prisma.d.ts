import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/index.js";
declare const prisma: PrismaClient<
    {
        adapter: PrismaPg;
    },
    never,
    import("../src/generated/prisma/runtime/client.js").DefaultArgs
>;
export default prisma;
//# sourceMappingURL=prisma.d.ts.map
