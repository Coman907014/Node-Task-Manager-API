const bcrypt = require('bcryptjs');

const userInputToHash = async (userInput) => {
        return await bcrypt.hash(userInput, 8)
    };
const  compareUserInputWithExistingPassword = async (userInput, existingPassword) => {
        return await bcrypt.compare(userInput, existingPassword)
    }


module.exports = {
    userInputToHash,
    compareUserInputWithExistingPassword
}