/**
 * Google Apps Script for Website Tracking Data
 *
 * This script handles tracking data from the MyMood Button website
 * and saves it to separate Google Sheets for analytics.
 *
 * Setup Instructions:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this code
 * 4. Deploy as a web app with "Execute as: Me" and "Who has access: Anyone"
 * 5. Use the same deployment URL as your order webhook (it handles both)
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Check if this is tracking data or order data
    if (data.type === "tracking_batch") {
      return handleTrackingData(data);
    } else {
      // Handle order data (existing functionality)
      return handleOrderData(data);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: error.toString(),
        timestamp: new Date().toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleTrackingData(data) {
  console.log("Received tracking data:", data);

  // Process events
  if (data.events && data.events.length > 0) {
    const eventsSheet = getOrCreateTrackingSheet("Events");
    addEventsToSheet(eventsSheet, data.events);
  }

  // Process session data
  if (data.session) {
    const sessionsSheet = getOrCreateTrackingSheet("Sessions");
    addSessionToSheet(sessionsSheet, data.session);
  }

  return ContentService.createTextOutput(
    JSON.stringify({
      status: "success",
      message: "Tracking data saved successfully",
      eventsProcessed: data.events?.length || 0,
      timestamp: new Date().toISOString(),
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}

function handleOrderData(data) {
  // This is your existing order handling code
  const sheet = getOrCreateSheet();

  if (sheet.getLastRow() === 0) {
    addHeaders(sheet);
  }

  addOrderToSheet(sheet, data);

  return ContentService.createTextOutput(
    JSON.stringify({
      status: "success",
      message: "Order saved successfully",
      orderId: data.orderId,
      timestamp: new Date().toISOString(),
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateTrackingSheet(sheetName) {
  const spreadsheetName = "MyMood Button Analytics";

  let spreadsheet;
  const files = DriveApp.getFilesByName(spreadsheetName);

  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.open(files.next());
  } else {
    spreadsheet = SpreadsheetApp.create(spreadsheetName);
  }

  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  return sheet;
}

function addEventsToSheet(sheet, events) {
  // Add headers if this is the first time
  if (sheet.getLastRow() === 0) {
    addEventsHeaders(sheet);
  }

  // Add each event as a row
  events.forEach((event) => {
    const row = [
      // Basic event info
      event.timestamp || new Date().toISOString(),
      event.sessionId || "",
      event.userId || "",
      event.eventType || "",
      event.page || "",
      event.element || "",
      event.elementText || "",
      event.value || "",

      // Metadata (flattened)
      event.metadata?.pageTitle || "",
      event.metadata?.url || "",
      event.metadata?.referrer || "",
      event.metadata?.userAgent || "",
      event.metadata?.deviceType || "",
      event.metadata?.screenResolution || "",
      event.metadata?.language || "",
      event.metadata?.timezone || "",
      event.metadata?.elementTag || "",
      event.metadata?.elementId || "",
      event.metadata?.elementClass || "",
      event.metadata?.href || "",
      event.metadata?.inputType || "",
      event.metadata?.position ? JSON.stringify(event.metadata.position) : "",

      // Additional metadata as JSON
      JSON.stringify(event.metadata || {}),
    ];

    sheet.appendRow(row);
  });

  // Auto-resize columns
  sheet.autoResizeColumns(1, 25);
}

function addSessionToSheet(sheet, session) {
  // Add headers if this is the first time
  if (sheet.getLastRow() === 0) {
    addSessionsHeaders(sheet);
  }

  // Check if session already exists (update if so)
  const existingRow = findSessionRow(sheet, session.sessionId);

  const row = [
    session.sessionId || "",
    session.userId || "",
    session.startTime || "",
    session.endTime || "",
    session.totalPages || 0,
    session.totalClicks || 0,
    session.totalTimeSpent || 0,
    session.userAgent || "",
    session.language || "",
    session.timezone || "",
    session.referrer || "",
    session.deviceType || "",
    session.screenResolution || "",
    new Date().toISOString(), // Last updated
  ];

  if (existingRow > 0) {
    // Update existing session
    sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
  } else {
    // Add new session
    sheet.appendRow(row);
  }

  // Auto-resize columns
  sheet.autoResizeColumns(1, row.length);
}

function findSessionRow(sheet, sessionId) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    // Start from 1 to skip header
    if (data[i][0] === sessionId) {
      return i + 1; // Return 1-based row number
    }
  }
  return 0; // Not found
}

function addEventsHeaders(sheet) {
  const headers = [
    // Basic event info
    "Timestamp",
    "Session ID",
    "User ID",
    "Event Type",
    "Page",
    "Element",
    "Element Text",
    "Value",

    // Common metadata
    "Page Title",
    "URL",
    "Referrer",
    "User Agent",
    "Device Type",
    "Screen Resolution",
    "Language",
    "Timezone",
    "Element Tag",
    "Element ID",
    "Element Class",
    "Link Href",
    "Input Type",
    "Click Position",

    // Full metadata JSON
    "Full Metadata",
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setBackground("#4285f4");
  sheet.getRange(1, 1, 1, headers.length).setFontColor("white");
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
}

function addSessionsHeaders(sheet) {
  const headers = [
    "Session ID",
    "User ID",
    "Start Time",
    "End Time",
    "Total Pages",
    "Total Clicks",
    "Total Time Spent (seconds)",
    "User Agent",
    "Language",
    "Timezone",
    "Referrer",
    "Device Type",
    "Screen Resolution",
    "Last Updated",
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setBackground("#34a853");
  sheet.getRange(1, 1, 1, headers.length).setFontColor("white");
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
}

// Your existing order handling functions (keep these unchanged)
function getOrCreateSheet() {
  const spreadsheetName = "MyMood Button Orders";
  const sheetName = "Orders";

  let spreadsheet;
  const files = DriveApp.getFilesByName(spreadsheetName);

  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.open(files.next());
  } else {
    spreadsheet = SpreadsheetApp.create(spreadsheetName);
  }

  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  return sheet;
}

function addHeaders(sheet) {
  // Your existing order headers - keep unchanged
  const headers = [
    "Order ID",
    "Order Number",
    "Total Price",
    "Date",
    "Status",
    "Timestamp",
    "Purpose",
    "Purpose Description",
    "Custom Purpose",
    "Shape",
    "Shape ID",
    "Color",
    "Is Custom Color",
    "Finish",
    "Finish Price",
    "Label",
    "Icon",
    "Icon Alignment",
    "Icon Position",
    "Icon Size",
    "Label Position",
    "Label Size",
    "Has Uploaded Image",
    "Uploaded Image Info",
    "Light Mode",
    "Light Mode Price",
    "Brightness",
    "WiFi Enabled",
    "WiFi Features",
    "Schedule",
    "Quantity",
    "Base Price",
    "Customer Email",
    "Customer Name",
    "Customer Phone",
    "Customer Address",
    "User Agent",
    "Timezone",
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setBackground("#4285f4");
  sheet.getRange(1, 1, 1, headers.length).setFontColor("white");
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
}

function addOrderToSheet(sheet, data) {
  // Your existing order row logic - keep unchanged
  const row = [
    data.orderId || "",
    data.orderNumber || "",
    data.totalPrice || 0,
    data.date || "",
    data.status || "",
    data.timestamp || new Date().toISOString(),
    data.purpose || "",
    data.purposeDescription || "",
    data.customPurpose || "",
    data.shape || "",
    data.shapeId || "",
    data.color || "",
    data.isCustomColor || false,
    data.finish || "",
    data.finishPrice || 0,
    data.label || "",
    data.icon || "",
    data.iconAlignment || "",
    data.iconPosition || "",
    data.iconSize || 0,
    data.labelPosition || "",
    data.labelSize || 0,
    data.hasUploadedImage || false,
    data.uploadedImageInfo || "",
    data.lightMode || "",
    data.lightModePrice || 0,
    data.brightness || 0,
    data.wifiEnabled || false,
    data.wifiFeatures || "",
    data.schedule || "",
    data.quantity || 1,
    data.basePrice || 149,
    data.customerEmail || "",
    data.customerName || "",
    data.customerPhone || "",
    data.customerAddress || "",
    data.userAgent || "",
    data.timezone || "",
  ];

  sheet.appendRow(row);
  sheet.autoResizeColumns(1, row.length);
}

// Test function for tracking
function testTrackingWebhook() {
  const testData = {
    type: "tracking_batch",
    sessionId: "test-session-" + Date.now(),
    userId: "test-user-123",
    events: [
      {
        timestamp: new Date().toISOString(),
        eventType: "page_view",
        page: "/test",
        metadata: {
          pageTitle: "Test Page",
          url: "https://example.com/test",
          deviceType: "desktop",
        },
      },
      {
        timestamp: new Date().toISOString(),
        eventType: "click",
        page: "/test",
        element: "button#test",
        elementText: "Test Button",
        metadata: {
          elementTag: "button",
          elementId: "test",
        },
      },
    ],
    session: {
      sessionId: "test-session-" + Date.now(),
      userId: "test-user-123",
      startTime: new Date().toISOString(),
      totalPages: 1,
      totalClicks: 1,
      totalTimeSpent: 30,
      userAgent: "Test Browser",
      deviceType: "desktop",
    },
  };

  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData),
    },
  };

  const result = doPost(mockEvent);
  console.log("Test tracking result:", result.getContent());
}
