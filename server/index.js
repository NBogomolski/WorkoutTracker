const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const ServerPORT = 5000;

app.get('/api', function (req, res, next) {
    res.json({payload: 'Hello world!'});
});

app.post('/new-workout', (req, res, next) => {
    console.log(req.headers['content-type']);
    res.json(req.body)
})


app.listen(ServerPORT, () => {
    console.log('listening on port ' + ServerPORT)
})