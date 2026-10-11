import type { Status } from "../../types/leaveRequest.ts";

type StatusBadgeProps = {
    status: Status;
};

const statusConfig = {
    PENDING: {
        label: "Pending",
        className: "bg-pending-bg text-pending-text",
    },

    APPROVED: {
        label: "Approved",
        className: "bg-approved-bg text-approved-text",
    },

    REJECTED: {
        label: "Rejected",
        className: "bg-rejected-bg text-rejected-text",
    },
} satisfies Record<
    Status,
    {
        label: string;
        className: string;
    }
>;

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${config.className}`}>
            {config.label}
        </span>
    );
}
