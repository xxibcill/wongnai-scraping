const puppeteer = require('puppeteer');

(async () => {
    const luanchOptions = {
        headless : false
    }
    const browser = await puppeteer.launch(luanchOptions);
    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.screenshot({ path: 'example.png' });

    await browser.close();
})();