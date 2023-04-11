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
       const {error: insertError } = await DB.from('users')
                                                        .insert({ username, password: hash })
       if (insertError) {
            console.error(insertError)
            return res.sendStatus(500)
       }
    //    console.log(written)
       res.status(201).json({message: 'Successfully registered'})
    })
    // res.json({body: hashedPassword})
})

router.post("/login", async (req, res) => {
    // Verify user credentials and generate JWT token
    const {username, password} = req.body
    console.log('login:', req.body)
    const {data: userData, error: dbError} = await DB.from('users').select('*').eq('username', username)
    if (dbError) {
        console.error(dbError)
        res.sendStatus(500)
    }
    console.log('userData:', userData)
    if (userData.length > 0) {
        // console.log(userData[0], password)
        bcrypt.compare(password, userData[0].password, (comparisonErr, match) => {
            if (comparisonErr) console.error(comparisonErr)
            else {
                if (match) return res.sendStatus(200)
                res.status(400).json({ message: "Passwords don't match" });
            }
        });
    }
    else
        res.sendStatus(404)
    // if (username !== "user" || password !== "password") {
    //     return res.status(401).send("Invalid credentials").json();
    // }
    // let secretKey = Process.env.SECRET_KEY
    // const token = jwt.sign({ username }, secretKey);

    // Set HttpOnly cookie with token
    // res.cookie("token", token, { httpOnly: true });
})

module.exports = router