"use strict";
const nodemailer = require('nodemailer');
const config = require('./../../data/config');


/**
 * Send mail and return promise.
 * @param content
 * @returns {Promise}
 * @private
 */
const _sendMail = (content, transporter) => {
    let _content = content;

    return new Promise((resolve, reject)=>{

        // send mail with defined transport object
        transporter.sendMail(_content, (error, info) => {
            if (error) {
                reject({
                    success: false,
                    message: "Sending email error",
                    errors: {
                        email: error
                    }
                });
            }
            resolve({
                success: true,
                message: "Mail sended with success",
                data: {
                    info: info
                }
            });
        });
    })
};
class Mail {
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: config.EMAIL_HOST,
            port: 465,
            secure: true, // secure:true for port 465, secure:false for port 587
            auth: {
                user: config.EMAIL_USERNAME,
                pass: config.EMAIL_PASSWORD
            }
        });
    };

    /**
     * Send mail confirmation at address.
     * @param content
     * @returns {Promise}
     */
    sendConfirmRegister(mail, userId, where){
        let content = {
            from: `"Aidly 👻" <${config.EMAIL_USERNAME}>`, // sender address
            to: ((config.TEST_MODE) ? `piotr.pietruszka@o2.pl, konrisz96@gmail.com` : mail), // list of receivers //TODO: change to mail value
            subject: 'Aidly - potwierdzenie rejestracji', // Subject line
            text: 'Hello world ?', // plain text body
            html: require("./templates/mailConfirmation.template")(userId, where) // html body
        };

        return _sendMail(content, this.transporter);
    };

    sendConfirmPasswordRecovery(mail, token){
        let content = {
            from: `"InStudy 👻" <${config.EMAIL_USERNAME}>`, // sender address
            to: ((config.TEST_MODE) ? `piotr.pietruszka@o2.pl, konrisz96@gmail.com` : mail), // list of receivers //TODO: change to mail value
            subject: 'inStudy - odzyskiwanie hasła', // Subject line
            text: 'Hello world ?', // plain text body
            html: require("./templates/mailPasswordRecovery.template")(token) // html body
        };

        return _sendMail(content, this.transporter);
    };
    sendNewPassword(){};
}

module.exports = Mail;