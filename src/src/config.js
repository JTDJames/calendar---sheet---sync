/**
 * Configuration Management
 * Centralized configuration for the sync system
 */

const Config = {
  
  // Application settings
  APP: {
    NAME: 'Calendar-Sheets Sync',
    VERSION: '1.0.0',
    AUTHOR: 'Calendar Sync App'
  },
  
  // Google Calendar settings
  CALENDAR: {
    PRIMARY_CALENDAR_ID: 'primary',
    TIME_ZONE: 'America/Los_Angeles',
    MAX_EVENTS_PER_REQUEST: 2500,
    LOOK_AHEAD_DAYS: 365, // How far into the future to sync
    LOOK_BACK_DAYS: 30    // How far into the past to sync
  },
  
  // Google Sheets settings
  SHEETS: {
    SPREADSHEET_NAME: 'Calendar Sync Data',
    WORKSHEET_NAME: 'Events',
    HEADER_ROW: 1,
    DATA_START_ROW: 2,
    FREEZE_ROWS: 1,
    AUTO_RESIZE_COLUMNS: true
  },
  
  // Sync settings
  SYNC: {
    BATCH_SIZE: 100,
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 1000,
    CONFLICT_RESOLUTION: 'LAST_WRITE_WINS', // Options: LAST_WRITE_WINS, CALENDAR_WINS, SHEETS_WINS
    SYNC_INTERVAL_MINUTES: 15,
    ENABLE_REAL_TIME: true
  },
  
  // Column mapping for the spreadsheet
  COLUMNS: {
    EVENT_ID: 'A',
    TITLE: 'B', 
    START_DATE: 'C',
    START_TIME: 'D',
    END_DATE: 'E',
    END_TIME: 'F',
    ALL_DAY: 'G',
    DESCRIPTION: 'H',
    LOCATION: 'I',
    ATTENDEES: 'J',
    RECURRENCE: 'K',
    PRIORITY: 'L',        // Custom field
    LAST_MODIFIED: 'M',   // For conflict resolution
    SYNC_STATUS: 'N',     // Tracking sync state
    NOTES: 'O'            // Additional custom field
  },
  
  // Column headers for the spreadsheet
  HEADERS: [
    'Event ID',
    'Title',
    'Start Date', 
    'Start Time',
    'End Date',
    'End Time',
    'All Day',
    'Description',
    'Location',
    'Attendees',
    'Recurrence',
    'Priority',
    'Last Modified',
    'Sync Status',
    'Notes'
  ],
  
  // Custom field definitions
  CUSTOM_FIELDS: {
    PRIORITY: {
      column: 'L',
      name: 'Priority',
      type: 'number',
      min: 1,
      max: 5,
      default: 3,
      validation: 'Must be a number between 1 and 5'
    },
    NOTES: {
      column: 'O',
      name: 'Notes',
      type: 'text',
      maxLength: 500,
      default: '',
      validation: 'Text up to 500 characters'
    }
  },
  
  // Error handling settings
  ERROR: {
    LOG_LEVEL: 'INFO', // Options: DEBUG, INFO, WARN, ERROR
    MAX_LOG_ENTRIES: 1000,
    EMAIL_ON_ERROR: false,
    ERROR_EMAIL: '', // Set this to receive error notifications
    SLACK_WEBHOOK: '' // Optional Slack integration for errors
  },
  
  // Feature flags for future development
  FEATURES: {
    MULTI_CALENDAR: false,
    ADVANCED_RECURRENCE: false,
    ATTENDEE_MANAGEMENT: true,
    CUSTOM_NOTIFICATIONS: false,
    ANALYTICS: false,
    EXPORT_IMPORT: false
  },
  
  /**
   * Get configuration value with dot notation
   * @param {string} path - Configuration path (e.g., 'CALENDAR.PRIMARY_CALENDAR_ID')
   * @param {*} defaultValue - Default value if path not found
   * @returns {*} Configuration value
   */
  get(path, defaultValue = null) {
    try {
      const keys = path.split('.');
      let value = this;
      
      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          return defaultValue;
        }
      }
      
      return value;
    } catch (error) {
      Logger.log(`Config.get error for path '${path}': ${error.message}`);
      return defaultValue;
    }
  },
  
  /**
   * Set configuration value with dot notation
   * @param {string} path - Configuration path
   * @param {*} value - Value to set
   */
  set(path, value) {
    try {
      const keys = path.split('.');
      const lastKey = keys.pop();
      let current = this;
      
      for (const key of keys) {
        if (!(key in current) || typeof current[key] !== 'object') {
          current[key] = {};
        }
        current = current[key];
      }
      
      current[lastKey] = value;
      
    } catch (error) {
      Logger.log(`Config.set error for path '${path}': ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Get user-specific configuration from PropertiesService
   * @param {string} key - Configuration key
   * @param {*} defaultValue - Default value
   * @returns {*} Configuration value
   */
  getUserConfig(key, defaultValue = null) {
    try {
      const userProperties = PropertiesService.getUserProperties();
      const value = userProperties.getProperty(key);
      
      if (value === null) {
        return defaultValue;
      }
      
      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
      
    } catch (error) {
      Logger.log(`Config.getUserConfig error for key '${key}': ${error.message}`);
      return defaultValue;
    }
  },
  
  /**
   * Set user-specific configuration
   * @param {string} key - Configuration key
   * @param {*} value - Value to set
   */
  setUserConfig(key, value) {
    try {
      const userProperties = PropertiesService.getUserProperties();
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      userProperties.setProperty(key, stringValue);
      
    } catch (error) {
      Logger.log(`Config.setUserConfig error for key '${key}': ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Initialize default user configuration
   */
  initializeUserConfig() {
    try {
      // Set default user preferences if they don't exist
      if (this.getUserConfig('SPREADSHEET_ID') === null) {
        Logger.log('Initializing default user configuration...');
        
        // These will be set during setup
        this.setUserConfig('SPREADSHEET_ID', '');
        this.setUserConfig('LAST_SYNC_TIME', new Date().toISOString());
        this.setUserConfig('SYNC_ENABLED', true);
        this.setUserConfig('NOTIFICATION_PREFERENCES', {
          email: false,
          slack: false
        });
        
        Logger.log('Default user configuration initialized');
      }
    } catch (error) {
      Logger.log(`Config.initializeUserConfig error: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Validate configuration settings
   * @returns {Array} Array of validation errors (empty if valid)
   */
  validate() {
    const errors = [];
    
    try {
      // Validate required settings
      if (!this.CALENDAR.PRIMARY_CALENDAR_ID) {
        errors.push('CALENDAR.PRIMARY_CALENDAR_ID is required');
      }
      
      if (!this.SHEETS.SPREADSHEET_NAME) {
        errors.push('SHEETS.SPREADSHEET_NAME is required');
      }
      
      if (this.SYNC.BATCH_SIZE <= 0) {
        errors.push('SYNC.BATCH_SIZE must be greater than 0');
      }
      
      if (this.CALENDAR.LOOK_AHEAD_DAYS <= 0) {
        errors.push('CALENDAR.LOOK_AHEAD_DAYS must be greater than 0');
      }
      
      // Validate custom fields
      for (const [fieldName, fieldConfig] of Object.entries(this.CUSTOM_FIELDS)) {
        if (!fieldConfig.column || !fieldConfig.name) {
          errors.push(`Custom field ${fieldName} missing required properties`);
        }
      }
      
    } catch (error) {
      errors.push(`Configuration validation error: ${error.message}`);
    }
    
    return errors;
  }
};
