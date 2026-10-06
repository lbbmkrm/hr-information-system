interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
    onCancel?: () => void;
}

export function ErrorState({ message, onRetry, onCancel }: ErrorStateProps) {
    if (!message) {
        return null;
    }

    return (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
            <p>{message}</p>
            <div className="mt-2 flex gap-2">
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="rounded bg-slate-600 px-3 py-1 text-sm text-white hover:bg-slate-700"
                    >
                        Kembali
                    </button>
                )}
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                    >
                        Coba Lagi
                    </button>
                )}
            </div>
        </div>
    );
}
