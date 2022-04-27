const Patients = require("../models/Patients");
const driver = require("bigchaindb-driver");
const mongoose = require("mongoose");
const express = require("express");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");


exports.add_patient = async (req, res) => {

    const API_PATH = 'http://localhost:9984/api/v1/'
    const conn = new driver.Connection(API_PATH)

    const patient = new driver.Ed25519Keypair()

    dotenv.config();

    const newPatients = new Patients({
        name: req.body.name,
        NIK: req.body.NIK,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password, process.env.PASS_USR
        ).toString(),
        phone: req.body.phone,
        dob: req.body.dob,
        address: req.body.address,
        patientPubKey: req.body.patientPubKey,
        model: "patient",
    });

    try {
        const data = newPatients
        const metadata = null

        const txCreateUser = driver.Transaction.makeCreateTransaction(
            data,
            metadata,

            // A transaction needs an output
            [driver.Transaction.makeOutput(
                driver.Transaction.makeEd25519Condition(patient.publicKey))],
            patient.publicKey
        )

        const txCreateUserSigned = driver.Transaction.signTransaction(txCreateUser, patient.privateKey)

        conn.postTransactionCommit(txCreateUserSigned)
            .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))

        res.status(200).json({
            message: "your account successfully registered, heres your data",
            data: data
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.get_patients = async (req, res) => {
    var db = mongoose.connection;
    var collection = db.collection('assets');

    collection.find({
        'data.model': "patient"
    }).toArray(function (err, resp) {
        try {
            var json = {
                message: 'List patient yang ada di db!',
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

exports.get_patient = async (req, res) => {
    var db = mongoose.connection;
    var collection = db.collection('assets');

    collection.find({
        'data._id': req.params.idPatient,
        'data.model': "patient"
    }).toArray(function (err, resp) {
        try {
            var json = {
                message: 'patient yang kamu cari!',
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

exports.login_patient = async (req, res) => {
    var db = mongoose.connection;
    var collection = db.collection('assets');
    const email = req.body.email

    collection.find({
        'data.email': req.body.email,
        'data.model': "patient"
    }).toArray(function (err, resp) {
        try {
            // wrong email
            if (email !== resp[0].data.email) {
                return res.status(400).json("Wrong email!");
            }

            //wrong password
            const decrypt = CryptoJS.AES.decrypt(
                resp[0].data.password, process.env.PASS_USR
            );
            const passwordencrypt = decrypt.toString(CryptoJS.enc.Utf8);

            if (passwordencrypt != req.body.password) {
                return res.status(400).json("Wrong password!");
            }

            res.status(200).json(resp[0].data);
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }

    })
}

exports.get_diseases_byPatient_Id = async (req, res) => {
    var db = mongoose.connection;
    var collection = db.collection('assets');

    collection.find({
        'data.patientId': req.params.idPatient,
        'data.model': "disease"
    }).toArray(function (err, resp) {
        try {
            var json = {
                message: 'List Diseases yang pernah kamu alami:',
                data: []
            }
            for (x = 0; x < resp.length; x++) {
                json.data.push(
                    resp[x].data.disease
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

exports.get_spesificDisease = async (req, res) => {
    var db = mongoose.connection;
    var collection = db.collection('assets');

    collection.find({
        'data.diseaseId': req.params.idDiseases,
        'data.model': "record"
    }).toArray(function (err, resp) {
        try {
            let json = {
                message: 'List data sesuai diseases yang kamu pilih',
                data: []
            }
            for (x = 0; x < resp.length; x++) {
                const date = resp[x].data.date
                collection.find({
                    'data._id': resp[x].data.diseaseId,
                    'data.patientId': req.params.idPatient,
                    'data.model': "disease"
                }).toArray(function (err, resp2) {
                    if (resp2 !== undefined) {
                        for (let i = 0; i < resp2.length; i++) {
                            let diseaseData = {
                                'patientId': resp2[i].data.patientId,
                                'hospitalId': resp2[i].data.hospitalId,
                                'disease': resp2[i].data.disease,
                                'date': date,
                            };
                            json.data.push(diseaseData);
                        }
                    } else {
                        res.status(500).json("Disease with disease id not found!")
                    }
                    res.status(200).json(json);
                });
            }
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }

    })
}

exports.get_fullData = async (req, res) => {
    var db = mongoose.connection;
    var collection = db.collection('assets');

    collection.find({
        'data.patientId': req.params.idPatient,
        'data.model': "disease"
    }).toArray(function (err, resp) {
        try {
            let json = {
                message: 'ini list Rumah sakit yang pernah kamu kunjungi',
                data: []
            }
            for (x = 0; x < resp.length; x++) {
                const date = resp[x].data.date
                const doctor = resp[x].data.doctorId
                const diagnose =resp[x].data.diagnose
                collection.find({
                    'data._id': req.params.idDiseases,
                    'data.patientId': req.params.idPatient,
                    'data.model': "disease"
                }).toArray(function (err, resp2) {
                    if (resp2 !== undefined) {
                        for (let i = 0; i < resp2.length; i++) {
                            let diseaseData = {
                                'patientId': resp2[i].data.patientId,
                                'hospitalId': resp2[i].data.hospitalId,
                                'doctorId': doctor,
                                'disease': resp2[i].data.disease,
                                'diagnose': diagnose,
                                'date': date,
                            };
                            json.data.push(diseaseData);
                        }
                    } else {
                        res.status(500).json("Disease with disease id not found!")
                    }
                    res.status(200).json(json);
                });
            }
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }

    })
}

exports.get_hospital_byPatient_Id = async (req, res) => {
    var db = mongoose.connection;
    var collection = db.collection('assets');

    collection.find({
        'data.diseaseId': req.params.idDiseases,
        'data.model': "record"
    }).toArray(function (err, resp) {
        try {
            let json = {
                message: 'List data sesuai diseases yang kamu pilih',
                data: []
            }
            for (x = 0; x < resp.length; x++) {
                const hospitalId = resp[x].data.hospitalId
                collection.find({
                    'data._id': hospitalId,
                    'data.model': "hospital"
                }).toArray(function (err, resp2) {
                    if (resp2 !== undefined) {
                        for (let i = 0; i < resp2.length; i++) {
                            let hospitalData = {
                                'name': resp2[i].data.name
                            };
                            json.data.push(hospitalData);
                        }
                    } else {
                        res.status(500).json("Hospital with hospital id not found!")
                    }
                    res.status(200).json(json);
                });
            }
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }

    })
}

exports.get_diseases_byHospital_Id = async (req, res) => {
    var db = mongoose.connection;
    var collection = db.collection('assets');

    collection.find({
        'data.patientId': req.params.idPatient,
        'data.hospitalId': req.params.idHospital,
        'data.model': "disease"
    }).toArray(function (err, resp) {
        try {
            var json = {
                message: 'List Diseases yang pernah kamu alami di Rumah sakit ini:',
                data: []
            }
            for (x = 0; x < resp.length; x++) {
                json.data.push(
                    resp[x].data.disease
                )
            }
            res.status(200).json(json)

        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }

    })
}

exports.get_spesificDisease_byHospital_Id = async (req, res) => {
    var db = mongoose.connection;
    var collection = db.collection('assets');

    collection.find({
        'data.diseaseId': req.params.idDiseases,
        'data.model': "record"
    }).toArray(function (err, resp) {
        try {
            let json = {
                message: 'List data sesuai diseases yang kamu pilih di rumah sakit ini: ',
                data: []
            }
            for (x = 0; x < resp.length; x++) {
                const date = resp[x].data.date
                collection.find({
                    'data._id': resp[x].data.diseaseId,
                    'data.patientId': req.params.idPatient,
                    'data.hospitalId': req.params.idHospital,
                    'data.model': "disease"
                }).toArray(function (err, resp2) {
                    if (resp2 !== undefined) {
                        for (let i = 0; i < resp2.length; i++) {
                            let diseaseData = {
                                'patientId': resp2[i].data.patientId,
                                'hospitalId': resp2[i].data.hospitalId,
                                'disease': resp2[i].data.disease,
                                'date': date,
                            };
                            json.data.push(diseaseData);
                        }
                    } else {
                        res.status(500).json("Disease with disease id not found!")
                    }
                    res.status(200).json(json);
                });
            }
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }

    })
}