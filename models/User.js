const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true 
    },
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
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
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
    userBDBPubKey: {
        type: String,
        required: true,
        unique: true
    },
    userPubKey: {
        type: String,
        required: true,
        unique: true,
    },
    partitionKey: {
        type: String,
        required: true
    }
},
//buat kasih tau kapan dibuat ini user
{timestamps: true}
);

module.exports = mongoose.model("User",UserSchema);