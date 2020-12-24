
const { House } = require('./House')

const operation = (list1, list2, isUnion = false) => 
    list1.filter( a => isUnion === list2.some( b => a.id === b.id ) );

const inBoth = (list1, list2) => operation(list1, list2, true),
      inFirstOnly = operation,
      inSecondOnly = (list1, list2) => inFirstOnly(list2, list1);

class EntriesChecker {
    
    constructor(storage) {
        this.storage = storage
    }

    async filterNewEntries(group, currentList) {
        const savedJson = await this.storage.read()
        const savedHouses = savedJson[group]
            .map((item) => new House( { id: item } ))
        return inSecondOnly(savedHouses, currentList)
    }
}

module.exports = {EntriesChecker};
