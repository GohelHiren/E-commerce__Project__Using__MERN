const mongoose = require('mongoose')

let connectedDB = () => {
    mongoose.connect(process.env.mondob_uri)
        .then(() => {
            console.log("DB is Connected....");
        })
        .catch(() => {
            console.log("DB is not Connected..!");
        })
}

module.exports = { connectedDB }