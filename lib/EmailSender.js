const nodemailer = require("nodemailer");
const Email = require('email-templates');

class EmailSender {
    constructor() {
        this.transporter = nodemailer.createTransport({
            pool: true,
            host: "smtp-relay.sendinblue.com",
            port: 587,
            secure: false,
            auth: {
                user: "",
                pass: ""
            }
        });

        this.transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });
    }

    close() {
        this.transporter.close()
    }

    async sendHouseUpdateEmail({ newHouses }) {
        const email = new Email({
            message: {
                from: 'vitor.rm@gmail.com'
            },
            send: true,
            transport: this.transporter,
            preview: true
        });
        try {
            return await email.send({
                template: 'houseNotification',
                message: {
                    to: 'vitor.rm@gmail.com'
                },
                locals: {
                    newHouses
                }
            })
        } catch (error) {
            console.error(error)
            return null
        }
    }
}
module.exports = { EmailSender }