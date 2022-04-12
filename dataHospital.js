const CryptoJS = require("crypto-js");
//jwt buat token buat security 
const driver = require("bigchaindb-driver");
const mongoose = require("mongoose");
const dotenv = require("dotenv")

    const API_PATH = 'http://localhost:9984/api/v1/'
    const conn = new driver.Connection(API_PATH);

    const admin = new driver.Ed25519Keypair()
    //admin1
    //PubKey=6cfCitN2R2Sz4e1ARtJN8K9cAgFfKWWBFUpdfximDC9y
    //priKey=7FubcxE3JmHnN2fzkKpdYajuDw7YjMpYsJKZ43JfZL6f
    dotenv.config();

    const data =
    {
        "id": mongoose.Types.ObjectId,
        "name": "Rumahsakit C",
        "email": "rumahsakit3@gmail.com",
        "phone": "081211111113",
        "address": "jl.asdwasasdasasdasddasasasdsasdasaddasdasdasddasdsadasetegdfgretert",
        "hospitalPubKey": "9876543211011121318",
        "partitionKey": "Hospital"
    }

    const metadata = null

        const txCreateDoctor = driver.Transaction.makeCreateTransaction(
            data,
            metadata,

        // A transaction needs an output
        [ driver.Transaction.makeOutput(
            driver.Transaction.makeEd25519Condition(admin.publicKey))
        ],
        admin.publicKey
        )

        const txCreateDoctorSigned = driver.Transaction.signTransaction(txCreateDoctor, admin.privateKey)

        conn.postTransactionCommit(txCreateDoctorSigned)
        .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))
