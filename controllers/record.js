const Records = require("../models/Records");
const Diseases = require("../models/Diseases");
const driver = require("bigchaindb-driver");
const mongoose = require("mongoose");
const express = require("express");

// const transaction = require("./transaction");

// async function create() {
//     const record = await collection.find('data._id': newRecords.hospitalId);
// }

exports.add_record = async (req, res) => {

    const API_PATH = 'http://localhost:9984/api/v1/'
    const conn = new driver.Connection(API_PATH)

    const input = ({
        patientId: req.body.patientId,
        doctorId: req.body.doctorId,
        hospitalId: req.body.hospitalId,
        disease: req.body.disease,
        diagnose: req.body.diagnose,
        date: req.body.date,
    });

    var db = mongoose.connection;
    var collection = db.collection('assets');

    var diseasesId = "";
    collection.find({
        'data._id': input.hospitalId
    }).toArray(function (err, resp) {

        const signaturePub = resp[0].data.signaturePubKey
        const signaturePri = resp[0].data.signaturePriKey

        collection.find({
            'data.disease': input.disease,
            'data.model': 'disease'
        }).toArray(function (err, resp) {
            if (!resp.length) {
                const newDiseases = new Diseases({
                    patientId: input.patientId,
                    hospitalId: input.hospitalId,
                    disease: input.disease,
                    model: "disease"
                })

                const data = newDiseases
                const metadata = null

                const tx = driver.Transaction.makeCreateTransaction(
                    data,
                    metadata,

                    // A transaction needs an output
                    [driver.Transaction.makeOutput(
                        driver.Transaction.makeEd25519Condition(signaturePub))],
                    signaturePub
                )

                const txSigned = driver.Transaction.signTransaction(tx, signaturePri)

                conn.postTransactionCommit(txSigned)
                    .then(retrievedTx => {
                        console.log('Transaction', retrievedTx.id, 'successfully posted.');
                        diseasesId = retrievedTx.asset.data._id;
                    })
            } else {
                console.log('disease already exist')
                diseasesId = resp[0].data._id;
            }

            const newRecords = new Records({
                diseaseId: diseasesId,
                doctorId: req.body.doctorId,
                diagnose: req.body.diagnose,
                date: req.body.date,
                model: "record"
            })

            try {
                const data = newRecords
                const metadata = null

                const tx = driver.Transaction.makeCreateTransaction(
                    data,
                    metadata,

                    // A transaction needs an output
                    [driver.Transaction.makeOutput(
                        driver.Transaction.makeEd25519Condition(signaturePub))],
                    signaturePub
                )

                const txSigned = driver.Transaction.signTransaction(tx, signaturePri)

                conn.postTransactionCommit(txSigned)
                    .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))

                res.status(200).json({
                    message: "your EHR successfully added, heres your EHR",
                    data: data
                });

            } catch (err) {
                res.status(500).json(err);
            }
        })
    })
}

exports.get_records = async (req, res) => {
    var db = mongoose.connection;
    var collection = db.collection('assets');

    collection.find({
        'data.model': "record"
    }).toArray(function (err, resp) {
        try {
            var json = {
                message: 'List EHR punya kamu!',
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

exports.get_record = async (req, res) => {
    var db = mongoose.connection;
    var collection = db.collection('assets');

    collection.find({
        'data._id': req.params.idRecord,
        'data.model': "record"
    }).toArray(function (err, resp) {
        try {
            var json = {
                message: 'EHR yang kamu cari!',
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
