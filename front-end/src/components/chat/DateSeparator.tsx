import "./DateSeparator.css";

interface DateSeparatorProps {
  date: string;
}

export function DateSeparator({ date }: DateSeparatorProps) {
  const formatted = formatDateLabel(date);
  return (
    <div className="date-separator">
      <span className="date-separator__text">{formatted}</span>
    </div>
  );
}

function formatDateLabel(dateStr: string): string {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}