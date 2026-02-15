# Ntigi Shipping System - Testing Guide

## Quick Start Testing

### 1. Test Dashboard
**URL:** `http://localhost:3000/dashboard`
**What to Verify:**
- [ ] 4 stat cards display (Revenue, Orders, Drivers, Customers)
- [ ] Line chart renders with 7-day data
- [ ] Pie charts show status and category breakdown
- [ ] Bar chart shows branch performance
- [ ] No console errors
- [ ] All components load within 2 seconds

---

## 2. Test Fleet Management

### Create New Vehicle
1. Go to **Fleet** page
2. Click **"+ New Vehicle"** button
3. Fill form:
   - Fleet Type: Select "Van"
   - Vehicle Plate: Enter "KA-123-ABC"
   - Color: Enter "White"
4. Click Submit
5. Verify:
   - [ ] Success toast notification appears
   - [ ] Modal closes
   - [ ] New vehicle appears in table
   - [ ] Plate number matches entered value

### Search Vehicles
1. Type in search box
2. Verify table filters in real-time
3. Verify case-insensitive matching

---

## 3. Test Customer Management

### Add Customer
1. Go to **Customers** page
2. Click **"+ New Customer"**
3. Fill form:
   - First Name: "John"
   - Last Name: "Doe"
   - Phone: "+237690123456"
   - Email: "john@example.com"
4. Submit
5. Verify:
   - [ ] Customer appears in list
   - [ ] Phone number is displayed
   - [ ] Verified status shows "No"

### Phone Number Validation
- Try submitting without phone: Should show error
- Try invalid format: Should show validation

---

## 4. Test Branches

### Create Branch
1. Go to **Branches** page
2. Click **"+ new branch"**
3. Fill:
   - Branch Name: "Douala Hub"
   - City: "Douala"
   - Printer Type: "58mm"
4. Submit
5. Verify:
   - [ ] Branch appears in table
   - [ ] Printer type matches selection
   - [ ] Can search by city name

---

## 5. Test Users (Staff)

### Add User
1. Go to **Users** page
2. Click **"+ new user"**
3. Fill:
   - First Name: "Jane"
   - Last Name: "Smith"
   - Email: "jane@company.com"
   - Phone: "+237691234567"
   - Role: "AGENT"
4. Submit
5. Verify:
   - [ ] User appears in table
   - [ ] Role displays correctly
   - [ ] Phone is listed

### Role Assignment
- Try different roles (SUPER_ADMIN, MANAGER, AGENT, DRIVER)
- Verify role persists on page refresh

---

## 6. Test Shipments

### View Shipments
1. Go to **Shipments** page
2. Verify page loads with existing shipments
3. Check columns:
   - [ ] Tracking number displays (7-digit alphanumeric)
   - [ ] Sender/receiver names show
   - [ ] Origin/destination stops
   - [ ] Status color-coded (green=pending, green=delivered, etc.)
   - [ ] Cost displayed in XAF

### Search Shipments
1. Enter tracking number in search
2. Verify filtering works
3. Try customer name - should filter by sender/receiver

### Status Display
- Verify all status types display with correct colors:
  - PENDING: Yellow
  - IN_TRANSIT: green
  - ARRIVED: Purple
  - DELIVERED: Green
  - CANCELLED: Red

---

## 7. Test Drivers

### Add Driver
1. Go to **Drivers** page
2. Note the stats cards (Active, Suspended, Inactive, Total)
3. Click **"+ new Driver"**
4. Fill form with driver details
5. Submit
6. Verify:
   - [ ] Driver appears in table
   - [ ] Total driver count increased
   - [ ] Vehicle assignment shows

### Driver Search
- Search by name
- Search by phone
- Verify real-time filtering

---

## 8. Test Warehouses

### Add Warehouse
1. Go to **Warehouses** page
2. Click **"+ New Warehouse"**
3. Fill:
   - Name: "Main Store"
   - Manager: "Mr. Manager"
   - Location: "Douala Port"
   - Capacity: "5000"
4. Submit
5. Verify warehouse appears

---

## 9. Test Expenses

### Add Expense
1. Go to **Expenses** page
2. Check total expenses calculation
3. Click **"+ new Expense"**
4. Fill:
   - Date: Select recent date
   - Amount: "5000"
   - Category: "Fuel"
   - Description: "Diesel for delivery trips"
5. Submit
6. Verify:
   - [ ] Expense in table
   - [ ] Total expenses updates
   - [ ] Category matches selection

### Filter Expenses
- Filter by category
- Filter by date range
- Sort by amount

---

## 10. Test Inventory

### Add Product
1. Go to **Inventory** page
2. Click **"+ new product"**
3. Fill:
   - Name: "Test Product"
   - SKU: "SKU-12345"
   - Quantity: "100"
   - Store: "Main Warehouse"
4. Submit
5. Verify:
   - [ ] Product appears
   - [ ] SKU matches
   - [ ] Quantity displays

---

## 11. Error Handling Tests

### Test Missing Fields
1. Open any form
2. Try submit without filling required fields
3. Verify error messages appear

### Test Invalid Data
1. Try phone number with wrong format
2. Try email with invalid format
3. Verify validation messages

### Test Network Error
1. Disconnect internet
2. Try to fetch data
3. Verify error message displays
4. Verify error persists until retry

### Test Toast Notifications
1. Complete any CRUD action
2. Verify toast notification:
   - [ ] Appears at top-right
   - [ ] Shows success/error message
   - [ ] Auto-dismisses after 3 seconds
   - [ ] Can be dismissed manually

---

## 12. Performance Tests

### Page Load Time
- Dashboard: Should load in < 2 seconds
- Data pages: Should load in < 3 seconds
- Before search functional: < 100ms

### Memory Usage
- Open browser DevTools (F12)
- Memory tab
- Check no memory leaks after:
  - Adding items
  - Searching
  - Opening/closing modals
  - Page navigation

### Chart Rendering
- Dashboard charts should render smoothly
- No janky animations
- Responsive on resize

---

## 13. Responsive Design Tests

### Mobile (375px width)
- [ ] Sidebar might stack
- [ ] Tables scroll horizontally
- [ ] Cards stack vertically
- [ ] Buttons are touch-friendly

### Tablet (768px width)
- [ ] 2-column layouts work
- [ ] All buttons accessible
- [ ] No text overflow

### Desktop (1920px width)
- [ ] Optimal 4-column layout
- [ ] Charts display properly
- [ ] No excessive whitespace

---

## 14. Database Tests

### Data Persistence
1. Add item: "Test Item"
2. Refresh page (F5)
3. Verify "Test Item" still appears
4. Check in Supabase console

### Relationship Integrity
1. Add customer
2. Add shipment with that customer as sender
3. View shipment
4. Verify customer details load correctly

### Foreign Key Constraints
1. Try to delete a branch with assigned users
2. Verify either:
   - Delete prevented, or
   - Cascade delete works as expected

---

## 15. Form Functionality Tests

### Modal Behavior
1. Open modal
2. Click outside (backdrop)
3. Verify closes on outside click
4. Verify closes on X button
5. Verify smooth slide-in animation

### Form Reset
1. Open form
2. Enter data
3. Close modal
4. Reopen modal
5. Verify form is clean (not pre-filled)

### Image Upload (where applicable)
1. Try upload in Fleet/Inventory forms
2. Verify preview shows
3. Submit with image
4. Verify persists to database

---

## 16. Navigation Tests

### Sidebar Navigation
1. Click each sidebar item
2. Verify correct page loads
3. Verify active menu item highlighted
4. Verify URL changes

### Back Button
1. Navigate to a page
2. Press browser back button
3. Verify previous page loads

---

## 17. Integration Tests

### Complete Workflow: Create Shipment
1. Add Customer (sender)
2. Add Customer (receiver)
3. Verify Branches exist
4. Create Shipment linking all
5. Verify:
   - [ ] Tracking number generated
   - [ ] Status = PENDING
   - [ ] Relationships intact
   - [ ] Cost calculated

### Complete Workflow: Fleet Assignment
1. Add Vehicle
2. Add Driver (user with DRIVER role)
3. Create Manifest
4. Assign Vehicle & Driver
5. Verify chain of custody

---

## 18. Browser Compatibility

### Test on:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Verify in each:
- [ ] All pages load
- [ ] Forms function
- [ ] Charts render
- [ ] Modals display
- [ ] No console errors

---

## 19. Accessibility Tests

### Keyboard Navigation
- [ ] Tab through form fields
- [ ] Enter to submit
- [ ] Escape to close modals
- [ ] All buttons focusable

### Screen Reader (NVDA/JAWS)
- [ ] Labels read correctly
- [ ] Form instructions understood
- [ ] Errors announced
- [ ] Buttons labeled clearly

### Color Contrast
- [ ] Status colors readable
- [ ] Text on backgrounds sufficient contrast
- [ ] No information conveyed by color alone

---

## 20. Security Tests

### Input Validation
- [ ] SQL injection attempts fail
- [ ] XSS attempts fail
- [ ] Special characters handled
- [ ] Phone number format enforced

### Permission Testing
- [ ] Only authenticated users access app
- [ ] User can only see own agency data
- [ ] Role restrictions enforced

---

## Test Checklist Summary

```
Dashboard        ✓ ☐
Fleet           ✓ ☐
Customers       ✓ ☐
Branches        ✓ ☐
Users           ✓ ☐
Shipments       ✓ ☐
Drivers         ✓ ☐
Warehouses      ✓ ☐
Expenses        ✓ ☐
Inventory       ✓ ☐

Form Testing    ✓ ☐
Error Handling  ✓ ☐
Performance     ✓ ☐
Responsive      ✓ ☐
Database        ✓ ☐
Navigation      ✓ ☐
Integration     ✓ ☐
Browser Compat  ✓ ☐
Accessibility   ✓ ☐
Security        ✓ ☐
```

---

## Test Results

### Date: _______________
### Tester: _____________

#### Overall Status
- [ ] All tests passed
- [ ] Some tests failed (see below)
- [ ] Major issues found (blockers)

#### Failed Tests
```
1. ______________________________
2. ______________________________
3. ______________________________
```

#### Notes
```
_________________________________
_________________________________
_________________________________
```

#### Sign-off
- Tested by: _______________
- Approved by: _____________
- Date: ____________________
