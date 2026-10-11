import { Role, LeaveStatus } from '../src/generated/prisma/index.js';
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from "url";
import { PrismaClient } from "../src/generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);
dotenv.config({
    path: path.join(__dirName, "..", '.env'),
});
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
    adapter,
});
async function main() {
    console.log('🧹 Membersihkan data lama...');
    // urutan penting: hapus dari tabel yang paling bergantung dulu
    await prisma.leaveRequest.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.user.deleteMany();
    console.log('🌱 Membuat data baru...');
    const password = await bcrypt.hash('password123', 12);
    // ─── Admin & HR ───
    const admin = await prisma.user.create({
        data: {
            email: 'admin@hris.com',
            password,
            role: Role.ADMIN,
            employee: {
                create: {
                    name: 'Rina Admin',
                    position: 'System Administrator',
                    department: 'IT',
                    joinDate: new Date('2023-01-10'),
                    phone: '081200000001',
                },
            },
        },
    });
    const hr = await prisma.user.create({
        data: {
            email: 'hr@hris.com',
            password,
            role: Role.HR,
            employee: {
                create: {
                    name: 'Dewi HR',
                    position: 'HR Manager',
                    department: 'Human Resources',
                    joinDate: new Date('2022-03-15'),
                    phone: '081200000002',
                },
            },
        },
    });
    // ─── Employees ───
    const employeeData = [
        { email: 'budi@hris.com', name: 'Budi Santoso', position: 'Backend Developer', department: 'Engineering', joinDate: '2023-06-01' },
        { email: 'sari@hris.com', name: 'Sari Wulandari', position: 'Frontend Developer', department: 'Engineering', joinDate: '2023-07-15' },
        { email: 'andi@hris.com', name: 'Andi Pratama', position: 'UI/UX Designer', department: 'Product', joinDate: '2024-01-20' },
        { email: 'maya@hris.com', name: 'Maya Putri', position: 'Marketing Specialist', department: 'Marketing', joinDate: '2024-02-10' },
        { email: 'rian@hris.com', name: 'Rian Firmansyah', position: 'QA Engineer', department: 'Engineering', joinDate: '2024-05-05' },
    ];
    const employees = [];
    for (const emp of employeeData) {
        const user = await prisma.user.create({
            data: {
                email: emp.email,
                password,
                role: Role.EMPLOYEE,
                employee: {
                    create: {
                        name: emp.name,
                        position: emp.position,
                        department: emp.department,
                        joinDate: new Date(emp.joinDate),
                        phone: `08130000000${employeeData.indexOf(emp) + 1}`,
                    },
                },
            },
            include: { employee: true },
        });
        employees.push(user.employee);
    }
    const [emp0, emp1, emp2, emp3] = employees;
    if (!emp0 || !emp1 || !emp2 || !emp3) {
        throw new Error('Jumlah employee yang di-seed tidak sesuai ekspektasi');
    }
    // ─── Leave Requests ───
    const adminUser = await prisma.user.findUnique({ where: { email: 'admin@hris.com' } });
    await prisma.leaveRequest.createMany({
        data: [
            {
                employeeId: emp0.id,
                startDate: new Date('2026-09-01'),
                endDate: new Date('2026-09-03'),
                reason: 'Acara keluarga',
                status: LeaveStatus.PENDING,
            },
            {
                employeeId: emp1.id,
                startDate: new Date('2026-08-20'),
                endDate: new Date('2026-08-21'),
                reason: 'Sakit demam',
                status: LeaveStatus.APPROVED,
                reviewedBy: adminUser.id,
            },
            {
                employeeId: emp2.id,
                startDate: new Date('2026-08-10'),
                endDate: new Date('2026-08-15'),
                reason: 'Liburan tahunan',
                status: LeaveStatus.REJECTED,
                reviewedBy: adminUser.id,
            },
            {
                employeeId: emp3.id,
                startDate: new Date('2026-09-10'),
                endDate: new Date('2026-09-10'),
                reason: 'Urusan pribadi',
                status: LeaveStatus.PENDING,
            },
            {
                employeeId: emp1.id,
                startDate: new Date('2026-07-01'),
                endDate: new Date('2026-07-02'),
                reason: 'Menikah saudara',
                status: LeaveStatus.APPROVED,
                reviewedBy: adminUser.id,
            },
        ],
    });
    console.log('✅ Seeding selesai!');
    console.log(`   - 1 Admin (admin@hris.com)`);
    console.log(`   - 1 HR (hr@hris.com)`);
    console.log(`   - ${employees.length} Employee`);
    console.log(`   - 5 Leave Request`);
    console.log(`   - Password untuk semua akun: password123`);
}
main()
    .catch((e) => {
    console.error('❌ Seeding gagal:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seeder.js.map