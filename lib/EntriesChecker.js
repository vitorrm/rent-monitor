
const { House } = require('./House')

const operation = (list1, list2, isUnion = false) =>
	list1.filter(a => isUnion === list2.some(b => a.id === b.id))

// eslint-disable-next-line no-unused-vars
const inBoth = (list1, list2) => operation(list1, list2, true)
const inFirstOnly = operation
const inSecondOnly = (list1, list2) => inFirstOnly(list2, list1)

class EntriesChecker {
	constructor (storage) {
		this.storage = storage
	}

	async filterNewEntries (group, currentList) {
		const savedJson = await this.storage.read(group)
		const savedHouses = savedJson
			.map((item) => new House(group, item))
		return inSecondOnly(savedHouses, currentList)
	}

	async filterRemovedEntries (group, currentList) {
		const savedJson = await this.storage.read(group)
		const savedHouses = savedJson
			.map((item) => new House(group, item))
		return inFirstOnly(savedHouses, currentList)
	}
}

module.exports = { EntriesChecker }
