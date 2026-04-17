/**
 * Format a number string with thousand separators (e.g., "12000" -> "12,000")
 */
export function formatNumberWithCommas(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  parts[0] = (parts[0] ?? "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0];
}

/**
 * Parse a formatted number string back to raw digits (e.g., "12,000" -> "12000")
 */
export function parseFormattedNumber(value: string): string {
  return value.replace(/,/g, "");
}

/**
 * Handle price input change - formats display value while keeping raw value for storage
 */
export function handlePriceInput(
  value: string,
  onChange: (rawValue: string) => void,
): void {
  const rawValue = parseFormattedNumber(value);
  if (/^\d*\.?\d*$/.test(rawValue)) {
    onChange(rawValue);
  }
}

/**
 * Format a numeric amount as currency
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Relative time display (e.g., "2 hours ago", "3 days ago")
 */
export function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(months / 12);
  return `${years}y ago`;
}
