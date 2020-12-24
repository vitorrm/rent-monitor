const puppeteer = require('puppeteer')
const { OrtecPage } = require('./lib/OrtecPage')
const { Storage } = require('./lib/Storage')
const { EntriesChecker } = require('./lib/EntriesChecker')

let scrape = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        ignoreDefaultArgs: ["--disable-extensions"],
        args: ["--no-sandbox"]
    })
    let page = new OrtecPage(browser)
    await page.open()
    const result = await page.getHouseList()
    browser.close()
    return result
}

scrape().then(async (data) => {
    console.log('All Found:', data)
    const storage = new Storage('./workdir/houses.json');
    const newItems = await new EntriesChecker(storage).filterNewEntries('ortec', data)
    console.log('New Items:', newItems)
    storage.save('ortec', newItems)
})