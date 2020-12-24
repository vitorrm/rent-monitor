const { EmailSender } = require('./lib/EmailSender');
const { House } = require('./lib/House');

const sender = new EmailSender();
sender.sendHouseUpdateEmail({
    newHouses: [
            new House({ url: 'testA' }),
            new House({ url: 'testB' }),
    ]
})