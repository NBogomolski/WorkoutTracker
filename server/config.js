//!Postgres?

const mongoose = require("mongoose");
const connectString =
    "mongodb://mongo:HBCrdR1iKkMnPtppakKi@containers-us-west-44.railway.app:5800";

const connectToDb = async () => {
    return mongoose.connect(connectString, { useNewUrlParser: true });
};

module.exports = connectToDb;
