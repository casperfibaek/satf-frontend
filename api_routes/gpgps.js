/* eslint-disable max-len */
const puppeteer = require('puppeteer');

let browser;

async function gpgps_to_latlng(gpgps) {
  try {
    const url = `https://ghanapostgps.com/map/#${gpgps.replace(/-/g, '')}`;
    const page = await browser.newPage();
    page.on('dialog', async (dialog) => { dialog.accept(); });

    await page.goto(url);
    await page.waitForFunction('document.querySelector("#side-bar > div:nth-child(3) > ul > li:nth-child(7) > div.col > div.text-warning").innerText !== "..."');

    const latlng = await page.evaluate(() => [app._data.latitude, app._data.longitude]);
    return latlng;
  } catch (err) {
    throw Error('Unable to request Ghana Postal GPS.');
  }
}

(async () => {
  browser = await puppeteer.launch();
})();

module.exports = {
  gpgps_to_latlng,
};
