const router = require('express').Router()
const DB = require("../config");
const jwt = require("jsonwebtoken");

const bcrypt = require('bcrypt')
require("dotenv").config({path: __dirname+'/./../.env'});


const saltRounds = 10

router.post('/register', async (req, res, next) => {
    const {username, password} = req.body

    console.log(username, password)

    const exists = await (await DB.from('users').select('*').eq('username', username))
    console.log(exists)
    if (exists.error) {
        console.error(exists.error)
        return res.sendStatus(500);
    }
    if (exists.data.length > 0) return res.status(400).json({ error: "User already exists" });
/*     bcrypt.hash(password, saltRounds, async (err, hash) => {
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
       res.status(201).json({message: 'Successfully registered'})
    }) */
    // res.json({body: hashedPassword})
    

})

router.post("/login", async (req, res) => {
    console.log("token cookie:", req.headers["set-cookie"], req.cookies.token);
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
        bcrypt.compare(password, userData[0].password, (comparisonErr, match) => {
            if (comparisonErr) console.error(comparisonErr)
            else {
                if (match) res.status(200)
                else
                    return res.status(400).json({ message: "Passwords don't match" });
            }
        });
    }
    else
        return res.sendStatus(404)


    //TODO: SEND COOKIE WITH JWT TOKEN
    // console.log()
    if (res.statusCode === 200) {
        const token = jwt.sign({ userId: userData[0].id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "30min",
        });
        res.header("Access-Control-Allow-Credentials", "true")
        
        // res.cookie("token", token, { httpOnly: true, maxAge: 30*24*60*60*1000 }).sendStatus(200);
        res.header('Authorization', 'Bearer ' + token).sendStatus(200)
        // res.cookie('huinia', 'kuki')
        // console.log("cookie sent", res);
    }

    
})

module.exports = router