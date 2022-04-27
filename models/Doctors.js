const mongoose = require("mongoose");

const doctorsSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true
    },
    NoSTRD: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    doctorPubKey: {
        type: String,
        required: true,
        unique: true,
    },
    model: {
        type: String,
        required: true
    }
},
//buat kasih tau kapan data docter ini masuk
{timestamps: true}
);

module.exports = mongoose.model("doctors",doctorsSchema);