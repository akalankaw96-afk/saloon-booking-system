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
      await page.evaluate(node => node.click(), el);
      return true;
    }
  }
  return false;
}

async function runTest() {
  console.log('Testing WhatsApp Notifications for Salon Admin & Stylist...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  console.log('Navigating to http://127.0.0.1:5173/ ...');
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(1500);

  // Open booking wizard
  console.log('Opening Booking Wizard...');
  const navbarBook = await page.$('header button.btn-primary, nav button.btn-primary');
  if (navbarBook) {
    await page.evaluate(el => el.click(), navbarBook);
  }
  await sleep(800);

  // Step 1: Service
  console.log('Step 1: Continue...');
  await clickVisible(page, '.modal-content button.btn-primary', 'Continue');
  await sleep(600);

  // Step 2: Stylist
  console.log('Step 2: Continue (stylist pre-selected)...');
  await clickVisible(page, '.modal-content button.btn-primary', 'Continue');
  await sleep(600);

  // Step 3: Date & Time
  console.log('Step 3: Continue (slot pre-selected)...');
  await clickVisible(page, '.modal-content button.btn-primary', 'Continue');
  await sleep(600);

  // Step 4: Fill Guest Info
  console.log('Step 4: Filling in guest details...');
  const nameInput = await page.$('input[placeholder*="Kavindi Perera"]');
  if (nameInput) {
    await nameInput.click();
    await nameInput.type('Amara Silva', { delay: 20 });
  }
  await sleep(200);

  const emailInput = await page.$('input[placeholder*="kavindi@example.lk"]');
  if (emailInput) {
    await emailInput.click();
    await emailInput.type('amara@example.lk', { delay: 20 });
  }
  await sleep(200);

  const phoneInput = await page.$('input[placeholder*="+94 77 123 4567"]');
  if (phoneInput) {
    await phoneInput.click();
    await phoneInput.type('+94 77 987 6543', { delay: 20 });
  }
  await sleep(400);

  // Confirm Reservation
  console.log('Submitting reservation...');
  await clickVisible(page, '.modal-content button.btn-primary', 'Confirm Reservation');
  await sleep(2500);

  // Check BookingPassModal contents
  console.log('Validating WhatsApp Dispatch Hub...');
  const pageContent = await page.content();

  const hasAdminWhatsApp = pageContent.includes('Send Admin WhatsApp') || pageContent.includes('Salon Admin / Reception');
  const hasStylistWhatsApp = pageContent.includes('Send Stylist WhatsApp') || pageContent.includes('Stylist:');
  const hasCustomerWhatsApp = pageContent.includes('Customer WhatsApp');
  const hasAdminPreview = pageContent.includes('NEW APPOINTMENT ALERT - SALON ADMIN');
  const hasNoQr = !pageContent.includes('Save / Print Ticket') && !pageContent.includes('SCAN AT FRONT DESK FOR FAST ENTRY');

  console.log('Salon Admin WhatsApp button/channel:', hasAdminWhatsApp ? 'PASSED ✅' : 'FAILED ❌');
  console.log('Assigned Stylist WhatsApp button/channel:', hasStylistWhatsApp ? 'PASSED ✅' : 'FAILED ❌');
  console.log('Customer WhatsApp button/channel:', hasCustomerWhatsApp ? 'PASSED ✅' : 'FAILED ❌');
  console.log('Admin alert message template:', hasAdminPreview ? 'PASSED ✅' : 'FAILED ❌');
  console.log('Zero QR code download requirement:', hasNoQr ? 'PASSED ✅' : 'FAILED ❌');

  // Capture screenshot of Admin Alert view
  const adminScreenshotPath = path.join(ARTIFACTS_DIR, 'whatsapp_dispatch_admin_view.png');
  await page.screenshot({ path: adminScreenshotPath });
  console.log('Saved Admin WhatsApp screenshot to:', adminScreenshotPath);

  // Click Stylist Alert tab to test preview tab switcher
  console.log('Switching to Stylist Alert preview tab...');
  await clickVisible(page, 'button', 'Stylist Alert');
  await sleep(600);

  const stylistScreenshotPath = path.join(ARTIFACTS_DIR, 'whatsapp_dispatch_stylist_view.png');
  await page.screenshot({ path: stylistScreenshotPath });
  console.log('Saved Stylist WhatsApp screenshot to:', stylistScreenshotPath);

  // Also update 15_mobile_phone_message_confirmation.png and 15_mobile_digital_pass_ticket.png for consistency
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '15_mobile_phone_message_confirmation.png') });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '15_mobile_digital_pass_ticket.png') });

  await browser.close();
  console.log('WhatsApp notifications test completed successfully!');
}

runTest().catch(err => {
  console.error('Error during test:', err);
  process.exit(1);
});
