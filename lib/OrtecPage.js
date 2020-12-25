const { ORTEC_DOMAIN } = require('../constants/Pages')
const { House } = require('./House')

const INITIAL_PAGE = `${ORTEC_DOMAIN}/alugar/sp/leme/casa/valor-min_0/area-min_0/ordem-valor/resultado-crescente/quantidade-48/`
const NEXT_BTN = "a.page-link[aria-label=Next]"

async function parseHouses(page) {
    const cards = await page.$$('.resultado_lista');
    const list = []

    for (let i = 0; i < cards.length; i++) {
        let img = await cards[i].$eval('.fotorama__active > img', i => i.getAttribute('src'));
        let href = await cards[i].$eval('a', a => a.getAttribute('href'));
        let value = await cards[i].$eval('.valor h5', i => i.innerText);
        let location = await cards[i].$eval('.localizacao > span', i => i.innerText);
        try {
            let sepValue = await cards[i].$eval('.sep_valor h5', i => i.innerText);
            if (sepValue) value = sepValue
        } catch (error) {}
        list.push({
            path: href,
            img,
            value,
            location
        })
    }

    return list.map((obj) => new House({
        id: obj.path,
        url: ORTEC_DOMAIN + obj.path,
        img: obj.img,
        value: obj.value,
        location: obj.location
    }))
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
        while (await this.hasNext()) {
            await this.nextPage()
            result = result.concat(await parseHouses(this.page))
        }
        return result
    }
}

module.exports = { OrtecPage };