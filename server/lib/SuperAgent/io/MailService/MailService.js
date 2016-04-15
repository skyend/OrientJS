import Mailer from 'nodemailer';
var smtpTransport = require("nodemailer-smtp-transport");

class MailService {
  constructor(_config) {
    this.config = _config;
    console.log(_config);

    // Config frame
    // {
    //   "host": "smtp.gmail.com",
    //   "port": "587",
    //   "auth": {
    //     "user": "orientorbis@gmail.com",
    //     "pass": "dhfmqltmdhfldpsxm"
    //   }
    // }
  }

  connect() {
    // let url = '';
    // if (this.config.auth) {
    //   url += `${this.config.auth.user.replace('@', '%40')}:${this.config.auth.pass}@`;
    // }
    //
    // url += this.config.host;
    // if (this.config.port) {
    //   url += ':' + this.config.port;
    // }

    // var smtpTransport = Mailer.createTransport("SMTP", `smtps://${url}`);
    var smtpTransport = Mailer.createTransport(this.config);

    this.instance = smtpTransport;
  }

  // ejs 템플릿으로 email 전송 / req.app.get('views')
  sendMail(_to, _subject, _htmlText) {
    var mailOptions = {
      from: `ServiceBuilder Orbit <${this.config.auth.user}>`,
      to: _to,
      subject: _subject,
      html: _htmlText
    };

    agent.mailLog.info("Send : To: '%s', Subject '%s'", _to, _subject);

    this.instance.sendMail(mailOptions, function(error, response) {

      if (error) {
        agent.mailLog.error("SendError : To: '%s', Subject '%s' \nError:%s", _to, _subject, error);
      } else {
        console.log("Message sent : " + response.message);
      }
    });
  }
}

export default MailService;