const router = require('express').Router()
const DB = require("../config");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt')

const saltRounds = 10

router.post('/register', async (req, res, next) => {
    const {username, password} = req.body
    const exists = await (await DB.from('users').select('*').eq('username', username))
    console.log(exists)
    if (exists.error) {
        console.error(exists.error)
        return res.sendStatus(500);
    }
    // return res.status(400).json({ error: "User already exists" });
    bcrypt.hash(password, saltRounds, async (err, hash) => {
       if (err) {
        console.error(err)
        res.sendStatus(500)
       }
       const { written, error: insertError } = await DB.from('users').insert({ username, password: hash })
       if (insertError) {
        console.error(insertError)
        return res.sendStatus(500)
       }
       console.log(written)
       res.status(201).json(written)
    })
    // res.json({body: hashedPassword})
})

router.post("/login", (req, res) => {
    // Verify user credentials and generate JWT token
    const {username, password} = req.body
    // const username = req.body.username;
    // const password = req.body.password;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) return res.sendStatus(500)
        bcrypt.compare(password, hash, function (err, result) {
            if (err) {
                console.error(err);
            } else if (result) {
                console.log("Passwords match!");
            } else {
                console.log("Passwords do not match!");
            }
        });

    })
    // if (username !== "user" || password !== "password") {
    //     return res.status(401).send("Invalid credentials").json();
    // }

    const token = jwt.sign({ username }, secretKey);

    // Set HttpOnly cookie with token
    res.cookie("token", token, { httpOnly: true });

    res.send("Logged in successfully");
})

module.exports = router