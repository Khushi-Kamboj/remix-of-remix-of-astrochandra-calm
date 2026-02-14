import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: "Pending",
  },
  confirmed: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    label: "Confirmed",
  },
  completed: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "Completed",
  },
  cancelled: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "Cancelled",
  },
  rejected: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    label: "Rejected",
  },
};

/**
 * StatusBadge: displays booking status with color-coded background
 */
const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        colors.bg,
        colors.text,
        className
      )}
    >
      {colors.label}
    </span>
  );
};

export default StatusBadge;
