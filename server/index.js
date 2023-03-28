const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const ServerPORT = 5000;

app.get('/api', function (req, res, next) {
    res.json({payload: 'Hello world!'});
});

app.listen(ServerPORT, () => {
    console.log('listening on port ' + ServerPORT)
})