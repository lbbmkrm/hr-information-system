import express from "express"
import routes from "./routes/index.route.js"
import type {Request, Response} from "express";
const app = express();

app.use(express.json());
app.get("/", (req: Request, res: Response) => {
    res.send("HR information system is running!");
});
app.use('/api', routes)

export default app;