export function exportToCSV(data: any[], filename: string = 'data.csv') {
  if (!data || !data.length) {
    console.error('No data available to export');
    return;
  }

  // Extract keys (column headers) from the first row of data
  const headers = Object.keys(data[0]);

  // Create the CSV rows by joining headers and data
  const rows = data.map((item) =>
    headers.map((header) => `"${item[header] || ''}"`).join(',')
  );

  // Combine headers and data rows
  const csvContent = [headers.join(','), ...rows].join('\n');

  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create a link to download the CSV file
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);

  // Append the link to the body (required for Firefox)
  document.body.appendChild(link);

  // Trigger the download
  link.click();

  // Remove the link after triggering the download
  document.body.removeChild(link);
}

export const parseCronExpression = (cronExpression: string): any => {
  const parts = cronExpression.split(' ');

  if (parts.length < 6) {
    console.error('Invalid cron expression:', cronExpression);
    return null;
  }
  const startMinute = parseInt(parts[1], 10);
  let adjustedHour = parseInt(parts[2], 10);
  const dayOfMonth = parts[3];
  const month = parts[4];
  const dayOfWeek = parts[5];

  // Determine AM/PM and convert to 12-hour format
  const isPM = adjustedHour >= 12;
  const startHour = isPM ? adjustedHour - 12 : adjustedHour;
  const startAmPm = isPM ? 'PM' : 'AM';
  // Ensure 24-hour format remains consistent
  const time24Hour = `${adjustedHour.toString().padStart(2, '0')}:${startMinute
    .toString()
    .padStart(2, '0')}`;
  const parsedResult: any = {
    startMinute,
    startHour: startHour === 0 ? 12 : startHour, // Adjust for 12 AM edge case
    startAmPm,
    type: '',
    dayOfMonth,
    dayOfWeek,
    time24Hour,
  };
  if (dayOfMonth === '*' && month === '*') {
    parsedResult.type = 'Daily';
  } else if (dayOfMonth !== '?' && month === '*') {
    // Monthly
    parsedResult.type = 'Monthly';
    parsedResult.repeatDayOfMonth = parseInt(dayOfMonth, 10);
  } else if (dayOfWeek !== '?') {
    // Weekly
    parsedResult.type = 'Weekly';
    parsedResult.selectedWeekDay = dayOfWeek;
  } else if (dayOfMonth !== '?' && month !== '*') {
    // Yearly
    parsedResult.type = 'Yearly';
    parsedResult.repeatDayOfMonthyear = parseInt(dayOfMonth, 10);
    parsedResult.repeatMonthYear = parseInt(month, 10);
  } else {
    // Daily
    parsedResult.type = 'Daily';
  }

  return parsedResult;
};
