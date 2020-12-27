const puppeteer = require('puppeteer')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const { OrtecPage } = require('./lib/OrtecPage')
const { Storage } = require('./lib/Storage')
const { EntriesChecker } = require('./lib/EntriesChecker')
const { EmailSender } = require('./lib/EmailSender')
const { ORTEC } = require('./constants/RealStates')

const scrape = async () => {
	const browser = await puppeteer.launch({
		headless: true,
		ignoreDefaultArgs: ['--disable-extensions'],
		args: ['--no-sandbox']
	})
	const page = new OrtecPage(browser)
	await page.open()
	const result = await page.getHouseList()
	browser.close()
	return result
}

const sendEmail = async ({ newItems, removedItems }) => {
	const sender = new EmailSender({
		user: argv.emailUser,
		pass: argv.emailPass
	})
	await sender.sendHouseUpdateEmail({
		newHouses: newItems,
		removedHouses: removedItems
	})
	sender.close()
}

const isNonEmptyList = (list) => list && list.length > 0

scrape().then(async (data) => {
	console.log('All Found:', data)
	const storage = new Storage('./workdir/houses.json')
	const newItems = await new EntriesChecker(storage).filterNewEntries(ORTEC, data)
	const removedItems = await new EntriesChecker(storage).filterRemovedEntries(ORTEC, data)
	console.log('New Items:', newItems)
	console.log('Removed Items:', removedItems)
	if (isNonEmptyList(newItems) || isNonEmptyList(removedItems)) {
		await sendEmail({ newItems, removedItems })
		await storage.save(ORTEC, {
			newItems: newItems.map((item) => item.id),
			removedItems: removedItems.map((item) => item.id)
		})
	}
})
