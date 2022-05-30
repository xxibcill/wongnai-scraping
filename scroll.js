const puppeteer = require('puppeteer');

(async () => {
    const url = 'https://www.wongnai.com/recipes';
    const browser = await puppeteer.launch({
        headless : false,
        args:[
            '--start-maximized' // can also use '--start-fullscreen'
        ]
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 2560,
        height: 1440,
        deviceScaleFactor: 1,
    });

    await page.goto(url, {waitUntil: 'networkidle2'});
    
    const [button] = await page.$x("//button[contains(., 'Show More')]");
    if (button) {
        await button.click();
    }
    await page.waitForTimeout(2000)

    // await browser.close();
})();