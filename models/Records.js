const mongoose = require("mongoose");

const recordsSchema = new mongoose.Schema({
    diseaseId: {
        type: String,
        required: true
    },
    doctorId: {
        type: String,
        required: true
    },  
    diagnose: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    model: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("records",recordsSchema);