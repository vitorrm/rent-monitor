const { ORTEC_DOMAIN } = require('../constants/Pages')

const INITIAL_PAGE = `${ORTEC_DOMAIN}/alugar/sp/leme/casa/valor-min_0/area-min_0/ordem-valor/resultado-crescente/quantidade-48/`

const NEXT_BTN = "a.page-link[aria-label=Next]"

async function parseHouses(page) {
    return await page.evaluate(() => {
        const houses = []
        document.querySelectorAll('.resultado_lista > a')
            .forEach((house) => houses.push(house.getAttribute('href')))
        return houses
    })
}

class OrtecPage {
    constructor(browser) {
        this.browser = browser
    }

    async open() {
        this.page = await this.browser.newPage()
        await this.page.goto(INITIAL_PAGE, { waitUntil: 'load', timeout: 0 })
    }

    async nextPage() {
        await this.page.click(NEXT_BTN)
        await this.page.waitForTimeout(4000)
    }

    async hasNext() {
        return await this.page.$(NEXT_BTN) !== null
    }

    async getHouseList() {
        let result = []
        result = result.concat(await parseHouses(this.page))
        while(await this.hasNext()) {
            await this.nextPage()
            result = result.concat(await parseHouses(this.page))
        }
        return result
    }
}

module.exports = {OrtecPage};