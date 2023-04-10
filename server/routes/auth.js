const router = require('express').Router()
const DB = require("./config");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt')

app.post('/register', async (req, res, next) => {
    const {username, password} = req.body
    const exists = await DB.from('users').select('*').eq('username', username)
    if (exists.data.length === 0) return res.sendStatus(500).json()
    const hashedPassword = bcrypt.hash(password, 1, (err, hash) => {
        if (!err) return hash
        else console.error(err)
    })
    res.json(hashedPassword)
})

app.post("/login", (req, res) => {
    // Verify user credentials and generate JWT token
    const {username, password} = req.body
    // const username = req.body.username;
    // const password = req.body.password;

    if (username !== "user" || password !== "password") {
        return res.status(401).send("Invalid credentials").json();
    }

    const token = jwt.sign({ username }, secretKey);

    // Set HttpOnly cookie with token
    res.cookie("token", token, { httpOnly: true });

    res.send("Logged in successfully");
})

module.exports = router