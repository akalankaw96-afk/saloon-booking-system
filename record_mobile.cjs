const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACTS_DIR = 'C:\\Users\\admin\\.gemini\\antigravity-ide\\brain\\ae0cf33a-27ab-4f2b-ae48-a38ad7e3e625';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function clickVisible(page, selector, textFilter) {
  const elements = await page.$$(selector);
  for (const el of elements) {
    const isMatch = await page.evaluate((node, filter) => {
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);
      const visible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
      if (!visible) return false;
      if (filter && !node.textContent.includes(filter)) return false;
      return true;
    }, el, textFilter);

    if (isMatch) {
      await el.click();
      return true;
    }
  }
  return false;
}

async function run() {
  console.log('Launching Chrome for Complete Mobile Flow Recording...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  
  // Mobile viewport: iPhone 14/15 Pro (390 x 844)
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  console.log('Navigating to http://127.0.0.1:5173/ ...');
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(1500);

  // 1. Home Page on Mobile
  console.log('1. Capturing Mobile Homepage...');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '01_mobile_home.png') });

  // 2. Open Mobile Menu Drawer
  console.log('2. Opening Mobile Navigation Drawer...');
  await page.click('button[aria-label="Toggle Navigation Menu"]');
  await sleep(600);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '02_mobile_menu_drawer.png') });

  // 3. Click "Stylist Access" inside the drawer
  console.log('3. Clicking Stylist Access...');
  await clickVisible(page, 'button', 'Stylist Access');
  await sleep(800);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '03_stylist_login_modal.png') });

  // 4. Select Alex Vance (PIN: 1001)
  console.log('4. Selecting Alex Vance (PIN 1001)...');
  await clickVisible(page, '.modal-content button', 'Alex Vance');
  await sleep(300);

  // Enter PIN 1001 directly into input
  const pinInput = await page.$('.modal-content input[type="password"], .modal-content input[type="text"]');
  if (pinInput) {
    await pinInput.click();
    await pinInput.type('1001');
  }
  await sleep(300);

  // Click Unlock Stylist Chair Station
  await clickVisible(page, '.modal-content button[type="submit"]', 'Unlock');
  await sleep(1500);

  // 5. Stylist Chair Station Dashboard on Mobile
  console.log('5. Capturing Stylist Chair Station Dashboard on mobile...');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '04_stylist_station_dashboard.png') });

  // 6. Test In-Chair status toggle
  console.log('6. Toggling Working Status to In-Chair...');
  await clickVisible(page, 'button', 'In-Chair');
  await sleep(600);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '05_stylist_status_in_chair.png') });

  // Return to Available
  await clickVisible(page, 'button', 'Available');
  await sleep(400);

  // 7. Click "Seat Walk-in" on open slot
  console.log('7. Opening Seat Walk-in Modal...');
  await clickVisible(page, 'button', 'Seat Walk-in');
  await sleep(600);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '06_seat_walkin_modal.png') });

  // Fill in Walk-in guest name
  const walkinInput = await page.$('input[placeholder*="Guest in blue jacket"]');
  if (walkinInput) {
    await walkinInput.type('Maya Perera (Walk-in)');
    await sleep(300);
    const confirmBtn = await page.$('.modal-content button[type="submit"]');
    if (confirmBtn) {
      await confirmBtn.click();
      await sleep(1200);
    }
  }
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '07_walkin_seated_in_chair.png') });

  // 8. Queue Hold
  console.log('8. Holding next slot for Queue...');
  await clickVisible(page, 'button', '+ Hold Next Slot for Queue');
  await sleep(1000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '08_queue_hold_active.png') });

  // 9. My Profile & Shifts Tab
  console.log('9. Switching to My Profile & Shifts tab...');
  await clickVisible(page, 'button', 'My Profile & Shifts');
  await sleep(800);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '09_stylist_profile_shifts.png') });

  // 10. Lock Station
  console.log('10. Locking Stylist Station...');
  await clickVisible(page, 'button', 'Lock Station');
  await sleep(1000);

  // 11. Manager Portal Login
  console.log('11. Opening Manager Login...');
  await page.click('button[aria-label="Toggle Navigation Menu"]');
  await sleep(500);
  await clickVisible(page, 'button', 'Manager');
  await sleep(600);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '10_manager_login_modal.png') });

  // Enter Manager Password LuxeCut@2026
  const passwordInput = await page.$('input[placeholder*="Enter salon password"], input[placeholder*="Enter password"]');
  if (passwordInput) {
    await passwordInput.type('LuxeCut@2026');
    await sleep(300);
    const enterBtn = await page.$('button[type="submit"]');
    if (enterBtn) await enterBtn.click();
    await sleep(1500);
  }

  // 12. Manager Admin Dashboard on Mobile
  console.log('12. Capturing Manager Admin Dashboard with Mobile Cards...');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '11_manager_dashboard_mobile_cards.png') });

  // 13. Switch to Chairs & Queue tab
  console.log('13. Switching to Chairs & Queue tab...');
  await clickVisible(page, 'button', 'Chairs & Queue');
  await sleep(1000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '12_manager_chairs_queue_board.png') });

  // 14. Booking Wizard Flow
  console.log('14. Opening Booking Wizard...');
  await page.click('button[aria-label="Toggle Navigation Menu"]');
  await sleep(400);
  await clickVisible(page, 'button', 'Services & Treatments');
  await sleep(500);

  // Click Book Now button
  await clickVisible(page, 'button', 'Book');
  await sleep(800);
  console.log('15. Capturing Step 1: Services...');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '13_booking_wizard_step1_services.png') });

  // Continue to Step 2
  await clickVisible(page, 'button', 'Continue');
  await sleep(600);

  // Select first stylist and continue
  const stylistOption = await page.$('.modal-content .grid button, .modal-content button');
  if (stylistOption) await stylistOption.click();
  await sleep(300);
  await clickVisible(page, 'button', 'Continue');
  await sleep(600);

  // Step 3: Date & Time
  console.log('16. Capturing Step 3: Date & Time with horizontal swipeable pills...');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '14_booking_wizard_step3_date_time.png') });

  // Continue to Step 4
  await clickVisible(page, 'button', 'Continue');
  await sleep(600);

  // Fill in customer details
  console.log('17. Filling customer details and confirming...');
  const nameInput = await page.$('input[placeholder*="Kavindi Perera"]');
  if (nameInput) await nameInput.type('Sarah Jenkins');
  const emailInput = await page.$('input[placeholder*="kavindi@example.lk"]');
  if (emailInput) await emailInput.type('sarah@example.com');
  const phoneInput = await page.$('input[placeholder*="+94 77 123 4567"]');
  if (phoneInput) await phoneInput.type('+94 77 987 6543');
  await sleep(400);

  // Click Confirm Reservation
  await clickVisible(page, 'button', 'Confirm Reservation');
  await sleep(1500);

  // 18. Digital Pass on Mobile
  console.log('18. Capturing Digital Pass Modal on Mobile...');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '15_mobile_digital_pass_ticket.png') });

  await browser.close();
  console.log('ALL 15 MOBILE SCREENS RECORDED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('Flow recording error:', err);
  process.exit(1);
});
