(async () => {
    const { EmailSender } = require('./lib/EmailSender');
    const { House } = require('./lib/House');
    const yargs = require('yargs/yargs')
    const { hideBin } = require('yargs/helpers')
    const argv = yargs(hideBin(process.argv)).argv

    const sender = new EmailSender({
        user: argv.emailUser,
        pass: argv.emailPass
    });

    await sender.sendHouseUpdateEmail({
        newHouses: [
            new House({
                id: '/alugar/sp/leme/jardim-adelina/casa/3312477',
                url: 'https://www.ortec-imoveis.com.br/alugar/sp/leme/jardim-adelina/casa/3312477',
                img: 'https://cdn.uso.com.br/12602/2020/12/135020205.jpg',
                value: 'R$ 300,00',
                location: 'JARDIM ADELINA - LEME/SP'
              }),
            new House({
                id: '/alugar/sp/leme/centro/casa/68651938',
                url: 'https://www.ortec-imoveis.com.br/alugar/sp/leme/centro/casa/68651938',
                img: 'https://cdn.uso.com.br/12602/2020/10/127209449.jpg',
                value: 'R$ 3.500,00',
                location: 'CENTRO - LEME/SP'
              },
        ]
    })

    sender.close()

})()
