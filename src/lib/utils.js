// src/lib/utils.js

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date) {
  if (typeof date === 'string') {
    return date.split('T')[0];
  }
  return date.toISOString().split('T')[0];
}

/**
 * Get current date in YYYY-MM-DD format
 */
export function getTodayDate() {
  return formatDate(new Date());
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateString) {
  return new Date(dateString + 'T00:00:00');
}

/**
 * Get month name
 */
export function getMonthName(month) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1];
}

/**
 * Get days in month
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * Get first day of month (0 = Sunday, 1 = Monday, etc.)
 */
export function getFirstDayOfMonth(year, month) {
  return new Date(year, month - 1, 1).getDay();
}

/**
 * Generate calendar grid for a month
 * Returns array of arrays (weeks)
 */
export function generateCalendarGrid(year, month) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const grid = [];
  let week = new Array(7).fill(null);
  let dayCounter = 1;
  
  // Fill first week
  for (let i = firstDay; i < 7; i++) {
    week[i] = dayCounter++;
  }
  grid.push([...week]);
  
  // Fill remaining weeks
  while (dayCounter <= daysInMonth) {
    week = new Array(7).fill(null);
    for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
      week[i] = dayCounter++;
    }
    grid.push([...week]);
  }
  
  return grid;
}

/**
 * Format hours with 1 decimal place
 */
export function formatHours(hours) {
  if (!hours || hours === 0) return '0';
  return hours.toFixed(1).replace(/\.0$/, ''); // Remove .0 if whole number
}

/**
 * Calculate percentage progress
 */
export function calculateProgress(current, goal) {
  if (!goal || goal === 0) return 0;
  return Math.min(Math.round((current / goal) * 100), 100);
}

/**
 * Get current month and year
 */
export function getCurrentMonthYear() {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}

/**
 * Navigate to previous month
 */
export function getPreviousMonth(year, month) {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }
  return { year, month: month - 1 };
}

/**
 * Navigate to next month
 */
export function getNextMonth(year, month) {
  if (month === 12) {
    return { year: year + 1, month: 1 };
  }
  return { year, month: month + 1 };
}

/**
 * Check if a date is today
 */
export function isToday(year, month, day) {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() + 1 === month &&
    today.getDate() === day
  );
}

/**
 * Format date for display
 */
export function formatDisplayDate(year, month, day) {
  const monthName = getMonthName(month);
  return `${monthName} ${day}, ${year}`;
}

/**
 * Get month goal based on annual goal
 */
export function getMonthlyGoal(annualGoal) {
  return Math.round(annualGoal / 12);
}

/**
 * Calculate average hours per day for active days
 */
export function calculateAverageHours(totalHours, daysActive) {
  if (!daysActive || daysActive === 0) return 0;
  return totalHours / daysActive;
}

/**
 * Validate hours input
 */
export function validateHours(hours) {
  const num = parseFloat(hours);
  if (isNaN(num) || num < 0 || num > 24) {
    return { valid: false, error: 'Hours must be between 0 and 24' };
  }
  return { valid: true, value: num };
}

/**
 * Download JSON file
 */
export function downloadJSON(data, filename) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Read JSON file
 */
export function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Class name helper (for conditional classes)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
