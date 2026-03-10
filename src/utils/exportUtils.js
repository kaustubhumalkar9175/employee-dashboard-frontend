import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// ── Helper: format employee data for export ──
const formatData = (employees) => {
  return employees.map(emp => ({
    'First Name':   emp.firstName,
    'Last Name':    emp.lastName,
    'Email':        emp.email,
    'Department':   emp.department,
    'Role':         emp.role,
    'Salary':       emp.salary,
    'Join Date':    emp.joinDate,
    'Status':       emp.status,
  }));
};

// ── Export to CSV ──
export const exportToCSV = (employees, filename = 'employees') => {
  const data = formatData(employees);
  const headers = Object.keys(data[0]);

  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h] ?? '';
        // Wrap in quotes if value contains comma
        return String(val).includes(',') ? `"${val}"` : val;
      }).join(',')
    )
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
};

// ── Export to Excel ──
export const exportToExcel = (employees, filename = 'employees') => {
  const data = formatData(employees);

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook  = XLSX.utils.book_new();

  // ✅ Set column widths
  worksheet['!cols'] = [
    { wch: 15 }, // First Name
    { wch: 15 }, // Last Name
    { wch: 28 }, // Email
    { wch: 15 }, // Department
    { wch: 20 }, // Role
    { wch: 12 }, // Salary
    { wch: 12 }, // Join Date
    { wch: 10 }, // Status
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  saveAs(blob, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};