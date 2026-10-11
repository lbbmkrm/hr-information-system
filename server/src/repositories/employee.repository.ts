import prisma from "../lib/prisma.js";
import type { Employee } from "@prisma/client";
import type {
    CreateEmployeeData,
    EmployeeFilter,
    UpdateEmployeeData,
} from "../types/employeeTypes.js";

export default class EmployeeRepository {
    async create(data: CreateEmployeeData): Promise<Employee> {
        return prisma.employee.create({
            data: data,
        });
    }

    async findAll(filter: EmployeeFilter): Promise<Employee[]> {
        if (!filter) {
            return prisma.employee.findMany();
        }
        return prisma.employee.findMany({
            where: filter,
        });
    }

    async findById(id: string): Promise<Employee | null> {
        return prisma.employee.findUnique({
            where: {
                id: id,
            },
        });
    }

    async findByUserId(userId: string): Promise<Employee | null> {
        return prisma.employee.findUnique({
            where: {
                userId: userId,
            },
        });
    }

    async update(id: string, data: UpdateEmployeeData): Promise<Employee> {
        return prisma.employee.update({
            where: {
                id: id,
            },
            data: data,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.employee.delete({
            where: {
                id: id,
            },
        });
    }
}
