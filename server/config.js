//!Postgres?
/* 
const mongoose = require("mongoose");
const connectString =
    "mongodb://mongo:HBCrdR1iKkMnPtppakKi@containers-us-west-44.railway.app:5800";

const connectToDb = async () => {
    return mongoose.connect(connectString, { useNewUrlParser: true });
}; */

require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");
const { Pool } = require("pg");
const supabaseUrl = process.env.DB_URL;
const supabaseKey = process.env.DB_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {db: {schema: 'public'}});

const pool = new Pool({
    connectionString: `${supabaseUrl}?apikey=${supabaseKey}`,
});

module.exports = supabase;
