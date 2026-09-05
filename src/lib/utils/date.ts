import { addDays, format, isAfter, isBefore, startOfDay } from "date-fns";

/** Saturday-anchored week: [start, end) where start is a Saturday 00:00 and end is the next Saturday 00:00. */
export interface ReportWeek {
  start: Date;
  end: Date;
}

/** Returns the Saturday that starts the week containing `date` (Saturday 00:00 through the following Saturday 00:00). */
export function getReportWeek(date: Date = new Date()): ReportWeek {
  const day = startOfDay(date);
  const dow = day.getDay(); // 0=Sun ... 6=Sat
  const daysSinceSaturday = (dow - 6 + 7) % 7;
  const start = addDays(day, -daysSinceSaturday);
  const end = addDays(start, 7);
  return { start, end };
}

export function getPreviousReportWeeks(count: number, from: Date = new Date()): ReportWeek[] {
  const current = getReportWeek(from);
  const weeks: ReportWeek[] = [];
  for (let i = 0; i < count; i++) {
    weeks.push({
      start: addDays(current.start, -7 * i),
      end: addDays(current.end, -7 * i),
    });
  }
  return weeks;
}

export function isWithinWeek(isoDate: string | undefined, week: ReportWeek): boolean {
  if (!isoDate) return false;
  const d = new Date(isoDate);
  return !isBefore(d, week.start) && isBefore(d, week.end);
}

export function formatWeekLabel(week: ReportWeek): string {
  return `${format(week.start, "d MMM yyyy")} — ${format(week.end, "d MMM yyyy")}`;
}

export function formatDate(iso?: string): string {
  if (!iso) return "—";
  return format(new Date(iso), "d MMM yyyy");
}

export function formatDateTime(iso?: string): string {
  if (!iso) return "—";
  return format(new Date(iso), "d MMM yyyy, HH:mm");
}

export function isOverdue(deadline?: string, completedAt?: string): boolean {
  if (!deadline || completedAt) return false;
  return isAfter(new Date(), new Date(deadline));
}

export function daysLate(deadline?: string): number {
  if (!deadline) return 0;
  const ms = Date.now() - new Date(deadline).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function nowIso(): string {
  return new Date().toISOString();
}

/** Local calendar date as yyyy-MM-dd — safe for filenames, unlike toISOString() which shifts to UTC. */
export function formatFileDate(date: Date = new Date()): string {
  return format(date, "yyyy-MM-dd");
}

export function formatDuration(startIso?: string, endIso?: string): string {
  if (!startIso || !endIso) return "—";
  const ms = Math.max(0, new Date(endIso).getTime() - new Date(startIso).getTime());
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (days === 0 && minutes > 0) parts.push(`${minutes}m`);
  return parts.length > 0 ? parts.join(" ") : "< 1m";
}
