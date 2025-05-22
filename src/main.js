/**
 * Google Calendar ↔ Sheets Sync Application
 * Main entry points and orchestration
 */

/**
 * Initial setup function - creates the spreadsheet and sets up triggers
 * Run this once to initialize the sync system
 */
function setupSync() {
  try {
    Logger.log('Starting sync setup...');
    
    // Create or get the sync spreadsheet
    const spreadsheet = SheetsService.createOrGetSyncSheet();
    Logger.log(`Sync sheet ready: ${spreadsheet.getUrl()}`);
    
    // Set up triggers for real-time sync
    setupTriggers();
    
    // Perform initial sync
    performFullSync();
    
    Logger.log('Setup completed successfully!');
    return {
      status: 'success',
      spreadsheetUrl: spreadsheet.getUrl(),
      message: 'Sync system initialized successfully'
    };
    
  } catch (error) {
    Logger.log(`Setup failed: ${error.message}`);
    ErrorHandler.handleError('setupSync', error);
    throw error;
  }
}

/**
 * Performs a full bidirectional sync between Calendar and Sheets
 * Can be called manually or by scheduled triggers
 */
function performFullSync() {
  try {
    Logger.log('Starting full sync...');
    
    const syncResult = SyncEngine.performFullSync();
    
    Logger.log(`Full sync completed: ${JSON.stringify(syncResult)}`);
    return syncResult;
    
  } catch (error) {
    Logger.log(`Full sync failed: ${error.message}`);
    ErrorHandler.handleError('performFullSync', error);
    throw error;
  }
}

/**
 * Handles real-time calendar changes
 * Triggered by Google Calendar change notifications
 */
function onCalendarChange(e) {
  try {
    Logger.log('Calendar change detected');
    
    const syncResult = SyncEngine.syncCalendarToSheets();
    
    Logger.log(`Calendar sync completed: ${JSON.stringify(syncResult)}`);
    return syncResult;
    
  } catch (error) {
    Logger.log(`Calendar sync failed: ${error.message}`);
    ErrorHandler.handleError('onCalendarChange', error);
  }
}

/**
 * Handles real-time sheet changes
 * Triggered by Google Sheets edit events
 */
function onSheetEdit(e) {
  try {
    Logger.log('Sheet edit detected');
    
    // Check if the edit was in our sync range
    if (!SheetsService.isEditInSyncRange(e)) {
      Logger.log('Edit outside sync range, ignoring');
      return;
    }
    
    const syncResult = SyncEngine.syncSheetsToCalendar(e);
    
    Logger.log(`Sheet sync completed: ${JSON.stringify(syncResult)}`);
    return syncResult;
    
  } catch (error) {
    Logger.log(`Sheet sync failed: ${error.message}`);
    ErrorHandler.handleError('onSheetEdit', error);
  }
}

/**
 * Sets up all necessary triggers for real-time sync
 */
function setupTriggers() {
  try {
    // Clear existing triggers to avoid duplicates
    clearAllTriggers();
    
    // Set up time-based trigger for periodic sync (fallback)
    ScriptApp.newTrigger('performFullSync')
      .timeBased()
      .everyMinutes(15)
      .create();
    
    // Set up sheet edit trigger
    const spreadsheet = SheetsService.getSyncSpreadsheet();
    ScriptApp.newTrigger('onSheetEdit')
      .onEdit()
      .create();
    
    Logger.log('Triggers set up successfully');
    
  } catch (error) {
    Logger.log(`Trigger setup failed: ${error.message}`);
    ErrorHandler.handleError('setupTriggers', error);
    throw error;
  }
}

/**
 * Clears all existing triggers (useful for cleanup)
 */
function clearAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
  Logger.log(`Cleared ${triggers.length} existing triggers`);
}

/**
 * Manual sync function for testing and troubleshooting
 */
function manualSync() {
  const result = performFullSync();
  console.log('Manual sync result:', result);
  return result;
}

/**
 * Get sync status and statistics
 */
function getSyncStatus() {
  try {
    const status = SyncEngine.getSyncStatus();
    Logger.log(`Sync status: ${JSON.stringify(status)}`);
    return status;
  } catch (error) {
    Logger.log(`Failed to get sync status: ${error.message}`);
    ErrorHandler.handleError('getSyncStatus', error);
    throw error;
  }
}

/**
 * Reset sync system (useful for troubleshooting)
 * WARNING: This will clear all sync tracking data
 */
function resetSync() {
  try {
    Logger.log('Resetting sync system...');
    
    // Clear triggers
    clearAllTriggers();
    
    // Clear sync tracking data
    SyncEngine.clearSyncData();
    
    // Reinitialize
    setupSync();
    
    Logger.log('Sync system reset completed');
    return { status: 'success', message: 'Sync system reset successfully' };
    
  } catch (error) {
    Logger.log(`Sync reset failed: ${error.message}`);
    ErrorHandler.handleError('resetSync', error);
    throw error;
  }
}
