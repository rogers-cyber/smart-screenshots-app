const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const config = require("./config");
const devices = require("./utils/devices");
const ensureDir = require("./utils/ensureDir");

(async () => {
  console.log(`📸 ${config.appName} started`);

  ensureDir(config.outputDir);

  const browser = await puppeteer.launch({
    headless: "new"
  });

  const page = await browser.newPage();

  for (const device of devices) {
    console.log(`➡ Capturing ${device.name}`);

    await page.setViewport({
      width: device.width,
      height: device.height,
      deviceScaleFactor: config.options.deviceScaleFactor
    });

    await page.goto(config.url, {
      waitUntil: config.options.waitUntil
    });

    const filePath = path.join(
      config.outputDir,
      `${device.name}.png`
    );

    await page.screenshot({
      path: filePath,
      fullPage: config.options.fullPage
    });

    console.log(`✔ Saved ${filePath}`);
  }

  await browser.close();

  console.log("✅ All screenshots generated");
})();
