import axios from "axios";

export function getErrorMessage(error: unknown, fallback: string): string {
    if (
        axios.isAxiosError<{ message?: unknown }>(error) &&
        typeof error.response?.data?.message === "string" &&
        error.response.data.message.trim()
    ) {
        return error.response.data.message;
    }

    return fallback;
}
