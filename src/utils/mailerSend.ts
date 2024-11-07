import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
import { EMAIL_SUBJECT, SENDER_EMAIL } from "./const";

const getEmailHTML = (uuid: string) => {
  return `<!DOCTYPE html>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
</head>

<body>
    <img src="https://api.qrserver.com/v1/create-qr-code/?data=${uuid}&amp;size=200x200" />
</body>

</html>`;
};

interface SendDrinkTicketEmailProps {
  recipent: string;
  uuid: string;
}

export const sendDrinkTicketEmail = async ({
  recipent,
  uuid,
}: SendDrinkTicketEmailProps) => {
  const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY!,
  });

  const sentFrom = new Sender(SENDER_EMAIL, "Sikajuhlat");
  const recipients = [new Recipient(recipent)];
  const html = getEmailHTML(uuid);
  const subject = EMAIL_SUBJECT;

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setHtml(html);

  await mailerSend.email.send(emailParams);
};
