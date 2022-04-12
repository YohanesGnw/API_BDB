const router = require("express").Router();
const EHR = require("../models/EHR");
//cryptoJS = library buat security banyak hash sama encrypted dkk
const CryptoJS = require("crypto-js");
const driver = require("bigchaindb-driver");
const axios = require("axios");
const mongoose = require("mongoose");

router.post("/login", async (req,res) =>{
    try {

        const email = req.body.email;
        axios.get('http://localhost:9984/api/v1/assets/?search="'+email+'"')
        .then(function (resp) {
            //wrong email
            if(email !== resp.data[0].data.email){
                return res.status(400).json("Wrong email!");
            }

            //wrong password
            const decrypt = CryptoJS.AES.decrypt(
            resp.data[0].data.password, process.env.PASS_USR
            );
            const passwordencrypt = decrypt.toString(CryptoJS.enc.Utf8);
            
            if (passwordencrypt != req.body.password) {
                return res.status(400).json("Wrong password!");
            }
    
            const {password, ...others} = resp.data[0].data; //untuk sembunyiin password biar gak keliatan di respond
            res.status(200).json({...others});
        })

    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/addEHR", async (req,res) =>{

    const API_PATH = 'http://localhost:9984/api/v1/'
    const conn = new driver.Connection(API_PATH)

    //private key user 8: 27HrByjW5MGC667sDCp7bqpGbzuRfoHiY4LUt7rW4fPi
    const newEHR = new EHR({
        userBDBPriKey: req.body.userBDBPriKey,
        userPubKey: req.body.userPubKey,
        hospitalEmail: req.body.hospitalEmail,
        doctorEmail: req.body.doctorEmail,
        diseases: req.body.diseases,
        diagnoses: req.body.diagnoses,
        date: req.body.date,
        partitionKey: "EHR"
    });
    try {
        axios.get('http://localhost:9984/api/v1/assets/?search="'+newEHR.userPubKey+'"')
        .then(function (resp){
            const userId = resp.data[0].id
            const userName = resp.data[0].data.name
            const userDOB = resp.data[0].data.dob
            const userBDBPubKey = resp.data[0].data.userBDBPubKey

            axios.get('http://localhost:9984/api/v1/assets/?search="'+newEHR.doctorEmail+'"')
            .then(function (resp){
                const doctorId = resp.data[0].id
                const doctorName = resp.data[0].data.name

                axios.get('http://localhost:9984/api/v1/assets/?search="'+newEHR.hospitalEmail+'"')
                .then(function (resp){

                    const hospitalId = resp.data[0].id;
                    const hospitalName = resp.data[0].data.name;
                    const hospitalPubKey = resp.data[0].data.hospitalPubKey
                    const data ={
                        "id": mongoose.Types.ObjectId,
                        "patient":{
                            "id": userId,
                            "name": userName,
                            "dob": userDOB,
                            "userBDBPubKey": userBDBPubKey,
                            "userPubKey": newEHR.userPubKey,
                            "EHRrecords":{
                                "diseases": newEHR.diseases,
                                "diagnoses": newEHR.diagnoses,
                                "date": newEHR.date,
                            }
                        },
                        "hospital":{
                            "id": hospitalId,
                            "name": hospitalName,
                            "hospitalPubKey": hospitalPubKey
                        },
                        "doctor":{
                            "id": doctorId,
                            "name": doctorName
                        },
                        "partitionkey": newEHR.partitionKey
                    }

                    const metadata = null

                    const txCreateEHR = driver.Transaction.makeCreateTransaction(
                        data,
                        metadata,

                        // A transaction needs an output
                        [ driver.Transaction.makeOutput(
                            driver.Transaction.makeEd25519Condition(userBDBPubKey))
                        ],
                        userBDBPubKey
                    )

                    const txCreateEHRSigned = driver.Transaction.signTransaction(txCreateEHR, newEHR.userBDBPriKey)

                    conn.postTransactionCommit(txCreateEHRSigned)
                    .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))

                    res.status(200).json({
                        message: "your EHR successfully added, heres your EHR",
                        data: data
                    });
                });
            });
        });

        

        

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;