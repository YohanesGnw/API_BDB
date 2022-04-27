const Doctors = require("../models/Doctors");
const driver = require("bigchaindb-driver");
const mongoose = require("mongoose");
const express = require("express");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");

exports.add_doctor = async (req, res) => {

    const API_PATH = 'http://localhost:9984/api/v1/'
    const conn = new driver.Connection(API_PATH)

    const doctor = new driver.Ed25519Keypair()

    dotenv.config();

    const newDoctors = new Doctors({
        name: req.body.name,
        NoSTRD: req.body.NoSTRD,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password, process.env.PASS_USR
        ).toString(),
        phone: req.body.phone,
        dob: req.body.dob,
        address: req.body.address,
        doctorPubKey: req.body.doctorPubKey,
        model: "doctor"
    })

    try {
        const data = newDoctors

        const metadata = null

        const txCreateDoctor = driver.Transaction.makeCreateTransaction(
            data,
            metadata,

            // A transaction needs an output
            [driver.Transaction.makeOutput(
                driver.Transaction.makeEd25519Condition(doctor.publicKey))],
            doctor.publicKey
        )

        const txCreateDoctorSigned = driver.Transaction.signTransaction(txCreateDoctor, doctor.privateKey)

        conn.postTransactionCommit(txCreateDoctorSigned)
            .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))

        res.status(200).json({
            message: "your account successfully addded, heres your data",
            data: data
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.get_doctors = async (req, res) => {
    var db = mongoose.connection;
    var collection = db.collection('assets');

    collection.find({
        'data.model': "doctor"
    }).toArray(function (err, resp) {
        try {
            var json = {
                message: 'List doctor yang ada di db!',
                data: []
            }

            for (x = 0; x < resp.length; x++) {
                json.data.push(
                    resp[x].data
                )
            }
            res.status(200).json(json.data)

        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }

    })
}

exports.get_doctor = async (req, res) => {
    var db = mongoose.connection;
    var collection = db.collection('assets');

    collection.find({
        'data._id': req.params.idDoctor,
        'data.model': "doctor"
    }).toArray(function (err, resp) {
        try {
            var json = {
                message: 'data doctor yang kamu cari!',
                data: resp[0].data
            }
            res.status(200).json(json.data)

        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }

    })
}