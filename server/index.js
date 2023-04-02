const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const DB = require('./config')

app.use(cors({origin: "*"}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const ServerPORT = 5000;

const workouts = [
    
];

app.get('/api/workouts', async function (req, res, next) {

    let response = await DB.from("workouts").select("*");
    console.log(response)
    res.json(response.data)
/*     DB
    .from('workouts')
    .select('title')
    .then(response => res.json(response)) */

    // DB.query('SELECT * FROM workouts')
    // .then(data => console.log(data))
});

app.post('/api/new-workout', (req, res, next) => {
    console.log(req.headers['content-type']);
    workouts.push({...req.body, id: workouts.length});
    // console.log(workouts);
    res.status(200)
})

app.delete("/api/workouts/delete/:id", (req, res, next) => {
    try {
        if (workouts.at(req.params.id)) {
            workouts.splice(req.params.id, 1)
            res.sendStatus(200)
        }
        res.status(500)
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});


app.listen(ServerPORT, () => {
    console.log("listening on port " + ServerPORT);
})

