const { validationResult } = require('express-validator')
const Cryptojs = require('crypto-js')
const { asyncQuery } = require('../helper/query')

const secret_key = process.env.SECRET_KEY
module.exports = {
    login: async (req, res) => {
        // cek pake req.param??
        const { username, password, email } = req.body
        console.log(username, password, email)
        try {
            // check user
            if (username) {
                const query = `SELECT * FROM users WHERE username = '${username}'`
                const result = await asyncQuery(query)
                if (result.length === 0) return res.status(500).send(`user with username : ${username} does not exist`)
                if (result[0].status !== 1) return res.status(500).send(`user with username : ${username} does not active`)
                // check password
                const hash = Cryptojs.HmacMD5(password, secret_key)
                if (hash.toString() !== result[0].password) return res.status(400).send('Invalid password')
            } else if (email) {
                const query = `SELECT * FROM users WHERE email = '${email}'`
                const result = await asyncQuery(query)
                if (result.length === 0) return res.status(500).send(`email with username : ${email} does not exist`)
                if (result[0].status !== 1) return res.status(500).send(`user with email : ${email} does not active`)
                // check password
                const hash = Cryptojs.HmacMD5(password, secret_key)
                if (hash.toString() !== result[0].password) return res.status(400).send('Invalid password')
            }

            res.status(200).send('login successful')
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    register: async (req, res) => {
        const { username, password, confpassword, email } = req.body
        // check error
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array()[0].msg })

        // check password & confpassword
        if (password !== confpassword) return res.status(400).send('password does not match')

        // check username or email already registered or not
        const checkUser = `SELECT * FROM users WHERE username = '${username}' OR email = '${email}'`
        try {
            const resultCheck = await asyncQuery(checkUser)
            if (resultCheck.length > 0) return res.status(400).send('username or email is already exist')

            // encrypt password before inserting to database
            let hash = Cryptojs.HmacMD5(password, secret_key)

            // insert new user to database
            const addUser = `INSERT INTO users (username, email, password, role, status) VALUES ('${username}', '${email}', '${hash.toString()}', 'user', 1);`
            const newUser = await asyncQuery(addUser)

            // insert to profile database
            const new_userId = newUser.insertId
            const addProfile = `INSERT INTO profil (user_ID) VALUES ('${new_userId}');`
            const result = await asyncQuery(addProfile)
            console.log(result)
            res.status(200).send(result)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    activate: async (req, res) => {
        const id = parseInt(req.params.id)
        const checkId = `SELECT * FROM users WHERE id=${id};`
        try {
            // check user
            const checkUser = await asyncQuery(checkId)
            if (checkUser.length === 0) return res.status(500).send(`user with id : ${id} does not exist`)

            // check status
            if (checkUser[0].status === 1) return res.status(500).send(`user with id : ${id} already active`)
            if (checkUser[0].status === 3) return res.status(500).send(`user with id : ${id} cannot activate account`)

            // update status
            const query = `UPDATE users SET status=1 WHERE id=${id};`
            const result = await asyncQuery(query)
            return res.status(200).send(`user with id : ${id} is activated`)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    deactivate: async (req, res) => {
        const id = parseInt(req.params.id)
        const checkId = `SELECT * FROM users WHERE id=${id};`
        try {
            // check user
            const checkUser = await asyncQuery(checkId)
            if (checkUser.length === 0) return res.status(500).send(`user with id : ${id} does not exist`)

            // check status
            if (checkUser[0].status !== 1) return res.status(500).send(`user with id : ${id} already de-active`)

            // update status
            const query = `UPDATE users SET status=2 WHERE id=${id};`
            const result = await asyncQuery(query)
            return res.status(200).send(`user with id : ${id} is de-activated`)
        } catch (err) {

        }
    },
    close: async (req, res) => {
        const id = parseInt(req.params.id)
        const checkId = `SELECT * FROM users WHERE id=${id};`
        try {
            // check user
            const checkUser = await asyncQuery(checkId)
            if (checkUser.length === 0) return res.status(500).send(`user with id : ${id} does not exist`)

            // check status
            if (checkUser[0].status === 3) return res.status(500).send(`user with id : ${id} already close account`)

            // update status
            const query = `UPDATE users SET status=3 WHERE id=${id};`
            const result = await asyncQuery(query)
            return res.status(200).send(`user with id : ${id} is closed`)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    }
}