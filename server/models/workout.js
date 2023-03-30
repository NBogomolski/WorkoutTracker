const mongoose = require("mongoose");

//!ALLOW MORE THAN ONE EXERCISE 
const workoutSchema = new mongoose.Schema({
    date: Date,
    title: String,
    exercise: String,
    reps: Number
});

module.exports = mongoose.model("Workout", workoutSchema, "Workout");
