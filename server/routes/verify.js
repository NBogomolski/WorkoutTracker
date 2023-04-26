const router = require("express").Router();
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "/./../.env" });

function verifyJWT(req, res, next) {
    // Get the token from the request headers
    console.log(req.headers['authorization'])
    const token = req.headers["authorization"] //|| req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        // Verify the token with the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log('--decoded: ', decoded);
        if (req.method in ['POST', 'PUT']) {
            req.body.userId = decoded.userId;
        }
        else if (req.method == 'GET')
            req.query.id = decoded.userId;
        else
            req.params.id = decoded.userId;
        // console.log(req.url);
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
}

module.exports = verifyJWT