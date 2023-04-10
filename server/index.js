const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const DB = require('./config')
const authRouter = require('./routes/auth')

app.use(cors({origin: "*"}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', authRouter)

const ServerPORT = 5000;


app.get('/api/workouts', async function (req, res, next) {

    let response = await DB.from("workouts").select("*");
    // console.log(response.data)
    res.json(response.data)

});

app.post('/api/new-workout', async (req, res, next) => {
    console.log(req.headers['content-type']);
    // console.log(req.body)
    let exists = await DB.from("workouts").select('*').eq('title', req.body.title)
    if (exists.data.length > 0)
        return res.sendStatus(500)
    const rowCount = await (await DB.from('workouts').select('*')).data.length
    console.log(rowCount)
    let added = await DB.from("workouts").insert({id: rowCount+1,...req.body})
    res.json(added)
})

app.delete("/api/delete/:id", async (req, res, next) => {
    console.log(`Delete called id = ${req.params.id}`)
    // const exists = await DB.from("workouts").select("*").eq("id", req.params.id)
    // console.log(exists.data)
    // if(exists.data.length === 0) return res.status(404).json()

    let deleted = await DB.from("workouts").delete().eq("id", req.params.id)
    res.json(deleted)
});


app.listen(ServerPORT, () => {
    console.log("listening on port " + ServerPORT);
})

