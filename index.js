const puppeteer = require('puppeteer')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const { OrtecPage } = require('./lib/OrtecPage')
const { Storage } = require('./lib/Storage')
const { EntriesChecker } = require('./lib/EntriesChecker')
const { EmailSender } = require('./lib/EmailSender')

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

let sendEmail = async (newHouses) => {
    const sender = new EmailSender({
        user: argv.emailUser,
        pass: argv.emailPass
    });
    return await sender.sendHouseUpdateEmail({
        newHouses
    })
    sender.close()
}

scrape().then(async (data) => {
    console.log('All Found:', data)
    const storage = new Storage('./workdir/houses.json');
    const newItems = await new EntriesChecker(storage).filterNewEntries('ortec', data)
    console.log('New Items:', newItems)
    await sendEmail(newItems)
    if (newItems && newItems.length > 0) {
        await storage.save('ortec', newItems.map((item) => item.id))
    }
})