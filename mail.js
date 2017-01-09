var nodemailer = require('nodemailer');
var settings = require('./settings.json')

var smtpServer = settings["smtpServer"] || 'cws'

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtp://' + smtpServer);

// setup e-mail data with unicode symbols
var mailOptions = {
    from: settings["mailFrom"] || '"Server UPS Info" <sd@kombi-korm.ru>', // sender address
    to: settings["mailTo"] || 'mail2sms@mcommunicator.ru;ch1seL@ya.ru;salamatovae@kombi-korm.ru', // list of receivers
    subject: settings["mailSubject"] || 'Рассылка'
};

// send mail with defined transport object
module.exports.send = (temp, hum) => {
    teg = settings["mailTeg"] || '#repl';

    var newline = '\r\n'

    site = 'http://gkz.diskstation.me:15555';

    mailOptions.text = teg + newline +
        'Температура:' + temp + '°' + newline +
        'Влажность:' + hum + newline +
        site;
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}