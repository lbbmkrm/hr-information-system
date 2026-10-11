import prisma from "../prisma.js";
export async function createEmployee(overrides = {}) {
    return prisma.employee.create({
        data: {
            name: "John Doe",
            position: "Software Engineer",
            department: "IT",
            joinDate: new Date("2025-01-01"),
            phone: "081234567890",
            ...overrides,
        },
    });
}
//# sourceMappingURL=employee.factory.js.map