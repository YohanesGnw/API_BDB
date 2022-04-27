const Hospitals = require("../models/Hospitals");
const driver = require("bigchaindb-driver");
const mongoose = require("mongoose");
const express = require("express");

exports.add_hospital = async (req, res) => {

    const API_PATH = 'http://localhost:9984/api/v1/'
    const conn = new driver.Connection(API_PATH)

    const hospital = new driver.Ed25519Keypair()

    const newHospitals = new Hospitals({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        hospitalPubKey: req.body.hospitalPubKey,
        signaturePubKey: hospital.publicKey,
        signaturePriKey: hospital.privateKey,
        model: "hospital"
    });

    try {
        const data = newHospitals
        const metadata = null

        const txCreaterecords = driver.Transaction.makeCreateTransaction(
            data,
            metadata,

            // A transaction needs an output
            [driver.Transaction.makeOutput(
                driver.Transaction.makeEd25519Condition(hospital.publicKey))],
            hospital.publicKey
        )

        const txCreaterecordsSigned = driver.Transaction.signTransaction(txCreaterecords, hospital.privateKey)

        conn.postTransactionCommit(txCreaterecordsSigned)
            .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))

        res.status(200).json({
            message: "your hospital successfully added, heres your data",
            data: data
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.get_hospitals = async (req, res) => {
    var db = mongoose.connection;
    var collection = db.collection('assets');

    collection.find({
        'data.model': "hospital"
    }).toArray(function (err, resp) {
        try {
            var json = {
                message: 'List hospital yang ada di db!',
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

exports.get_hospital = async (req, res) => {
    var db = mongoose.connection;
    var collection = db.collection('assets');

    collection.find({
        'data._id': req.params.idHospital,
        'data.model': "hospital"
    }).toArray(function (err, resp) {
        try {
            var json = {
                message: 'hospital yang kamu cari!',
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