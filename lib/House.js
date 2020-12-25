const { ORTEC_DOMAIN } = require('../constants/Pages')
const { ORTEC } = require('../constants/RealStates')

class House {
    constructor({id, group, img, value, location}) {
        this.id = id
        if(group == ORTEC) {
            this.url = ORTEC_DOMAIN + id
        }
        this.img = img
        this.value = value
        this.location = location
    }
}

module.exports = { House }