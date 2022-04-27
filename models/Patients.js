const mongoose = require("mongoose");

const patientsSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true
    },
    NIK: {
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
    patientPubKey: {
        type: String,
        required: true,
        unique: true,
    },
    model: {
        type: String,
        required: true
    }
},
//buat kasih tau kapan data user ini masuk
{timestamps: true}
);

module.exports = mongoose.model("patients",patientsSchema);