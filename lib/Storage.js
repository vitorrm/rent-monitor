const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

class Storage {
	constructor (fileName) {
		this.fileName = fileName
		const adapter = new FileSync(fileName)
		this.db = low(adapter)
		this.db.defaults({ ortec: [] })
			.write()
	}

	read (group) {
		return this.db
			.defaults([])
			.get(group)
			.value()
	}

	save (group, { newItems = [], removedItems = [] }) {
		const removedIds = removedItems.map((item) => item.id)
		let json = this.read(group)
		json = json.concat(newItems)
		json = json.filter((el) => !removedIds.includes(el.id))
		this.db.set(group, json)
			.write()
	}
}

module.exports = { Storage }
