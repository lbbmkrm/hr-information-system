import AppError from "./AppError.js";

const dateValidator = async (startDate: Date, endDate: Date) => {
    if (startDate >= endDate || endDate <= startDate) {
        throw new AppError("End date must greater than start date", 400);
    }
    return;
};

export default dateValidator;
