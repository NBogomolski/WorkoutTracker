const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const DB = require('./config')

app.use(cors({origin: "*"}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const ServerPORT = 5000;


app.get('/api/workouts', async function (req, res, next) {

    let response = await DB.from("workouts").select("*");
    console.log(response.data)
    res.json(response.data)

});

app.post('/api/new-workout', async (req, res, next) => {
    console.log(req.headers['content-type']);
    // console.log(req.body)
    let exists = await DB.from("workouts").select('*').eq('title', req.body.title)
    console.log(exists)    
    if (exists.data.length > 0)
        return res.status(500)
    let added = await DB.from("workouts").insert(req.body)
    console.log(added)
    //TODO: add insertion for db
    res.status(added.status)
})

app.delete("/api/workouts/delete/:id", async (req, res, next) => {
    //TODO: add search in db for certain id and try to delete
    console.log(req.params.id)
    try {
        let deleted = await DB.from("workouts").delete().eq('id',req.params.id)
        if (deleted.error)
            res.status(404)
        console.log(deleted)
    } catch (error) {
        console.error(error)
    }
});


app.listen(ServerPORT, () => {
    console.log("listening on port " + ServerPORT);
})

