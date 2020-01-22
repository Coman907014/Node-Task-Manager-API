
const sendGridAPIKey = process.env.SENDGRID_API_KEY;;
const sgEmail = require('@sendgrid/mail');
sgEmail.setApiKey(sendGridAPIKey);

const sendTaskCreatedEmail = ( email, name, taskID, taskDescription ) => {
    return sgEmail.send({
        to: email,
        from: 'alexandru.coman@pitechnologies',
        subject: `${name}, your task was created.`,
        text: `Hello, ${ name }. Your task was created!`,
        html: `
        <h3> Hello, ${ name }</h3>
        <p>Your new task was just created!</p>
        <br>
        <p><strong>Task Description</strong></p>
        <p> ${ taskDescription }
        <p><strong>Task Id</strong></p>
        <p> ${ taskID } </p>
        
        See you!
        The Team`
    })
}

module.exports = sendTaskCreatedEmail
