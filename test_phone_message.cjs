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
  console.log('Testing Phone Confirmation Messaging (No QR download)...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  console.log('Navigating to http://127.0.0.1:5173/ ...');
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(1500);

  // Open booking wizard using the mobile navbar Book button or menu
  console.log('Opening Booking Wizard...');
  const navbarBook = await page.$('header button.btn-primary, nav button.btn-primary');
  if (navbarBook) {
    console.log('Found navbar book button, clicking...');
    await page.evaluate(el => el.click(), navbarBook);
  } else {
    console.log('Opening mobile menu first...');
    await page.click('button[aria-label="Toggle Navigation Menu"]');
    await sleep(400);
    await clickVisible(page, 'button', 'Book');
  }
  await sleep(1000);

  const wizardModal = await page.$('.modal-content');
  console.log('Wizard modal open:', !!wizardModal);

  // Step 1: Select first service and Continue
  console.log('Step 1: Continue...');
  await clickVisible(page, '.modal-content button.btn-primary', 'Continue');
  await sleep(600);

  // Step 2: Choose stylist and Continue
  console.log('Step 2: Continue (stylist pre-selected)...');
  await clickVisible(page, '.modal-content button.btn-primary', 'Continue');
  await sleep(600);

  // Step 3: Date & Time Continue
  console.log('Step 3: Continue (slot pre-selected)...');
  await clickVisible(page, '.modal-content button.btn-primary', 'Continue');
  await sleep(600);

  // Step 4: Enter Guest Info
  console.log('Step 4: Filling in guest details...');
  const nameInput = await page.$('input[placeholder*="Kavindi Perera"]');
  if (nameInput) {
    await nameInput.click();
    await nameInput.type('Kavindi Perera', { delay: 20 });
  }
  await sleep(200);

  const emailInput = await page.$('input[placeholder*="kavindi@example.lk"]');
  if (emailInput) {
    await emailInput.click();
    await emailInput.type('kavindi@example.lk', { delay: 20 });
  }
  await sleep(200);

  const phoneInput = await page.$('input[placeholder*="+94 77 123 4567"]');
  if (phoneInput) {
    await phoneInput.click();
    await phoneInput.type('+94 77 123 4567', { delay: 20 });
  }
  await sleep(500);

  // Confirm Reservation
  console.log('Submitting reservation...');
  const confirmClicked = await clickVisible(page, '.modal-content button.btn-primary', 'Confirm Reservation');
  console.log('Confirm Reservation clicked:', confirmClicked);
  await sleep(2500);

  // Capture Phone Message Confirmation Modal
  console.log('Checking Phone Message Confirmation Modal (No QR code)...');
  const pageContent = await page.content();

  const hasNoQrDownload = !pageContent.includes('Save / Print Ticket') && !pageContent.includes('SCAN AT FRONT DESK FOR FAST ENTRY');
  const hasPhoneMessage = pageContent.includes('Send Confirmation to My WhatsApp') || pageContent.includes('Send via SMS');
  const hasSalonBranding = pageContent.includes('LUXECUT STUDIO') || pageContent.includes('LUXECUT');
  const hasMessagePreview = pageContent.includes('APPOINTMENT CONFIRMATION') || pageContent.includes('Direct Phone Message Prepared');

  console.log('Zero QR Code / Download QR requirement:', hasNoQrDownload ? 'PASSED ✅' : 'FAILED ❌');
  console.log('Phone WhatsApp / SMS messaging buttons:', hasPhoneMessage ? 'PASSED ✅' : 'FAILED ❌');
  console.log('Particular salon details in message:', hasSalonBranding ? 'PASSED ✅' : 'FAILED ❌');
  console.log('Message text preview for phone:', hasMessagePreview ? 'PASSED ✅' : 'FAILED ❌');

  const screenshotPath = path.join(ARTIFACTS_DIR, '15_mobile_phone_message_confirmation.png');
  await page.screenshot({ path: screenshotPath });
  // Also update 15_mobile_digital_pass_ticket.png so GIF reflects the new phone message confirmation
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '15_mobile_digital_pass_ticket.png') });
  console.log('Saved screenshot to:', screenshotPath);

  await browser.close();
  console.log('Test completed successfully!');
}

runTest().catch(err => {
  console.error('Error during test:', err);
  process.exit(1);
});
