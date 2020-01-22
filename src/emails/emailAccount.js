
const sendGridAPIKey = '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';
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
