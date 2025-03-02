import crypto from "crypto";

export function generatePassword() {
  return crypto.randomBytes(12).toString("hex");
}

export function isWithinTimeRange(startTime: string, endTime: string) {
  const currentTime = new Date();
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const start = new Date();
  start.setHours(startHours, startMinutes, 0);

  const end = new Date();
  end.setHours(endHours, endMinutes, 0);

  return currentTime >= start && currentTime <= end;
}

export function isoStringDateOnly(dateString: string) {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

export function isDateInRange(
  dateString: string,
  startDate: string,
  endDate: string
) {
  // dateString = "2024-07-15", startDate = "2024-07-01", endDate = "2024-07-31"
  const targetDate = new Date(dateString);
  const start = new Date(startDate);
  const end = new Date(endDate);

  return targetDate >= start && targetDate <= end;
}
