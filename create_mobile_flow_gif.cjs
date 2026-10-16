const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const GIFEncoder = require('gif-encoder-2');

const ARTIFACTS_DIR = 'C:\\Users\\admin\\.gemini\\antigravity-ide\\brain\\ae0cf33a-27ab-4f2b-ae48-a38ad7e3e625';

const frames = [
  { name: '01_mobile_home.png', delay: 1800, label: '1. Mobile Home Page' },
  { name: '02_mobile_menu_drawer.png', delay: 1400, label: '2. Mobile Navigation Drawer' },
  { name: '03_stylist_login_modal.png', delay: 1600, label: '3. Stylist PIN Keypad' },
  { name: '04_stylist_station_dashboard.png', delay: 2000, label: '4. Alex Vance Chair Station' },
  { name: 'test_01_add_slot_modal.png', delay: 2200, label: '5. Stylist Adds Slot & Booking Modal' },
  { name: 'test_02_slot_added_in_grid.png', delay: 2200, label: '6. Slot 07:15 PM in Timetable Grid' },
  { name: 'test_03_stylist_my_bookings.png', delay: 2200, label: '7. Roshan in Stylist My Bookings' },
  { name: '05_stylist_status_in_chair.png', delay: 1500, label: '8. In-Chair Status Toggle' },
  { name: '06_seat_walkin_modal.png', delay: 1600, label: '9. Seat Walk-In Guest Modal' },
  { name: '07_walkin_seated_in_chair.png', delay: 2000, label: '10. Maya Perera Seated in Slot' },
  { name: '08_queue_hold_active.png', delay: 1800, label: '11. Next Slot Reserved for Queue' },
  { name: '09_stylist_profile_shifts.png', delay: 1800, label: '12. Stylist Shifts & Timetable' },
  { name: '10_manager_login_modal.png', delay: 1500, label: '13. Manager Access Portal' },
  { name: 'test_04_manager_master_schedule.png', delay: 2400, label: '14. Stylist Added Slot in Manager Schedule' },
  { name: 'test_05_manager_chairs_queue.png', delay: 2400, label: '15. Added Slot in Chairs & Queue Board' },
  { name: '13_booking_wizard_step1_services.png', delay: 1800, label: '16. Step 1: Service Catalog' },
  { name: '14_booking_wizard_step3_date_time.png', delay: 2000, label: '17. Step 3: Swipeable Date & Slot' },
  { name: '15_mobile_phone_message_confirmation.png', delay: 2800, label: '18. Phone Confirmation & Direct Message (No QR)' }
];

// Downsample 2x helper (780x1688 -> 390x844)
function downsample2x(srcPng) {
  const targetW = Math.floor(srcPng.width / 2);
  const targetH = Math.floor(srcPng.height / 2);
  const outBuffer = Buffer.alloc(targetW * targetH * 4);

  for (let y = 0; y < targetH; y++) {
    for (let x = 0; x < targetW; x++) {
      const srcX = x * 2;
      const srcY = y * 2;
      const srcIdx = (srcY * srcPng.width + srcX) * 4;
      const outIdx = (y * targetW + x) * 4;

      outBuffer[outIdx] = srcPng.data[srcIdx];         // R
      outBuffer[outIdx + 1] = srcPng.data[srcIdx + 1]; // G
      outBuffer[outIdx + 2] = srcPng.data[srcIdx + 2]; // B
      outBuffer[outIdx + 3] = srcPng.data[srcIdx + 3]; // A
    }
  }

  return { width: targetW, height: targetH, data: outBuffer };
}

async function buildGif() {
  console.log('Reading first frame to configure encoder...');
  const firstFramePath = path.join(ARTIFACTS_DIR, frames[0].name);
  const firstData = fs.readFileSync(firstFramePath);
  const firstPng = PNG.sync.read(firstData);
  const downsampledFirst = downsample2x(firstPng);

  const width = downsampledFirst.width;
  const height = downsampledFirst.height;

  console.log(`Configuring GIF Encoder at ${width}x${height}...`);
  // Use octree algorithm with 256 colors for high visual fidelity
  const encoder = new GIFEncoder(width, height, 'octree', false);
  encoder.setRepeat(0); // 0 = loop forever
  encoder.setQuality(10); // 10 is default good balance

  const outputPath = path.join(ARTIFACTS_DIR, 'mobile_flow_recording.gif');
  const writeStream = fs.createWriteStream(outputPath);
  encoder.createReadStream().pipe(writeStream);

  encoder.start();

  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    console.log(`Processing frame ${i + 1}/${frames.length}: ${f.label}`);
    const filePath = path.join(ARTIFACTS_DIR, f.name);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    const fileBuf = fs.readFileSync(filePath);
    const png = PNG.sync.read(fileBuf);
    const downsampled = downsample2x(png);

    encoder.setDelay(f.delay);
    encoder.addFrame(downsampled.data);
  }

  encoder.finish();

  await new Promise(resolve => writeStream.on('finish', resolve));

  const stats = fs.statSync(outputPath);
  console.log(`\n🎉 Animated GIF successfully created!`);
  console.log(`Output: ${outputPath}`);
  console.log(`Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
}

buildGif().catch(err => {
  console.error('Error creating GIF:', err);
  process.exit(1);
});
