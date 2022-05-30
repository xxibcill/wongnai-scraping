const puppeteer = require('puppeteer');
const fs = require('fs');

const luanchOptions = {
    headless : false,
    args:[
        '--start-maximized' // can also use '--start-fullscreen'
    ]
}

const getBrowserInstance = async (luanchOptions) => {
    return puppeteer.launch(luanchOptions);
}

const run = async () => {
    const url = 'https://www.wongnai.com/recipes?sort.type=1';
    const browser = await getBrowserInstance(luanchOptions);

    const page = await browser.newPage();
    await page.setViewport({
        width: 2560,
        height: 1440,
        deviceScaleFactor: 1,
    });

    await page.goto(url, {waitUntil: 'networkidle2'});

    const contentSelector = '#body > div > div > div > div> div > div:nth-child(2)'
    const contentElement = await page.$(contentSelector);
    // console.log(contentElement);

    let headerAmount;
    headerAmount = await page.evaluate((sel) => (document.querySelectorAll(`${sel} h2`).length), contentSelector);
    console.log(headerAmount);

    for (let index = 0; index < 2; index++) {
        const [button] = await page.$x("//button[contains(., 'Show More')]");
        if (button) {
            await button.click();
        }
    
        await page.waitForTimeout(1000);
        console.log(await page.evaluate((sel) => (document.querySelectorAll(`${sel} h2`).length), contentSelector));
        
    }

    let header = await page.evaluate((sel) => {
        // selectall h1 in content
        let recipes = [];
        document.querySelectorAll(`${sel} h2`).forEach(el => recipes.push({header : el.innerText}));
        document.querySelectorAll(`${sel} .ownerName`).forEach((el,index) => {recipes[index].ownerName = el.innerText});
        document.querySelectorAll(`${sel} h2 > a`).forEach((el,index) => {recipes[index].url = el.href});
        return recipes;
    }, contentSelector);

    // console.log(header);
    fs.writeFileSync("./header.json",JSON.stringify(header));

    // await page.screenshot({ path: 'example.png' });

    await browser.close();
}

run()