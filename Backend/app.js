const express = require('express');
const app = express()
const { connectedDB } = require('./DB/connectDB');
const cors = require('cors')
const morgan = require('morgan')
const route = require('./Router/index')



connectedDB()
app.use(express.json());
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))

// routes
app.use(route)


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(8000, () => {
    console.log(`Server is running on port http://localhost:8000`);
});