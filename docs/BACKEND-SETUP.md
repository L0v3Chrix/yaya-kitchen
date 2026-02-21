# YaYa's Kitchen Backend Setup Guide
**For:** Chrix
**Time Required:** ~15 minutes
**Difficulty:** Easy (just copy-paste)

---

## Overview

This guide walks you through setting up the Google Sheet and Apps Script backend for YaYa's Kitchen orders. The order form will POST data to this script, which:

1. Stores orders in Google Sheets
2. Tracks customers
3. Manages weekly capacity (15 orders max)
4. Sends email notifications to YaYa
5. Sends confirmation emails to customers

---

## Step 1: Create the Google Sheet

### 1.1 Create New Sheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Name it: `YaYa's Kitchen Orders`

### 1.2 Create the Tabs
The script will auto-create tabs, but you can set them up manually:

1. Rename "Sheet1" to `Orders`
2. Click **+** at bottom to add tab, name it `Customers`
3. Click **+** again, name it `Capacity`

**Or:** Skip this — the script's `initializeSheets()` function will create everything.

---

## Step 2: Open Apps Script Editor

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. This opens the script editor in a new tab
3. Delete any default code in `Code.gs`

---

## Step 3: Paste the Script Code

1. Open the file: `~/clawd/projects/yaya-kitchen/backend/apps-script.js`
2. Copy the entire contents
3. Paste into the Apps Script editor (replacing everything)
4. Click the **Save** icon (or Ctrl/Cmd + S)
5. Name the project: `YaYa Kitchen Orders`

---

## Step 4: Initialize the Sheets

This step creates all the headers and pre-populates capacity weeks.

1. In the Apps Script editor, find the function dropdown (says "testOrder" or similar)
2. Select **initializeSheets** from the dropdown
3. Click **Run** (play button)
4. You'll be asked to authorize — click through:
   - "Review permissions"
   - Choose your Google account
   - Click "Advanced" → "Go to YaYa Kitchen Orders (unsafe)"
   - Click "Allow"
5. Check your Sheet — you should see headers in all 3 tabs!

---

## Step 5: Deploy as Web App

### 5.1 Create Deployment
1. Click **Deploy** → **New deployment**
2. Click the gear icon next to "Select type" → choose **Web app**
3. Fill in:
   - **Description:** `YaYa Kitchen Order API v1`
   - **Execute as:** `Me (your email)`
   - **Who has access:** `Anyone`
4. Click **Deploy**

### 5.2 Copy the URL
1. You'll see a "Web app URL" — **copy this entire URL**
2. It looks like: `https://script.google.com/macros/s/AKfyc.../exec`
3. Save this URL — you'll need it for the form!

---

## Step 6: Test the Deployment

### Quick Test (GET request)
1. Paste the deployment URL in your browser
2. You should see: `{"status":"YaYa's Kitchen Order API is running","timestamp":"..."}`
3. If you see this, the script is working!

### Full Test (via Apps Script)
1. In Apps Script editor, select **testOrder** function
2. Click **Run**
3. Check your Sheet — you should see a test order!
4. Check your email — you should receive the notification!

---

## Step 7: Add URL to Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add new variable:
   - **Name:** `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`
   - **Value:** (paste the deployment URL from Step 5.2)
4. Click **Save**
5. **Redeploy** the site for changes to take effect

---

## Step 8: Update YaYa's Email (Later)

When you have YaYa's actual email:

1. Open the Apps Script editor
2. Find this line near the top:
   ```javascript
   YAYA_EMAIL: 'chrix@theoneai.ai',
   ```
3. Change to:
   ```javascript
   YAYA_EMAIL: 'yaya@actualemail.com',
   ```
4. Click **Save**
5. Click **Deploy** → **Manage deployments** → **Edit** (pencil icon)
6. Bump the version and click **Deploy**

---

## Troubleshooting

### "Script function not found"
- Make sure you saved the script
- Refresh the Apps Script editor

### Emails not sending
- Check the email address in CONFIG
- Check your spam folder
- Google has daily email limits (~100/day for free accounts)

### Form submissions fail
- Verify the deployment URL is correct
- Make sure "Who has access" is set to "Anyone"
- Check the Apps Script execution log (View → Executions)

### Permission errors
- Re-run the authorization flow
- Make sure you're logged into the correct Google account

---

## Managing Orders

### In the Google Sheet:

**Orders Tab:**
- New orders appear automatically
- Update "Status" column as you process
- Mark "Payment Status" when paid
- Mark "Delivered" when delivered

**Customers Tab:**
- Auto-populated from orders
- Add notes about customers in the Notes column
- Track subscription interest

**Capacity Tab:**
- Shows orders per week
- Manually change "Status" to "Closed" to stop accepting orders
- Add new weeks by adding rows

### Closing a Week Early
1. Go to Capacity tab
2. Find the week row
3. Change Status from "Open" to "Closed"
4. Form will reject new orders for that week

---

## Redeploying After Changes

If you modify the script:

1. **Save** the script
2. Click **Deploy** → **Manage deployments**
3. Click the **pencil icon** to edit
4. Under "Version", select **New version**
5. Click **Deploy**

The URL stays the same — no need to update Vercel.

---

## Files Reference

| File | Location | Purpose |
|------|----------|---------|
| Schema | `docs/SHEET-SCHEMA.md` | Column definitions |
| Script | `backend/apps-script.js` | Full Apps Script code |
| This guide | `docs/BACKEND-SETUP.md` | Setup instructions |

---

*Setup guide v1.0 | 2026-02-21*
