import express from "express";
import routes from "./routes/index.route.js";
import cors from "cors";
import type { Request, Response } from "express";
import errorMiddleware from "./middlewares/error.middleware.js";
import AppError from "./utils/AppError.js";
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
    res.send("HR information system is running!");
});
app.use("/api", routes);
app.use((req: Request, res: Response) => {
    throw new AppError(`Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`, 404);
});
app.use(errorMiddleware);

export default app;
