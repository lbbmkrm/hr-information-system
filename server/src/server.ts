import config from "./config/index.js";
import app from "./app.js";

app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`);
});