const mongoose = require("mongoose");

const hospitalsSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    hospitalPubKey: {
        type: String,
        required: true,
        unique: true,
    },
    signaturePubKey: {
        type: String,
        required: true,
        unique: true
    },
    signaturePriKey: {
        type: String,
        required: true,
        unique: true
    },
    model: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Hospitals",hospitalsSchema);