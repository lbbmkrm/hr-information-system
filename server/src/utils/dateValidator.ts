import AppError from "./AppError.js";

const dateValidator = (startDate: Date | string, endDate: Date | string): void => {
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new AppError("Format tanggal tidak valid", 400);
    }

    if (end < start) {
        throw new AppError("Tanggal selesai tidak boleh sebelum tanggal mulai", 400);
    }
};

export default dateValidator;
