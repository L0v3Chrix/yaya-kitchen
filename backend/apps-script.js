/**
 * YaYa's Kitchen Order System - Google Apps Script
 * 
 * This script handles:
 * - Form submissions via doPost webhook
 * - Order ID generation (YAYA-YYYYMMDD-XXX)
 * - Capacity checking (max 15 orders/week)
 * - Order storage in Google Sheets
 * - Customer tracking
 * - Email notifications to YaYa and customers
 * - Payment status tracking via Stripe integration
 * - Webhook support for payment status updates
 * 
 * Deploy as Web App: Anyone can access (for form submission)
 * 
 * @version 1.1
 * @date 2026-02-21
 * 
 * Changelog:
 * v1.1 (2026-02-21) - Added Stripe payment tracking
 *   - Added paymentStatus, stripeSessionId, stripePaymentIntentId fields
 *   - Created updatePaymentStatus() function for webhook support
 *   - Added action='updatePaymentStatus' handler in doPost
 *   - Updated sheet columns to include Stripe transaction IDs
 * v1.0 (2026-02-21) - Initial release
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // YaYa's notification email
  YAYA_EMAIL: 'hello@yayasbaskets.com',
  
  // Sheet tab names
  ORDERS_TAB: 'Orders',
  CUSTOMERS_TAB: 'Customers',
  CAPACITY_TAB: 'Capacity',
  
  // Capacity limit per week
  MAX_CAPACITY: 15,
  
  // In-zone ZIP codes (8-mile radius from 32779)
  IN_ZONE_ZIPS: [
    '32779', // Longwood - base
    '32750', // Longwood
    '32701', // Altamonte Springs
    '32714', // Altamonte Springs
    '32730', // Casselberry
    '32707', // Casselberry
    '32708', // Winter Springs
    '32765', // Oviedo - partial
    '32746', // Lake Mary
    '32771', // Sanford - partial
    '32751', // Maitland
    '32789', // Winter Park - partial
  ]
};

// ============================================
// MAIN WEBHOOK HANDLER
// ============================================

/**
 * Handle POST requests from the order form
 * @param {Object} e - Event object containing POST data
 * @returns {TextOutput} JSON response
 */
function doPost(e) {
  try {
    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Handle payment status update action
    if (data.action === 'updatePaymentStatus') {
      return updatePaymentStatus(data.orderId, data.paymentStatus, {
        stripeSessionId: data.stripeSessionId,
        stripePaymentIntentId: data.stripePaymentIntentId
      });
    }
    
    // Validate required fields
    const validation = validateOrderData(data);
    if (!validation.valid) {
      return createJsonResponse({
        success: false,
        error: validation.error
      });
    }
    
    // Check capacity for requested delivery week
    const deliveryWeek = data.deliveryWeek;
    if (!checkCapacity(deliveryWeek)) {
      return createJsonResponse({
        success: false,
        error: 'Sorry, we\'re fully booked for ' + formatDate(deliveryWeek) + '. Please select another week.',
        capacityFull: true
      });
    }
    
    // Generate order ID
    const orderId = generateOrderId();
    
    // Determine delivery zone
    const zip = extractZip(data.address, data.zip);
    const deliveryZone = CONFIG.IN_ZONE_ZIPS.includes(zip) ? 'In-Zone' : 'Out-of-Zone (+$10)';
    
    // Build order data object
    const orderData = {
      timestamp: new Date(),
      orderId: orderId,
      status: 'New',
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      zip: zip,
      deliveryZone: deliveryZone,
      deliveryWeek: data.deliveryWeek || '',
      weeklyBasket: data.weeklyBasket || 'No',
      giftBasket: data.giftBasket || 'No',
      giftRecipient: data.giftRecipient || '',
      dinnerAnchor: data.dinnerAnchor || 'None',
      smoothieQty: parseInt(data.smoothieQty) || 0,
      dessert: data.dessert || 'No',
      flowersHome: data.flowersHome || 'None',
      flowersGift: data.flowersGift || 'No',
      giftMessage: data.giftMessage || '',
      arrivalBasket: data.arrivalBasket || 'No',
      pantryStarter: data.pantryStarter || 'No',
      deliveryInstructions: data.deliveryInstructions || '',
      containerDeposit: data.containerDeposit || 'Yes',
      subscriptionInterest: data.subscriptionInterest || 'None',
      contactPreference: data.contactPreference || 'Email',
      specialNotes: data.specialNotes || '',
      paymentStatus: data.paymentStatus || 'Pending Payment',
      stripeSessionId: data.stripeSessionId || '',
      stripePaymentIntentId: data.stripePaymentIntentId || '',
      delivered: 'No'
    };
    
    // Add order to Orders sheet
    addOrderToSheet(orderData);
    
    // Update/create customer record
    updateCustomer(orderData);
    
    // Increment capacity count
    incrementCapacity(deliveryWeek);
    
    // Send email notifications
    sendYaYaNotification(orderData);
    sendCustomerConfirmation(orderData);
    
    // Return success response
    return createJsonResponse({
      success: true,
      orderId: orderId,
      message: 'Order received! Check your email for confirmation.'
    });
    
  } catch (error) {
    // Log error for debugging
    console.error('doPost Error:', error.toString());
    
    return createJsonResponse({
      success: false,
      error: 'Something went wrong. Please try again or contact us directly.'
    });
  }
}

/**
 * Handle GET requests (for testing deployment)
 */
function doGet(e) {
  return createJsonResponse({
    status: 'YaYa\'s Kitchen Order API is running',
    timestamp: new Date().toISOString()
  });
}

// ============================================
// ORDER MANAGEMENT
// ============================================

/**
 * Validate required order fields
 * @param {Object} data - Order data
 * @returns {Object} { valid: boolean, error: string }
 */
function validateOrderData(data) {
  if (!data.name || data.name.trim().length < 2) {
    return { valid: false, error: 'Please provide your full name.' };
  }
  if (!data.email || !isValidEmail(data.email)) {
    return { valid: false, error: 'Please provide a valid email address.' };
  }
  if (!data.phone || data.phone.trim().length < 7) {
    return { valid: false, error: 'Please provide a valid phone number.' };
  }
  if (!data.address || data.address.trim().length < 10) {
    return { valid: false, error: 'Please provide your full delivery address.' };
  }
  if (!data.deliveryWeek) {
    return { valid: false, error: 'Please select a delivery week.' };
  }
  return { valid: true, error: null };
}

/**
 * Generate unique order ID: YAYA-YYYYMMDD-XXX
 * @returns {string} Order ID
 */
function generateOrderId() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ordersSheet = ss.getSheetByName(CONFIG.ORDERS_TAB);
  
  const today = new Date();
  const dateStr = Utilities.formatDate(today, 'America/New_York', 'yyyyMMdd');
  
  // Count existing orders for today
  const data = ordersSheet.getDataRange().getValues();
  let todayCount = 0;
  
  for (let i = 1; i < data.length; i++) {
    const orderId = data[i][1]; // Column B is Order ID
    if (orderId && orderId.toString().includes(dateStr)) {
      todayCount++;
    }
  }
  
  // Increment and pad to 3 digits
  const sequence = String(todayCount + 1).padStart(3, '0');
  
  return 'YAYA-' + dateStr + '-' + sequence;
}

/**
 * Add order row to Orders sheet
 * @param {Object} orderData - Complete order data
 */
function addOrderToSheet(orderData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.ORDERS_TAB);
  
  const row = [
    orderData.timestamp,
    orderData.orderId,
    orderData.status,
    orderData.name,
    orderData.email,
    orderData.phone,
    orderData.address,
    orderData.zip,
    orderData.deliveryZone,
    orderData.deliveryWeek,
    orderData.weeklyBasket,
    orderData.giftBasket,
    orderData.giftRecipient,
    orderData.dinnerAnchor,
    orderData.smoothieQty,
    orderData.dessert,
    orderData.flowersHome,
    orderData.flowersGift,
    orderData.giftMessage,
    orderData.arrivalBasket,
    orderData.pantryStarter,
    orderData.deliveryInstructions,
    orderData.containerDeposit,
    orderData.subscriptionInterest,
    orderData.contactPreference,
    orderData.specialNotes,
    orderData.paymentStatus,
    orderData.delivered,
    orderData.stripeSessionId,
    orderData.stripePaymentIntentId
  ];
  
  sheet.appendRow(row);
}

/**
 * Update payment status for an existing order
 * @param {string} orderId - Order ID to update
 * @param {string} status - New payment status
 * @param {Object} stripeData - Stripe transaction IDs
 * @returns {TextOutput} JSON response
 */
function updatePaymentStatus(orderId, status, stripeData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.ORDERS_TAB);
    const data = sheet.getDataRange().getValues();
    
    // Find the order by orderId (column B, index 1)
    let orderRow = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] && data[i][1].toString() === orderId) {
        orderRow = i + 1; // 1-indexed for sheet
        break;
      }
    }
    
    if (orderRow === -1) {
      return createJsonResponse({
        success: false,
        error: 'Order not found: ' + orderId
      });
    }
    
    // Update payment status (column 27, index 26)
    sheet.getRange(orderRow, 27).setValue(status);
    
    // Update stripePaymentIntentId if provided (column 30, index 29)
    if (stripeData && stripeData.stripePaymentIntentId) {
      sheet.getRange(orderRow, 30).setValue(stripeData.stripePaymentIntentId);
    }
    
    // Update stripeSessionId if provided (column 29, index 28)
    if (stripeData && stripeData.stripeSessionId) {
      sheet.getRange(orderRow, 29).setValue(stripeData.stripeSessionId);
    }
    
    return createJsonResponse({
      success: true,
      orderId: orderId,
      paymentStatus: status,
      message: 'Payment status updated successfully'
    });
    
  } catch (error) {
    console.error('updatePaymentStatus Error:', error.toString());
    return createJsonResponse({
      success: false,
      error: 'Failed to update payment status: ' + error.toString()
    });
  }
}

// ============================================
// CUSTOMER MANAGEMENT
// ============================================

/**
 * Update existing customer or create new one
 * @param {Object} orderData - Order data containing customer info
 */
function updateCustomer(orderData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.CUSTOMERS_TAB);
  const data = sheet.getDataRange().getValues();
  
  // Search for existing customer by email
  let customerRow = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] && data[i][2].toString().toLowerCase() === orderData.email.toLowerCase()) {
      customerRow = i + 1; // 1-indexed for sheet
      break;
    }
  }
  
  const today = new Date();
  
  if (customerRow > 0) {
    // Update existing customer
    const existingData = data[customerRow - 1];
    const totalOrders = (parseInt(existingData[8]) || 0) + 1;
    
    // Update relevant columns
    sheet.getRange(customerRow, 2).setValue(orderData.name); // Name
    sheet.getRange(customerRow, 4).setValue(orderData.phone); // Phone
    sheet.getRange(customerRow, 5).setValue(orderData.address); // Address
    sheet.getRange(customerRow, 6).setValue(orderData.zip); // ZIP
    sheet.getRange(customerRow, 8).setValue(today); // Last Order
    sheet.getRange(customerRow, 9).setValue(totalOrders); // Total Orders
    
    // Update subscription status if expressed interest
    if (orderData.subscriptionInterest !== 'None') {
      sheet.getRange(customerRow, 10).setValue('Interested (' + orderData.subscriptionInterest + ')');
    }
    
    sheet.getRange(customerRow, 11).setValue(orderData.contactPreference); // Contact Preference
    
  } else {
    // Create new customer
    const customerId = 'CUST-' + String(data.length).padStart(3, '0');
    
    const subscriptionStatus = orderData.subscriptionInterest !== 'None' 
      ? 'Interested (' + orderData.subscriptionInterest + ')' 
      : 'None';
    
    const newRow = [
      customerId,
      orderData.name,
      orderData.email,
      orderData.phone,
      orderData.address,
      orderData.zip,
      today, // First Order
      today, // Last Order
      1, // Total Orders
      subscriptionStatus,
      orderData.contactPreference,
      '' // Notes (empty)
    ];
    
    sheet.appendRow(newRow);
  }
}

// ============================================
// CAPACITY MANAGEMENT
// ============================================

/**
 * Check if capacity is available for a given week
 * @param {string} weekDate - Friday delivery date (YYYY-MM-DD format)
 * @returns {boolean} True if capacity available
 */
function checkCapacity(weekDate) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.CAPACITY_TAB);
  const data = sheet.getDataRange().getValues();
  
  // Parse the target week date
  const targetDate = new Date(weekDate);
  const targetStr = Utilities.formatDate(targetDate, 'America/New_York', 'yyyy-MM-dd');
  
  for (let i = 1; i < data.length; i++) {
    const rowDate = data[i][0];
    if (rowDate) {
      const rowStr = Utilities.formatDate(new Date(rowDate), 'America/New_York', 'yyyy-MM-dd');
      if (rowStr === targetStr) {
        const currentCount = parseInt(data[i][1]) || 0;
        const maxCapacity = parseInt(data[i][2]) || CONFIG.MAX_CAPACITY;
        const status = data[i][3];
        
        // Reject if manually closed or at capacity
        if (status === 'Closed' || status === 'Sold Out') {
          return false;
        }
        
        return currentCount < maxCapacity;
      }
    }
  }
  
  // Week not found - create it and return true (available)
  const newRow = [
    targetDate,
    0,
    CONFIG.MAX_CAPACITY,
    'Open'
  ];
  sheet.appendRow(newRow);
  
  return true;
}

/**
 * Increment order count for a delivery week
 * @param {string} weekDate - Friday delivery date
 */
function incrementCapacity(weekDate) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.CAPACITY_TAB);
  const data = sheet.getDataRange().getValues();
  
  const targetDate = new Date(weekDate);
  const targetStr = Utilities.formatDate(targetDate, 'America/New_York', 'yyyy-MM-dd');
  
  for (let i = 1; i < data.length; i++) {
    const rowDate = data[i][0];
    if (rowDate) {
      const rowStr = Utilities.formatDate(new Date(rowDate), 'America/New_York', 'yyyy-MM-dd');
      if (rowStr === targetStr) {
        const currentCount = parseInt(data[i][1]) || 0;
        const maxCapacity = parseInt(data[i][2]) || CONFIG.MAX_CAPACITY;
        const newCount = currentCount + 1;
        
        // Update count
        sheet.getRange(i + 1, 2).setValue(newCount);
        
        // Update status if at capacity
        if (newCount >= maxCapacity) {
          sheet.getRange(i + 1, 4).setValue('Sold Out');
        }
        
        return;
      }
    }
  }
}

// ============================================
// EMAIL NOTIFICATIONS
// ============================================

/**
 * Send notification email to YaYa
 * @param {Object} orderData - Complete order data
 */
function sendYaYaNotification(orderData) {
  const subject = '🧺 New Order from ' + orderData.name + ' - ' + formatDate(orderData.deliveryWeek);
  
  // Build order items list
  let items = '';
  
  if (orderData.weeklyBasket === 'Yes') {
    items += '✅ Weekly Basket\n';
    if (orderData.dinnerAnchor !== 'None') {
      items += '   └─ Dinner Anchor: ' + orderData.dinnerAnchor + '\n';
    }
  }
  
  if (orderData.giftBasket === 'Yes') {
    items += '✅ Gift Basket\n';
    if (orderData.giftRecipient) {
      items += '   └─ Recipient: ' + orderData.giftRecipient + '\n';
    }
  }
  
  if (orderData.smoothieQty > 0) {
    items += '✅ Smoothies × ' + orderData.smoothieQty + '\n';
  }
  
  if (orderData.dessert === 'Yes') {
    items += '✅ Dessert\n';
  }
  
  if (orderData.flowersHome !== 'None') {
    items += '✅ Flowers for Home: ' + orderData.flowersHome + '\n';
  }
  
  if (orderData.flowersGift === 'Yes') {
    items += '✅ Flowers as Gift\n';
  }
  
  if (orderData.arrivalBasket === 'Yes') {
    items += '✅ Arrival Basket\n';
  }
  
  if (orderData.pantryStarter === 'Yes') {
    items += '✅ Pantry Starter\n';
  }
  
  if (!items) {
    items = '(No items selected - please review)\n';
  }
  
  // Build zone alert if out-of-zone
  let zoneAlert = '';
  if (orderData.deliveryZone === 'Out-of-Zone (+$10)') {
    zoneAlert = '\n⚠️  OUT-OF-ZONE DELIVERY (+$10 FEE)\n';
  }
  
  // Build subscription interest
  let subscriptionNote = '';
  if (orderData.subscriptionInterest !== 'None') {
    subscriptionNote = '\n💫 INTERESTED IN SUBSCRIPTION: ' + orderData.subscriptionInterest + '\n';
  }
  
  const body = `
New order received!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order ID: ${orderData.orderId}
Delivery: ${formatDate(orderData.deliveryWeek)} (Friday)
${zoneAlert}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUSTOMER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${orderData.name}
Email: ${orderData.email}
Phone: ${orderData.phone}
Address: ${orderData.address}
ZIP: ${orderData.zip} (${orderData.deliveryZone})
Contact Preference: ${orderData.contactPreference}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ITEMS ORDERED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${items}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GIFT MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${orderData.giftMessage || '(None)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DELIVERY INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${orderData.deliveryInstructions || '(None)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPECIAL NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${orderData.specialNotes || '(None)'}
${subscriptionNote}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Container deposit acknowledged: ${orderData.containerDeposit}
Order received: ${formatDateTime(orderData.timestamp)}

→ Next step: Calculate total and send payment link

View all orders in your Google Sheet.
`.trim();
  
  MailApp.sendEmail({
    to: CONFIG.YAYA_EMAIL,
    subject: subject,
    body: body
  });
}

/**
 * Send confirmation email to customer
 * @param {Object} orderData - Complete order data
 */
function sendCustomerConfirmation(orderData) {
  const subject = '🧺 Your YaYa\'s Kitchen Order - ' + orderData.orderId;
  
  // Build simple order summary
  let items = [];
  
  if (orderData.weeklyBasket === 'Yes') {
    let item = 'Weekly Basket';
    if (orderData.dinnerAnchor === 'Bundle') {
      item += ' + Dinner Anchor (Bundle)';
    } else if (orderData.dinnerAnchor === 'Add-On') {
      item += '\n  • Dinner Anchor Add-On';
    }
    items.push(item);
  }
  
  if (orderData.giftBasket === 'Yes') {
    items.push('Gift Basket');
  }
  
  if (orderData.smoothieQty > 0) {
    items.push('Smoothies × ' + orderData.smoothieQty);
  }
  
  if (orderData.dessert === 'Yes') {
    items.push('Weekly Dessert');
  }
  
  if (orderData.flowersHome !== 'None') {
    items.push('Flowers for Home (' + orderData.flowersHome + ')');
  }
  
  if (orderData.flowersGift === 'Yes') {
    items.push('Flowers as Gift');
  }
  
  if (orderData.arrivalBasket === 'Yes') {
    items.push('Arrival Basket');
  }
  
  if (orderData.pantryStarter === 'Yes') {
    items.push('Basic Pantry Starter');
  }
  
  const itemsList = items.length > 0 
    ? items.map(i => '  • ' + i).join('\n')
    : '  (Please contact us about your order)';
  
  const body = `
Hi ${orderData.name.split(' ')[0]}! 👋

Thank you for your YaYa's Kitchen order! I'm so excited to prepare something special for you.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR ORDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order #: ${orderData.orderId}

${itemsList}

Delivery: Friday, ${formatDateFriendly(orderData.deliveryWeek)}
Address: ${orderData.address}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT'S NEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I'll review your order and send you the total with a payment link within 24 hours.

Your order will be delivered Friday between 9am - 11am. I'll reach out via ${orderData.contactPreference.toLowerCase()} when I'm on my way!

${orderData.deliveryZone === 'Out-of-Zone (+$10)' ? '\n📍 Note: A $10 delivery fee applies for your area.\n' : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTAINERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A refundable container deposit ($30-40) is included with your first order. Just rinse and leave containers out on Friday, and I'll swap them for fresh ones!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Questions? Just reply to this email or text me.

With love and good food,
YaYa 🧺

---
YaYa's Kitchen
Fresh. Local. Made with Love.
`.trim();
  
  MailApp.sendEmail({
    to: orderData.email,
    subject: subject,
    body: body,
    replyTo: CONFIG.YAYA_EMAIL
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create JSON response for API
 * @param {Object} data - Response data
 * @returns {TextOutput} JSON response
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/**
 * Extract ZIP code from address or use provided ZIP
 * @param {string} address - Full address
 * @param {string} providedZip - ZIP code field value
 * @returns {string} 5-digit ZIP code
 */
function extractZip(address, providedZip) {
  // If ZIP provided directly, use it
  if (providedZip && /^\d{5}/.test(providedZip)) {
    return providedZip.substring(0, 5);
  }
  
  // Try to extract from address
  const zipMatch = address.match(/\b(\d{5})(?:-\d{4})?\b/);
  if (zipMatch) {
    return zipMatch[1];
  }
  
  return 'UNKNOWN';
}

/**
 * Format date as readable string (e.g., "Feb 28, 2026")
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
  const d = new Date(date);
  return Utilities.formatDate(d, 'America/New_York', 'MMM d, yyyy');
}

/**
 * Format date in friendly format (e.g., "February 28th")
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDateFriendly(date) {
  const d = new Date(date);
  const month = Utilities.formatDate(d, 'America/New_York', 'MMMM');
  const day = parseInt(Utilities.formatDate(d, 'America/New_York', 'd'));
  
  // Add ordinal suffix
  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) suffix = 'st';
  else if (day === 2 || day === 22) suffix = 'nd';
  else if (day === 3 || day === 23) suffix = 'rd';
  
  return month + ' ' + day + suffix;
}

/**
 * Format datetime with time (e.g., "Feb 28, 2026 at 10:45 AM")
 * @param {Date} date - Date to format
 * @returns {string} Formatted datetime
 */
function formatDateTime(date) {
  return Utilities.formatDate(date, 'America/New_York', 'MMM d, yyyy \'at\' h:mm a');
}

// ============================================
// TESTING FUNCTIONS (Remove before production)
// ============================================

/**
 * Test the script with sample data
 * Run this from the Apps Script editor to verify setup
 */
function testOrder() {
  const testData = {
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '407-555-0000',
    address: '123 Test St, Longwood, FL 32779',
    zip: '32779',
    deliveryWeek: '2026-02-28',
    weeklyBasket: 'Yes',
    giftBasket: 'No',
    dinnerAnchor: 'Bundle',
    smoothieQty: '2',
    dessert: 'Yes',
    flowersHome: '1 arrangement',
    flowersGift: 'No',
    giftMessage: '',
    arrivalBasket: 'No',
    pantryStarter: 'No',
    deliveryInstructions: 'Leave at front door',
    containerDeposit: 'Yes',
    subscriptionInterest: 'Weekly',
    contactPreference: 'Text',
    specialNotes: 'No nuts please'
  };
  
  // Simulate POST request
  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(e);
  console.log(result.getContent());
}

/**
 * Initialize sheets with headers (run once during setup)
 */
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Orders tab
  let sheet = ss.getSheetByName(CONFIG.ORDERS_TAB);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.ORDERS_TAB);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Order ID', 'Status', 'Name', 'Email', 'Phone', 
      'Address', 'ZIP', 'Delivery Zone', 'Delivery Week', 'Weekly Basket',
      'Gift Basket', 'Gift Recipient', 'Dinner Anchor', 'Smoothie Qty', 'Dessert',
      'Flowers Home', 'Flowers Gift', 'Gift Message', 'Arrival Basket', 'Pantry Starter',
      'Delivery Instructions', 'Container Deposit', 'Subscription Interest', 
      'Contact Preference', 'Special Notes', 'Payment Status', 'Delivered',
      'Stripe Session ID', 'Stripe Payment Intent ID'
    ]);
  }
  
  // Customers tab
  sheet = ss.getSheetByName(CONFIG.CUSTOMERS_TAB);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.CUSTOMERS_TAB);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Customer ID', 'Name', 'Email', 'Phone', 'Address', 'ZIP',
      'First Order', 'Last Order', 'Total Orders', 'Subscription Status',
      'Contact Preference', 'Notes'
    ]);
  }
  
  // Capacity tab
  sheet = ss.getSheetByName(CONFIG.CAPACITY_TAB);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.CAPACITY_TAB);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Week', 'Orders Count', 'Max Capacity', 'Status']);
    
    // Pre-populate next 8 Fridays
    const today = new Date();
    let friday = new Date(today);
    // Find next Friday
    friday.setDate(friday.getDate() + (5 - friday.getDay() + 7) % 7);
    if (friday <= today) {
      friday.setDate(friday.getDate() + 7);
    }
    
    for (let i = 0; i < 8; i++) {
      sheet.appendRow([new Date(friday), 0, 15, 'Open']);
      friday.setDate(friday.getDate() + 7);
    }
  }
  
  console.log('Sheets initialized successfully!');
}
