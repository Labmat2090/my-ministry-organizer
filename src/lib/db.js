// src/lib/db.js
import Dexie from 'dexie';

// Initialize Dexie database
export const db = new Dexie('ministryOrganizerDB');

// Define database schema
db.version(1).stores({
  // User profile and settings
  profiles: 'id, pioneerType, annualGoal',
  
  // Daily time entries
  timeEntries: 'id, entryDate, userId, hours, bibleStudies, returnVisits',
  
  // Bible studies detailed tracking (optional feature)
  bibleStudies: 'id, userId, studentName, isActive, startDate',
  
  // Return visits detailed tracking (optional feature)
  returnVisits: 'id, userId, contactName, isActive, nextVisitDate',
  
  // Monthly goals (optional custom targets)
  monthlyGoals: 'id, userId, year, month, hoursGoal',
});

// ============================================
// PROFILE FUNCTIONS
// ============================================

/**
 * Get or create default profile
 */
export async function getProfile() {
  const profiles = await db.profiles.toArray();
  
  if (profiles.length === 0) {
    // Create default profile
    const defaultProfile = {
      id: 'default',
      pioneerType: 'regular', // regular, auxiliary, special
      annualGoal: 600,
      createdAt: new Date().toISOString(),
    };
    await db.profiles.add(defaultProfile);
    return defaultProfile;
  }
  
  return profiles[0];
}

/**
 * Update profile settings
 */
export async function updateProfile(updates) {
  const profile = await getProfile();
  await db.profiles.update(profile.id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  return await getProfile();
}

// ============================================
// TIME ENTRY FUNCTIONS
// ============================================

/**
 * Add or update time entry for a specific date
 */
export async function saveTimeEntry(entryDate, data) {
  const { hours = 0, bibleStudies = 0, returnVisits = 0, notes = '' } = data;
  
  // Check if entry exists for this date
  const existing = await db.timeEntries
    .where('entryDate')
    .equals(entryDate)
    .first();
  
  if (existing) {
    // Update existing entry
    await db.timeEntries.update(existing.id, {
      hours: parseFloat(hours),
      bibleStudies: parseInt(bibleStudies),
      returnVisits: parseInt(returnVisits),
      notes,
      updatedAt: new Date().toISOString(),
    });
    return await db.timeEntries.get(existing.id);
  } else {
    // Create new entry
    const newEntry = {
      id: crypto.randomUUID(),
      entryDate,
      userId: 'default',
      hours: parseFloat(hours),
      bibleStudies: parseInt(bibleStudies),
      returnVisits: parseInt(returnVisits),
      notes,
      createdAt: new Date().toISOString(),
    };
    await db.timeEntries.add(newEntry);
    return newEntry;
  }
}

/**
 * Get time entry for specific date
 */
export async function getTimeEntry(entryDate) {
  return await db.timeEntries
    .where('entryDate')
    .equals(entryDate)
    .first();
}

/**
 * Get all time entries for a specific month
 */
export async function getMonthEntries(year, month) {
  // Create date range for the month
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];
  
  return await db.timeEntries
    .where('entryDate')
    .between(startDate, endDate, true, true)
    .toArray();
}

/**
 * Get all time entries for a specific year
 */
export async function getYearEntries(year) {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  
  return await db.timeEntries
    .where('entryDate')
    .between(startDate, endDate, true, true)
    .toArray();
}

/**
 * Delete time entry
 */
export async function deleteTimeEntry(entryDate) {
  const entry = await getTimeEntry(entryDate);
  if (entry) {
    await db.timeEntries.delete(entry.id);
  }
}

// ============================================
// CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate monthly summary
 */
export async function getMonthSummary(year, month) {
  const entries = await getMonthEntries(year, month);
  
  return {
    totalHours: entries.reduce((sum, e) => sum + e.hours, 0),
    totalBibleStudies: entries.reduce((sum, e) => sum + e.bibleStudies, 0),
    totalReturnVisits: entries.reduce((sum, e) => sum + e.returnVisits, 0),
    daysActive: entries.filter(e => e.hours > 0).length,
    entries: entries.length,
  };
}

/**
 * Calculate annual summary
 */
export async function getAnnualSummary(year) {
  const entries = await getYearEntries(year);
  
  return {
    totalHours: entries.reduce((sum, e) => sum + e.hours, 0),
    totalBibleStudies: entries.reduce((sum, e) => sum + e.bibleStudies, 0),
    totalReturnVisits: entries.reduce((sum, e) => sum + e.returnVisits, 0),
    daysActive: entries.filter(e => e.hours > 0).length,
    averageHoursPerMonth: entries.reduce((sum, e) => sum + e.hours, 0) / 12,
  };
}

// ============================================
// BIBLE STUDIES FUNCTIONS (Optional Feature)
// ============================================

/**
 * Add new bible study
 */
export async function addBibleStudy(data) {
  const study = {
    id: crypto.randomUUID(),
    userId: 'default',
    studentName: data.studentName,
    contactInfo: data.contactInfo || '',
    publicationUsed: data.publicationUsed || '',
    startDate: data.startDate || new Date().toISOString().split('T')[0],
    isActive: true,
    notes: data.notes || '',
    createdAt: new Date().toISOString(),
  };
  
  await db.bibleStudies.add(study);
  return study;
}

/**
 * Get all active bible studies
 */
export async function getActiveBibleStudies() {
  return await db.bibleStudies
    .where('isActive')
    .equals(1)
    .toArray();
}

/**
 * Update bible study
 */
export async function updateBibleStudy(id, updates) {
  await db.bibleStudies.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Mark bible study as inactive
 */
export async function deactivateBibleStudy(id) {
  await db.bibleStudies.update(id, {
    isActive: false,
    endDate: new Date().toISOString().split('T')[0],
  });
}

// ============================================
// RETURN VISITS FUNCTIONS (Optional Feature)
// ============================================

/**
 * Add new return visit
 */
export async function addReturnVisit(data) {
  const rv = {
    id: crypto.randomUUID(),
    userId: 'default',
    contactName: data.contactName,
    address: data.address || '',
    phone: data.phone || '',
    bestTimeToVisit: data.bestTimeToVisit || '',
    lastVisitDate: data.lastVisitDate || new Date().toISOString().split('T')[0],
    nextVisitDate: data.nextVisitDate || null,
    notes: data.notes || '',
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  
  await db.returnVisits.add(rv);
  return rv;
}

/**
 * Get all active return visits
 */
export async function getActiveReturnVisits() {
  return await db.returnVisits
    .where('isActive')
    .equals(1)
    .toArray();
}

/**
 * Update return visit
 */
export async function updateReturnVisit(id, updates) {
  await db.returnVisits.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

// ============================================
// EXPORT / IMPORT FUNCTIONS
// ============================================

/**
 * Export all data as JSON
 */
export async function exportData() {
  const profile = await getProfile();
  const timeEntries = await db.timeEntries.toArray();
  const bibleStudies = await db.bibleStudies.toArray();
  const returnVisits = await db.returnVisits.toArray();
  const monthlyGoals = await db.monthlyGoals.toArray();
  
  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    profile,
    timeEntries,
    bibleStudies,
    returnVisits,
    monthlyGoals,
  };
}

/**
 * Import data from JSON
 */
export async function importData(data) {
  try {
    // Validate data structure
    if (!data.version || !data.profile) {
      throw new Error('Invalid data format');
    }
    
    // Clear existing data (optional - you might want to merge instead)
    await db.profiles.clear();
    await db.timeEntries.clear();
    await db.bibleStudies.clear();
    await db.returnVisits.clear();
    await db.monthlyGoals.clear();
    
    // Import profile
    if (data.profile) {
      await db.profiles.add(data.profile);
    }
    
    // Import time entries
    if (data.timeEntries && data.timeEntries.length > 0) {
      await db.timeEntries.bulkAdd(data.timeEntries);
    }
    
    // Import bible studies
    if (data.bibleStudies && data.bibleStudies.length > 0) {
      await db.bibleStudies.bulkAdd(data.bibleStudies);
    }
    
    // Import return visits
    if (data.returnVisits && data.returnVisits.length > 0) {
      await db.returnVisits.bulkAdd(data.returnVisits);
    }
    
    // Import monthly goals
    if (data.monthlyGoals && data.monthlyGoals.length > 0) {
      await db.monthlyGoals.bulkAdd(data.monthlyGoals);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Import error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Clear all data (use with caution!)
 */
export async function clearAllData() {
  await db.delete();
  // Recreate database
  location.reload();
}

export default db;
