const mongoose = require('mongoose')

let connectedDB = () => {
    mongoose.connect('mongodb://localhost:27017/ecommerce')
        .then(() => {
            console.log("DB is Connected....");
        })
        .catch(() => {
            console.log("DB is not Connected..!");
        })
}

module.exports = { connectedDB }