const mongoose = require("mongoose");

const diseasesSchema = new mongoose.Schema({
    patientId: {
        type: String,
        required: true
    },
    hospitalId: {
        type: String,
        required: true
    },
    disease: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("diseases",diseasesSchema);