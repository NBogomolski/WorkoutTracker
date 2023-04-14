const express = require('express');
const app = express();

const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const cors = require('cors');
const DB = require('./config')
const authRouter = require('./routes/auth')

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/auth', authRouter)

const ServerPORT = 5000;


app.get('/api/workouts', async function (req, res, next) {
    const userId = req.query.id
    console.log('userId', userId)
    let response = await DB.from("workouts").select("*").eq('userId', userId);
    console.log(response.data)
    if (response.data)
        res.json(response.data)
    else res.json([])

});

app.post('/api/new-workout', async (req, res, next) => {
    console.log(req.headers['content-type']);
    console.log(req.body)
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

