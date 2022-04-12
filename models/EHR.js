const mongoose = require("mongoose");

const EHRSchema = new mongoose.Schema({
    userBDBPriKey: {
        type : String,
        required: true,
        unique: true,
    },
    userPubKey: {
        type: String,
        required: true,
        unique: true
    },
    hospitalEmail: {
        type: String,
        required: true
    },
    doctorEmail: {
        type: String,
        required: true
    },
    diseases: {
        type: String,
        required: true
    },
    diagnoses: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    partitionKey: {
        type: String,
        required: true
    }
},
);

module.exports = mongoose.model("EHR",EHRSchema);