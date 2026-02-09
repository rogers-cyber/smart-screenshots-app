const puppeteer = require("puppeteer");
const path = require("path");
const ensureDir = require("./utils/ensureDir");
const config = require("./config");

// Devices for screenshots
const devices = [
  { name: "desktop", width: 1366, height: 768 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "mobile", width: 375, height: 812 }
];

// Ensure output folder exists
ensureDir(config.outputDir);

(async () => {
  console.log(`📸 ${config.appName} started`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  for (const device of devices) {
    console.log(`➡ Capturing ${device.name}...`);

    await page.setViewport({
      width: device.width,
      height: device.height,
      deviceScaleFactor: config.options.deviceScaleFactor
    });

    await page.goto(config.url, { waitUntil: config.options.waitUntil });

    const filePath = path.join(config.outputDir, `${device.name}.png`);
    await page.screenshot({
      path: filePath,
      fullPage: config.options.fullPage
    });

    console.log(`✔ Saved ${filePath}`);
  }

  await browser.close();
  console.log("✅ All screenshots generated");
})();
