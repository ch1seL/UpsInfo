var nodemailer = require('nodemailer');

module.exports.send = (temp, hum) => {
    var settings = require('./settings.json');

    var teg = settings.mailTeg || '#repl';
    var site = settings.site || 'http://gkz.diskstation.me:15555';
    var newline = '\r\n'
    var mailOptions = {
        from: settings.mailFrom || '"Server UPS Info" <sd@kombi-korm.ru>', // sender address
        to: settings.mailTo || 'mail2sms@mcommunicator.ru;ch1seL@ya.ru;salamatovae@kombi-korm.ru', // list of receivers
        subject: settings.mailSubject || 'Рассылка',
        text: teg + newline +
            'Температура:' + temp + '°' + newline +
            'Влажность:' + hum + newline +
            site
    };

    var smtpServer = settings.smtpServer || 'cws'
    var transporter = nodemailer.createTransport('smtp://' + smtpServer);
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) return console.log(error);
        console.log('Message sent: ' + info.response);
    });
}