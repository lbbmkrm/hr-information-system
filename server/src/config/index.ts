import dotenv from "dotenv";

dotenv.config();
const config = {
    port: process.env.PORT,
    database: process.env.DATABASE_NAME,
    jwtSecret: process.env.JWT_SECRET,
};

export default config;
