import type { LucideIcon } from "lucide-react";

type StatCardProps = {
    label: string;
    value?: number | null;
    icon: LucideIcon;
};

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
    return (
        <div className="border-border bg-surface rounded-lg border p-5">
            <div className="flex items-center justify-between">
                <p className="text-text-secondary text-sm">{label}</p>

                <Icon className="text-text-muted size-5" />
            </div>

            <p className="text-text mt-3 text-2xl font-semibold">{value}</p>
        </div>
    );
}
