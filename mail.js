var nodemailer = require('nodemailer');
var settings = require('./settings.json')

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtp://cws');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: settings["mailFrom"] || '"Server UPS Info" <sd@kombi-korm.ru>', // sender address
    to: settings["mailTo"] || 'mail2sms@mcommunicator.ru;ch1seL@ya.ru;salamatovae@kombi-korm.ru', // list of receivers
    subject: settings["mailSubject"] || 'Рассылка'
};

// send mail with defined transport object
module.exports.send = (temp) => {
    text = settings["mailText"] || '#repl Температура в серверной: ';
    mailOptions.text = text + temp;
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}