const { EmailSender } = require('./lib/EmailSender');
const { House } = require('./lib/House');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const sender = new EmailSender({
    user: argv.emailUser,
    pass: argv.emailPass
});

sender.sendHouseUpdateEmail({
    newHouses: [
            new House({ url: 'testA' }),
            new House({ url: 'testB' }),
    ]
})
