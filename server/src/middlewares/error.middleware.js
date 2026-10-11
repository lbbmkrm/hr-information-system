import AppError from "../utils/AppError.js";
const errorMiddleware = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof AppError) {
        return res.status(err.code).json({
            status: "error",
            message: err.message,
        });
    }
    console.error(err);
    return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
    });
};
export default errorMiddleware;
//# sourceMappingURL=error.middleware.js.map