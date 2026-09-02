import { execSync } from "node:child_process";

export default function globalSetup() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error(
            "DATABASE_URL is not defined."
        );
    }

    if (!databaseUrl.includes("hris_test")) {
        throw new Error(
            `Refusing to reset database: ${databaseUrl}`
        );
    }

    execSync(
        "npx prisma migrate reset --force",
        {
            stdio: "inherit",
        }
    );
}