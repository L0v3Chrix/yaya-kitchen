/**
 * YaYa's Kitchen Order Form Handler
 * Google Apps Script for processing form submissions
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Paste this entire code
 * 4. Update NOTIFICATION_EMAIL below
 * 5. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the deployment URL to your website form
 */

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION - UPDATE THESE VALUES
// ═══════════════════════════════════════════════════════════════

const NOTIFICATION_EMAIL = 'chrix@theoneai.ai'; // Change to Yaya's email when ready
const SPREADSHEET_NAME = "YaYa's Kitchen Orders";

// ═══════════════════════════════════════════════════════════════
// SHEET HEADERS - Must match form field names
// ═══════════════════════════════════════════════════════════════

const HEADERS = [
  'Timestamp',
  'Name',
  'Email',
  'Phone',
  'Address',
  'Weekly Basket',
  'Dinner Anchor',
  'Smoothie Qty',
  'Dessert',
  'Flowers Home',
  'Flowers Gift',
  'Gift Recipient',
  'Arrival Basket',
  'Pantry Starter',
  'Container Deposit',
  'Special Notes'
];

// ═══════════════════════════════════════════════════════════════
// MAIN HANDLER - Receives POST requests from website
// ═══════════════════════════════════════════════════════════════

function doPost(e) {
  try {
    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Get or create sheet
    const sheet = getOrCreateSheet();

    // Add timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'short',
      timeStyle: 'short'
    });

    // Build row data matching headers
    const rowData = [
      timestamp,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.address || '',
      data.weeklyBasket || 'No',
      data.dinnerAnchor || 'None',
      data.smoothieQty || '0',
      data.dessert || 'No',
      data.flowersHome || 'None',
      data.flowersGift || 'No',
      data.giftRecipient || '',
      data.arrivalBasket || 'No',
      data.pantryStarter || 'No',
      data.containerDeposit || 'No',
      data.specialNotes || ''
    ];

    // Append to sheet
    sheet.appendRow(rowData);

    // Send email notification
    sendNotificationEmail(data, timestamp);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Order received!' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log error for debugging
    console.error('Error processing order:', error);

    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Get or create the orders sheet
// ═══════════════════════════════════════════════════════════════

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Orders');

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet('Orders');

    // Add headers
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#2F1957'); // YaYa's purple
    headerRange.setFontColor('#FFFFFF');

    // Freeze header row
    sheet.setFrozenRows(1);

    // Auto-resize columns
    for (let i = 1; i <= HEADERS.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }

  return sheet;
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Send email notification
// ═══════════════════════════════════════════════════════════════

function sendNotificationEmail(data, timestamp) {
  const subject = `🧺 New YaYa's Kitchen Order from ${data.name}`;

  // Build order items list
  const orderItems = [];

  if (data.weeklyBasket === 'Yes') {
    orderItems.push('☑ Weekly Basket ($70-90)');

    if (data.dinnerAnchor === 'Add-On') {
      orderItems.push('☑ Dinner Anchor Add-On ($68-78)');
    } else if (data.dinnerAnchor === 'Bundle') {
      orderItems.push('☑ Dinner Anchor Bundle ($135-155)');
    }
  } else {
    orderItems.push('☐ Weekly Basket (not this week)');
  }

  if (data.smoothieQty && data.smoothieQty !== '0') {
    orderItems.push(`☑ Smoothies × ${data.smoothieQty} ($7-9 each)`);
  }

  if (data.dessert === 'Yes') {
    orderItems.push('☑ Weekly Dessert ($16-30)');
  }

  if (data.flowersHome && data.flowersHome !== 'None') {
    orderItems.push(`☑ Flowers for Home (${data.flowersHome})`);
  }

  if (data.flowersGift === 'Yes') {
    orderItems.push('☑ Flowers as Gift');
    if (data.giftRecipient) {
      orderItems.push(`   └ Recipient: ${data.giftRecipient}`);
    }
  }

  if (data.arrivalBasket === 'Yes') {
    orderItems.push('☑ Arrival Basket ($105-125)');
  }

  if (data.pantryStarter === 'Yes') {
    orderItems.push('☑ Basic Pantry Starter ($45-65)');
  }

  // Build email body
  const body = `
New order received!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUSTOMER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Address: ${data.address}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${orderItems.join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPECIAL NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${data.specialNotes || '(None)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Container deposit acknowledged: ${data.containerDeposit}
Order received: ${timestamp}

View all orders in your Google Sheet.
  `.trim();

  // Send the email
  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: subject,
    body: body
  });
}

// ═══════════════════════════════════════════════════════════════
// TEST FUNCTION - Run this to verify setup
// ═══════════════════════════════════════════════════════════════

function testSetup() {
  // Create test data
  const testData = {
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '(555) 123-4567',
    address: '123 Test Street, Orlando, FL 32801',
    weeklyBasket: 'Yes',
    dinnerAnchor: 'Bundle',
    smoothieQty: '2',
    dessert: 'Yes',
    flowersHome: '1 arrangement',
    flowersGift: 'No',
    giftRecipient: '',
    arrivalBasket: 'No',
    pantryStarter: 'No',
    containerDeposit: 'Yes',
    specialNotes: 'This is a test order - please ignore!'
  };

  // Get or create sheet
  const sheet = getOrCreateSheet();

  // Add timestamp
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'short',
    timeStyle: 'short'
  });

  // Build and append row
  const rowData = [
    timestamp,
    testData.name,
    testData.email,
    testData.phone,
    testData.address,
    testData.weeklyBasket,
    testData.dinnerAnchor,
    testData.smoothieQty,
    testData.dessert,
    testData.flowersHome,
    testData.flowersGift,
    testData.giftRecipient,
    testData.arrivalBasket,
    testData.pantryStarter,
    testData.containerDeposit,
    testData.specialNotes
  ];

  sheet.appendRow(rowData);

  // Send test email
  sendNotificationEmail(testData, timestamp);

  console.log('Test completed! Check your sheet and email.');
}

// ═══════════════════════════════════════════════════════════════
// UTILITY: Handle GET requests (for testing deployment)
// ═══════════════════════════════════════════════════════════════

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'active',
      message: "YaYa's Kitchen order form is ready!"
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
