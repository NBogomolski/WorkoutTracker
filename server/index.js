const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const connectToDb = require('./config')

app.use(cors({origin: "*"}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const ServerPORT = 5000;

const workouts = [
    { id: 1, title: "hello world" },
    { id: 2, title: "dva" },
];

app.get('/api/workouts', function (req, res, next) {
    res.json({workouts});
    console.log({workouts});
});

app.post('/new-workout', (req, res, next) => {
    console.log(req.headers['content-type']);
    workouts.push(req.body);
    // console.log(workouts);
    res.status(200)
})


// connectToDB.then( () => {
    app.listen(ServerPORT, () => {
        console.log("listening on port " + ServerPORT);
    })
    // .catch((err) => {
        // console.error(err);
    // });
// })
