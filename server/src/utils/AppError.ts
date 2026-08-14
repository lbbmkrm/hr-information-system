export default class AppError extends Error {
    public code: number;
    public message: string;

    constructor(message: string, code: number = 400) {
        super(message);
        this.message = message;
        this.code = code;
    }
}