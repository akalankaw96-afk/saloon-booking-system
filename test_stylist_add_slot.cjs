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

async function testFlow() {
  console.log('Testing Stylist Adding Slot and Bookings Display...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 400, height: 850, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  console.log('Navigating to http://127.0.0.1:5173/ ...');
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(1000);

  // 1. Open mobile drawer and click Stylist Access
  console.log('Opening mobile menu...');
  await page.click('button[aria-label="Toggle Navigation Menu"]');
  await sleep(500);
  await clickVisible(page, 'button', 'Stylist Access');
  await sleep(600);

  // 2. Select Alex Vance and enter PIN 1001
  console.log('Logging in as Alex Vance (PIN 1001)...');
  await clickVisible(page, '.modal-content button', 'Alex Vance');
  await sleep(200);

  const pinInput = await page.$('.modal-content input[type="password"], .modal-content input[type="text"]');
  if (pinInput) {
    await pinInput.type('1001');
    await sleep(200);
  }
  await clickVisible(page, '.modal-content button[type="submit"]', 'Unlock');
  await sleep(1500);

  // 3. Click "+ Add Slot / Booking"
  console.log('Clicking "+ Add Slot / Booking"...');
  const addSlotBtnClicked = await clickVisible(page, 'button', '+ Add Slot / Booking');
  if (!addSlotBtnClicked) throw new Error('Could not find "+ Add Slot / Booking" button');
  await sleep(800);

  // 4. Fill in Add Slot form: Direct Booking for Roshan Jayasinghe at 07:15 PM
  console.log('Filling in custom slot and booking details...');
  const customTimeInput = await page.$('.modal-content input[placeholder*="07:15 PM"]');
  if (customTimeInput) {
    await customTimeInput.type('07:15 PM');
  }

  const nameInput = await page.$('.modal-content input[placeholder*="Samantha Fernando"]');
  if (nameInput) {
    await nameInput.type('Roshan Jayasinghe');
  }

  const phoneInput = await page.$('.modal-content input[placeholder*="+94 77 123 4567"]');
  if (phoneInput) {
    await phoneInput.type('+94 77 111 2233');
  }

  await sleep(300);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'test_01_add_slot_modal.png') });

  // Submit
  console.log('Submitting Add Slot / Booking...');
  await clickVisible(page, '.modal-content button[type="submit"]', 'Confirm & Add to Bookings');
  await sleep(1500);

  // 5. Verify in Timetable Grid
  console.log('Verifying slot 07:15 PM in Timetable Grid...');
  const pageContent1 = await page.content();
  const hasRoshanInGrid = pageContent1.includes('Roshan Jayasinghe') && pageContent1.includes('07:15 PM');
  console.log('Roshan in Timetable Grid:', hasRoshanInGrid ? 'SUCCESS ✅' : 'FAILED ❌');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'test_02_slot_added_in_grid.png') });

  // 6. Switch to "My Bookings" tab in Stylist Station
  console.log('Switching to My Bookings sub-tab...');
  await clickVisible(page, 'button', 'My Bookings');
  await sleep(800);
  const pageContent2 = await page.content();
  const hasRoshanInMyBookings = pageContent2.includes('Roshan Jayasinghe') && pageContent2.includes('+94 77 111 2233');
  console.log('Roshan in Stylist My Bookings view:', hasRoshanInMyBookings ? 'SUCCESS ✅' : 'FAILED ❌');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'test_03_stylist_my_bookings.png') });

  // 7. Lock Station and login as Manager
  console.log('Locking station and logging in as Salon Manager...');
  await clickVisible(page, 'button', 'Lock Station');
  await sleep(800);

  await page.click('button[aria-label="Toggle Navigation Menu"]');
  await sleep(400);
  await clickVisible(page, 'button', 'Manager');
  await sleep(600);

  const pwdInput = await page.$('input[placeholder*="Enter salon password"], input[placeholder*="Enter password"]');
  if (pwdInput) {
    await pwdInput.type('LuxeCut@2026');
    await sleep(200);
    const enterBtn = await page.$('button[type="submit"]');
    if (enterBtn) await enterBtn.click();
    await sleep(1500);
  }

  // 8. Verify in Manager Master Schedule
  console.log('Verifying Roshan in Manager Master Schedule...');
  const pageContent3 = await page.content();
  const hasRoshanInManagerSchedule = pageContent3.includes('Roshan Jayasinghe') && pageContent3.includes('07:15 PM');
  console.log('Roshan in Manager Master Schedule:', hasRoshanInManagerSchedule ? 'SUCCESS ✅' : 'FAILED ❌');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'test_04_manager_master_schedule.png') });

  // 9. Verify in Chairs & Queue Board
  console.log('Switching to Chairs & Queue in Manager view...');
  await clickVisible(page, 'button', 'Chairs & Queue');
  await sleep(1000);
  const pageContent4 = await page.content();
  const hasRoshanInChairsBoard = pageContent4.includes('Roshan Jayasinghe') && pageContent4.includes('07:15 PM');
  console.log('Roshan in Manager Chairs & Queue Board:', hasRoshanInChairsBoard ? 'SUCCESS ✅' : 'FAILED ❌');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'test_05_manager_chairs_queue.png') });

  await browser.close();

  if (hasRoshanInGrid && hasRoshanInMyBookings && hasRoshanInManagerSchedule && hasRoshanInChairsBoard) {
    console.log('\n🎉 ALL VERIFICATION CHECKS PASSED PERFECTLY!');
  } else {
    console.warn('\n⚠️ Some verification checks did not match. Please review output.');
  }
}

testFlow().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
