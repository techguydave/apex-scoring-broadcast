const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';


function generateRandomString() {
    let randomString = '';

    for (let i = 0; i < 5; i++) {
        randomString += characters[Math.floor(Math.random() * characters.length)];
    }

    return randomString;
}

module.exports = {
    generateRandomString,
}