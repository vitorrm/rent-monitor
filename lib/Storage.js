const fsPromises = require('fs').promises

class Storage {
	constructor (fileName) {
		this.fileName = fileName
	}

	async read () {
		if (this.savedJson) { return this.savedJson }

		const data = await fsPromises.readFile(this.fileName)
			.catch((err) => {
				console.error('Failed to read file', err)
				return '{"ortec":[]}'
			})
		this.savedJson = JSON.parse(data)
		return this.savedJson
	}

	async save (group, { newItems = [], removedItems = [] }) {
		const json = await this.read()
		json[group] = json[group].concat(newItems)
		json[group] = json[group].filter((el) => !removedItems.includes(el))

		await fsPromises.writeFile(this.fileName, JSON.stringify(json))
	}
}

module.exports = { Storage }
