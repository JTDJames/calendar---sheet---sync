# Google Calendar ↔ Sheets Sync

A bidirectional synchronization tool that keeps your Google Calendar events in sync with a Google Sheets spreadsheet, enabling enhanced event management and analysis capabilities.

## 🚀 Quick Start

### Prerequisites
- Google account with access to Google Calendar and Google Sheets
- Google Apps Script access
- GitHub account (for Jules AI integration)

### Setup Instructions

#### 1. Clone or Download This Repository
```bash
git clone https://github.com/[your-username]/calendar-sheets-sync.git
```

#### 2. Set Up Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project called "Calendar Sheets Sync"
3. Enable required APIs:
   - Go to "Services" → "Add a service"
   - Add "Google Calendar API v3"
   - Add "Google Sheets API v4"

#### 3. Copy the Code
1. Copy all files from the `src/` directory to your Apps Script project
2. Make sure to maintain the file structure (create separate .gs files for each .js file)

#### 4. Initial Setup
1. Run the `setupSync()` function in the Apps Script editor
2. Grant necessary permissions when prompted
3. Note the spreadsheet URL that gets created

#### 5. Test the Integration
1. Run `manualSync()` to perform your first sync
2. Check that your calendar events appear in the created spreadsheet
3. Try editing an event in the sheet and run sync again

## 📋 Features

### Current Features
- ✅ Bidirectional sync between Google Calendar and Google Sheets
- ✅ Real-time updates with change triggers
- ✅ Last-write-wins conflict resolution
- ✅ Custom "Priority" field (1-5 scale)
- ✅ Support for all-day and timed events
- ✅ Attendee management
- ✅ Comprehensive error handling and logging

### Planned Features
- 🔄 Multi-calendar support
- 🔄 Advanced recurring event handling
- 🔄 Custom notification system
- 🔄 Analytics and reporting
- 🔄 Import/export capabilities

## 🔧 Configuration

The system is configured through the `Config` object in `config.js`. Key settings include:

```javascript
// Sync settings
SYNC: {
  CONFLICT_RESOLUTION: 'LAST_WRITE_WINS',
  SYNC_INTERVAL_MINUTES: 15,
  ENABLE_REAL_TIME: true
}

// Custom fields
CUSTOM_FIELDS: {
  PRIORITY: {
    column: 'L',
    type: 'number',
    min: 1,
    max: 5,
    default: 3
  }
}
```

## 📊 Spreadsheet Structure

The sync creates a spreadsheet with the following columns:

| Column | Field | Description |
|--------|-------|-------------|
| A | Event ID | Unique identifier (auto-generated) |
| B | Title | Event title/summary |
| C | Start Date | Start date (YYYY-MM-DD) |
| D | Start Time | Start time (HH:MM) |
| E | End Date | End date (YYYY-MM-DD) |
| F | End Time | End time (HH:MM) |
| G | All Day | Yes/No indicator |
| H | Description | Event description |
| I | Location | Event location |
| J | Attendees | Comma-separated attendee list |
| K | Recurrence | Recurrence rules |
| L | Priority | Custom priority (1-5) |
| M | Last Modified | Timestamp for conflict resolution |
| N | Sync Status | Current sync status |
| O | Notes | Additional custom notes |

## 🤖 Jules AI Integration

This project is designed to work with Google's Jules AI coding agent:

1. **Push your code to GitHub** after initial setup
2. **Connect Jules** to your repository
3. **Use Jules** to help with:
   - Adding new features
   - Bug fixes and testing
   - Code optimization
   - Documentation updates

Example Jules commands:
- "Add support for multiple calendars"
- "Implement better error recovery for API rate limits"
- "Create unit tests for the sync engine"
- "Add data validation for custom fields"

## 🔍 Troubleshooting

### Common Issues

**Sync not working?**
- Check that all required APIs are enabled
- Verify trigger setup by running `getSyncStatus()`
- Review error logs with `ErrorHandler.getErrorLog()`

**Events not appearing?**
- Ensure you have the correct calendar permissions
- Check the time range settings in Config
- Verify the spreadsheet isn't corrupted

**Permission errors?**
- Re-run the authorization flow
- Check OAuth scopes in `appsscript.json`

### Debug Functions

```javascript
// Get current sync status
getSyncStatus()

// View error logs
ErrorHandler.getErrorLog()

// Perform manual sync
manualSync()

// Reset everything (use with caution)
resetSync()
```

## 📧 Support

- **Issues**: Create an issue on GitHub
- **Features**: Submit a feature request
- **Documentation**: Check the `/docs` folder for detailed guides

## 🔐 Privacy & Security

- Your calendar data never leaves Google's ecosystem
- All processing happens in Google Apps Script
- No third-party servers involved
- You control all permissions and access

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Use Jules AI to help implement your changes
4. Submit a pull request

---

**Ready to get started?** Run `setupSync()` in Google Apps Script and watch your calendar sync come to life! 🎉
