/**
 * Google Apps Script Webhook Handler
 *
 * This code should be deployed in Google Apps Script to handle
 * order data from the MyMood Button website and save it to Google Sheets,
 * as well as send contact form emails.
 *
 * Setup Instructions:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this code
 * 4. Deploy as a web app with "Execute as: Me" and "Who has access: Anyone"
 * 5. Use the deployment URL in your website
 */

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Log incoming data for debugging
    console.log("Received data:", data);

    // Check if this is a contact form email
    if (data.action === 'sendEmail') {
      return handleContactEmail(data);
    } else {
      // Handle regular order processing
      return handleOrder(data);
    }
  } catch (error) {
    console.error("Error processing request:", error);

    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: error.toString(),
        timestamp: new Date().toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleContactEmail(data) {
  try {
    // Send email using Gmail API
    MailApp.sendEmail({
      to: data.to,
      subject: data.subject,
      htmlBody: data.html,
      replyTo: data.replyTo,
      name: 'MyMood Button Contact Form'
    });

    console.log("Contact email sent successfully");

    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Email sent successfully",
        timestamp: new Date().toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error("Error sending email:", error);
    
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: "Failed to send email: " + error.toString(),
        timestamp: new Date().toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleOrder(data) {
  try {
    // Get or create the Google Sheet
    const sheet = getOrCreateSheet();

    // Add headers if this is the first row
    if (sheet.getLastRow() === 0) {
      addHeaders(sheet);
    }

    // Add the order data to the sheet
    addOrderToSheet(sheet, data);

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Order saved successfully",
        orderId: data.orderId,
        timestamp: new Date().toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Error processing order:", error);

    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: error.toString(),
        timestamp: new Date().toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet() {
  const spreadsheetName = "MyMood Button Orders";
  const sheetName = "Orders";

  // Try to open existing spreadsheet
  let spreadsheet;
  const files = DriveApp.getFilesByName(spreadsheetName);

  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.open(files.next());
  } else {
    // Create new spreadsheet
    spreadsheet = SpreadsheetApp.create(spreadsheetName);
  }

  // Get or create the sheet
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  return sheet;
}

function addHeaders(sheet) {
  const headers = [
    // Order Information
    "Order ID",
    "Order Number",
    "Total Price",
    "Date",
    "Status",
    "Timestamp",

    // Button Configuration
    "Purpose",
    "Purpose Description",
    "Custom Purpose",

    // Shape & Style
    "Shape",
    "Shape ID",
    "Color",
    "Is Custom Color",
    "Finish",
    "Finish Price",

    // Label & Content
    "Label",
    "Icon",
    "Icon Alignment",
    "Icon Position",
    "Icon Size",
    "Label Position",
    "Label Size",
    "Has Uploaded Image",
    "Uploaded Image Info",

    // Lighting & Smart Features
    "Light Mode",
    "Light Mode Price",
    "Brightness",
    "WiFi Enabled",
    "WiFi Features",
    "Schedule",

    // Quantity & Pricing
    "Quantity",
    "Base Price",

    // Customer Information
    "Customer Email",
    "Customer Name",
    "Customer Phone",
    "Customer Address",

    // Metadata
    "User Agent",
    "Timezone",
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setBackground("#4285f4");
  sheet.getRange(1, 1, 1, headers.length).setFontColor("white");
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
}

function addOrderToSheet(sheet, data) {
  const row = [
    // Order Information
    data.orderId || "",
    data.orderNumber || "",
    data.totalPrice || 0,
    data.date || "",
    data.status || "",
    data.timestamp || new Date().toISOString(),

    // Button Configuration
    data.purpose || "",
    data.purposeDescription || "",
    data.customPurpose || "",

    // Shape & Style
    data.shape || "",
    data.shapeId || "",
    data.color || "",
    data.isCustomColor || false,
    data.finish || "",
    data.finishPrice || 0,

    // Label & Content
    data.label || "",
    data.icon || "",
    data.iconAlignment || "",
    data.iconPosition || "",
    data.iconSize || 0,
    data.labelPosition || "",
    data.labelSize || 0,
    data.hasUploadedImage || false,
    data.uploadedImageInfo || "",

    // Lighting & Smart Features
    data.lightMode || "",
    data.lightModePrice || 0,
    data.brightness || 0,
    data.wifiEnabled || false,
    data.wifiFeatures || "",
    data.schedule || "",

    // Quantity & Pricing
    data.quantity || 1,
    data.basePrice || 149,

    // Customer Information
    data.customerEmail || "",
    data.customerName || "",
    data.customerPhone || "",
    data.customerAddress || "",

    // Metadata
    data.userAgent || "",
    data.timezone || "",
  ];

  // Add the row to the sheet
  sheet.appendRow(row);

  // Auto-resize columns for better readability
  sheet.autoResizeColumns(1, row.length);
}

// Test function to verify the script works
function testWebhook() {
  const testData = {
    orderId: "TEST-" + Date.now(),
    orderNumber: "TEST-" + Date.now(),
    totalPrice: 199,
    date: new Date().toISOString(),
    status: "test",
    purpose: "Test Purpose",
    purposeDescription: "This is a test order",
    shape: "round",
    color: "#ff0000",
    finish: "matte",
    quantity: 1,
    timestamp: new Date().toISOString(),
  };

  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData),
    },
  };

  const result = doPost(mockEvent);
  console.log("Test result:", result.getContent());
}
