const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')

const app = express()
dotenv.config()

app.use(cors())
app.use(bodyParser.json())

const database = require ('./database')
// connect mysql
database.connect(err => {
    if (err) return console.log('error connection: ' + err.stack)
    console.log('connected as id : ' + database.threadId)
})

const {userRouter, proKatRouter, produkRouter} = require('./routers')
app.use('/api', userRouter)
app.use('/api', proKatRouter)
app.use('/api', produkRouter)

const PORT = 2000
app.listen(PORT, () => console.log(`this server is running on port ${PORT}`))