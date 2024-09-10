const calculateWorkingHours = (
    startDate,
    endDate,
    workingDaysPerWeek,
    hoursPerDay
  ) => {
    // Convert input dates to JavaScript Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Ensure start date is earlier than end date
    if (end < start) {
      throw new Error("End date must be after start date");
    }

    // Helper function to calculate the difference in days
    const getDayDifference = (start, end) =>
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Find the day of the week for start and end dates (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const startDay = start.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const endDay = end.getDay();

    // Calculate the total number of days between the start and end dates
    const totalDays = getDayDifference(start, end);

    // Calculate the number of full weeks between the start and end dates
    const fullWeeks = Math.floor(totalDays / 7);

    // Calculate the working days in full weeks
    const workingDaysInFullWeeks = fullWeeks * workingDaysPerWeek;

    // Calculate the remaining days that don't form a full week
    const remainingDays = totalDays % 7;

    // Determine how many of the remaining days are working days
    let workingDaysInPartialWeek = 0;

    // If there are remaining days, check if they fall on working days (Monday - Friday)
    for (let i = 0; i < remainingDays; i++) {
      const currentDay = (startDay + i) % 7; // Calculate the day of the week (0 = Sunday, 6 = Saturday)
      if (currentDay > 0 && currentDay <= workingDaysPerWeek) {
        workingDaysInPartialWeek++;
      }
    }

    // Calculate the total number of working days
    const totalWorkingDays =
      workingDaysInFullWeeks + workingDaysInPartialWeek;

    // Calculate the total working hours
    const totalWorkingHours = totalWorkingDays * hoursPerDay;

    return totalWorkingHours;
  };