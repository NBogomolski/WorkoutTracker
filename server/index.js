const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const connectToDB = require('./config')

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const ServerPORT = 5000;

app.get('/', function (req, res, next) {
    res.json({payload: 'Hello world!'});
});

app.post('/new-workout', (req, res, next) => {
    console.log(req.headers['content-type']);
    res.json(req.body)
})


// connectToDB.then( () => {
    app.listen(ServerPORT, () => {
        console.log("listening on port " + ServerPORT);
    })
    // .catch((err) => {
        // console.error(err);
    // });
// })
