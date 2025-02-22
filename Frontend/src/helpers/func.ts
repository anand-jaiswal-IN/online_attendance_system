function convertTo12Hour(time24: any) {
  let [hours, minutes] = time24.split(":").map(Number);
  let period = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour time to 12-hour format
  hours = hours % 12 || 12;

  return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export default convertTo12Hour;
