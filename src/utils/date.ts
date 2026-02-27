export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function previousDay(dateKey: string): string {
  const date = new Date(dateKey + 'T00:00:00');
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function daysBetween(dateKey1: string, dateKey2: string): number {
  const d1 = new Date(dateKey1 + 'T00:00:00');
  const d2 = new Date(dateKey2 + 'T00:00:00');
  return Math.abs(Math.round((d1.getTime() - d2.getTime()) / 86400000));
}
