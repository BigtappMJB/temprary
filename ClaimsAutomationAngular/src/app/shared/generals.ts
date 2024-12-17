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
