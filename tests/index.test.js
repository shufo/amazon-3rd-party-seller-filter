const puppeteer = require('puppeteer');

const EXTENSION_PATH = './';
const EXTENSION_ID = 'gmfbegokkdolaokghlfnohddllgbbohd';

let browser;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`
    ]
  });
});

afterEach(async () => {
  await browser.close();
  browser = undefined;
});

test('extension page exists', async () => {
  const page = await browser.newPage();
  await page.goto(`chrome://extensions/?id=${EXTENSION_ID}`);
});

test('status is initialized with true when startup', async () => {
  const page = await browser.newPage();
  await page.goto(`chrome://extensions/?id=${EXTENSION_ID}`);
  const workerTarget = await browser.waitForTarget(
    target => target.type() === 'service_worker'
  );
  const worker = await workerTarget.worker();

  const value = await worker.evaluate(() => {
    return chrome.storage.local.get('status');
  });

  expect(value).toEqual({ status: true });
});


test('go to amazon page with extension enabled', async () => {
  const page = await browser.newPage();
  await page.goto(`chrome://extensions/?id=${EXTENSION_ID}`);

  // find extension service worker and get it
  const extBackgroundTarget = await browser.waitForTarget(t => t.type() === 'service_worker');
  const extWorker = await extBackgroundTarget.worker();

  // evaluate chrome object in context of service worker:
  const tab = await extWorker.evaluate(async () => {
    chrome.storage.local.set({ status: true });
  })

  // load a page from which to click browser action, make it the active tab
  const amazonPage = await browser.newPage();

  // searchh 'イヤホン' on amazon.co.jp
  await amazonPage.goto('https://www.amazon.co.jp/s?k=%E3%82%A4%E3%83%A4%E3%83%9B%E3%83%B3&__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=PXLCG2XC16JV&sprefix=%E3%82%A4%E3%83%A4%E3%83%9B%E3%83%B3%2Caps%2C171&ref=nb_sb_noss_1');
  await amazonPage.bringToFront();
  const url = await amazonPage.url();
  const parsed = new URL(url);

  // assert that the search parameter is added
  expect(parsed.searchParams.get('rh')).toEqual('p_6:AN1VRQENFRJN5');
});

test('go to amazon page with extension disabled', async () => {
  const page = await browser.newPage();
  await page.goto(`chrome://extensions/?id=${EXTENSION_ID}`);

  // find extension service worker and get it
  const extBackgroundTarget = await browser.waitForTarget(t => t.type() === 'service_worker');
  const extWorker = await extBackgroundTarget.worker();

  // evaluate chrome object in context of service worker:
  const tab = await extWorker.evaluate(async () => {
    chrome.storage.local.set({ status: false });
  })

  // load a page from which to click browser action, make it the active tab
  const amazonPage = await browser.newPage();

  // searchh 'イヤホン' on amazon.co.jp
  await amazonPage.goto('https://www.amazon.co.jp/s?k=%E3%82%A4%E3%83%A4%E3%83%9B%E3%83%B3&__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=PXLCG2XC16JV&sprefix=%E3%82%A4%E3%83%A4%E3%83%9B%E3%83%B3%2Caps%2C171&ref=nb_sb_noss_1');
  await amazonPage.bringToFront();
  const url = await amazonPage.url();
  const parsed = new URL(url);

  // assert that the search parameter is not added
  expect(parsed.searchParams.get('rh')).toEqual(null);
});
