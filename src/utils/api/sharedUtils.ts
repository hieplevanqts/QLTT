/**
 * Shared API Utilities
 */

// Helper to calculate quarter from date
export function calculateQuarter(dateString: string): string {
  try {
    const date = new Date(dateString);
    const month = date.getMonth();
    const quarter = Math.floor(month / 3) + 1;
    const year = date.getFullYear();
    return `Q${quarter}/${year}`;
  } catch {
    return 'Q1/2026';
  }
}
