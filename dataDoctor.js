const CryptoJS = require("crypto-js");
//jwt buat token buat security 
const driver = require("bigchaindb-driver");
const mongoose = require("mongoose");
const dotenv = require("dotenv")

    const API_PATH = 'http://localhost:9984/api/v1/'
    const conn = new driver.Connection(API_PATH);

    //const admin = new driver.Ed25519Keypair()
    //admin1
    //PubKey=6cfCitN2R2Sz4e1ARtJN8K9cAgFfKWWBFUpdfximDC9y
    //priKey=7FubcxE3JmHnN2fzkKpdYajuDw7YjMpYsJKZ43JfZL6f
    dotenv.config();

    const data =
    {
        "id": mongoose.Types.ObjectId,
        "name": "yoyoy1",
        "email": "yoyoy1@gmail.com",
        "password": CryptoJS.AES.encrypt(
            "yoyoy1", process.env.PASS_USR
            ).toString(),
        "phone": "08127668745",
        "dob": "1999/04/22",
        "address": "jl.asdwasdasdasasdasdsadasetegdfgretert",
        "partitionKey": "Doctor"
    }

    const metadata = null

        const txCreateDoctor = driver.Transaction.makeCreateTransaction(
            data,
            metadata,

        // A transaction needs an output
        [ driver.Transaction.makeOutput(
            driver.Transaction.makeEd25519Condition("6cfCitN2R2Sz4e1ARtJN8K9cAgFfKWWBFUpdfximDC9y"))
        ],
        "6cfCitN2R2Sz4e1ARtJN8K9cAgFfKWWBFUpdfximDC9y"
        )

        const txCreateDoctorSigned = driver.Transaction.signTransaction(txCreateDoctor, "7FubcxE3JmHnN2fzkKpdYajuDw7YjMpYsJKZ43JfZL6f")

        conn.postTransactionCommit(txCreateDoctorSigned)
        .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))
