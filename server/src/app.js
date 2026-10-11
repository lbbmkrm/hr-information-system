import express from "express";
import routes from "./routes/index.route.js";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";
import AppError from "./utils/AppError.js";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("HR information system is running!");
});
app.get("/api/openapi.json", async (_req, res) => {
    const openApiSpec = await readFile(resolve(process.cwd(), "openapi.json"), "utf8");
    res.type("application/json").send(openApiSpec);
});
app.use("/api", routes);
app.use((req, res) => {
    throw new AppError(`Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`, 404);
});
app.use(errorMiddleware);
export default app;
//# sourceMappingURL=app.js.map