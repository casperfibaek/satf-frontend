/* eslint-disable max-len */
// const puppeteer = require('puppeteer');

/*
  This script scrapes the Ghana Postal GPS (Ghana Digital Address) for a given point.
  It can go from latlng -> GPGPS and GPGPS --> latlng.

  It works by scraping the official website, which is not ideal.

  TODO: Rewrite to replicate the propriertary algorithm from AASE-GPS.
*/

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

async function latlng_to_gpgps(lat, lng) {
  try {
    const url = 'https://ghanapostgps.com/map/#A3-2107-0449';
    const page = await browser.newPage();
    page.on('dialog', async (dialog) => { dialog.accept(); });

    await page.goto(url);
    await page.waitForFunction('document.querySelector("#location-detail > div > .da-code").innerText !== "..."');
    const previousValue = await page.$eval('#location-detail > div > .da-code', (el) => el.innerText);

    await page.evaluate((lat, lng) => {
      const mev = { stop: null, latLng: new google.maps.LatLng(lat, lng) };
      google.maps.event.trigger(map, 'click', mev);
    }, lat, lng);

    await page.waitForFunction(`document.querySelector("#location-detail > div > .da-code").innerText !== "${previousValue}"`);

    const addresscode = await page.evaluate(() => app._data.addresscode);

    return `${addresscode.slice(0, 2)}-${addresscode.slice(2, 6)}-${addresscode.slice(6, 10)}`;
  } catch (err) {
    throw Error(err);
  }
}

(async () => {
  browser = await puppeteer.launch();
})();

module.exports = {
  gpgps_to_latlng,
  latlng_to_gpgps,
};
