export default class AppError extends Error {
    code;
    message;
    constructor(message, code = 400) {
        super(message);
        this.message = message;
        this.code = code;
    }
}
//# sourceMappingURL=AppError.js.map