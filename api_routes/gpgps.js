/* eslint-disable max-len */
const puppeteer = require('puppeteer');

let browser;
let page;

async function gpgps_to_latlng(gpgps) {
  try {
    await page.evaluateOnNewDocument(() => {
      navigator.geolocation.getCurrentPosition = function (cb) {
        cb({
          coords: {
            accuracy: 21,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            latitude: 5.603717,
            longitude: -0.186964,
            speed: null,
          },
        });
      };
    });

    await page.goto('https://ghanapostgps.com/mapview.html');
    console.log('26');

    await page.waitForFunction('document.querySelector("#location-detail > div > .da-code").innerText.length > 0');
    console.log('29');
    const previousValue = await page.$eval('#location-detail > div > .da-code', (el) => el.innerText);

    await page.click('#addrsearch');
    await page.keyboard.type(gpgps);
    await page.keyboard.press('Enter');

    console.log('36');
    await page.waitForFunction(`document.querySelector("#location-detail > div > .da-code").innerText != '${previousValue}'`);
    console.log('38');

    const latlng = await page.$eval('.address-list > li.row:nth-child(7) > div.col > div.text-warning', (el) => el.innerText);
    console.log('41');

    return latlng;
  } catch (err) {
    console.log(err);
    return false;
  }
}

(async () => {
  browser = await puppeteer.launch();
  console.log('browser opened');
  page = await browser.newPage();
  console.log('page opened');
  page.setDefaultNavigationTimeout(0);

  const latlng = await gpgps_to_latlng('AK-761-5470');
  console.log(latlng);
  await browser.close();
})();
