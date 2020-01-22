
const sendGridAPIKey = process.env.SENDGRID_API_KEY;
const sgEmail = require('@sendgrid/mail');
sgEmail.setApiKey(sendGridAPIKey);

const sendWelcomeEmail = ( email, name ) => {
    return sgEmail.send({
        to: email,
        from: 'alexandru.coman@pitechnologies',
        subject: `Hello, ${name}. Welcome aboard!`,
        text: `Welcome to our app, ${ name }. Let us know how you get along with our app.`
    })
}


module.exports = sendWelcomeEmail
