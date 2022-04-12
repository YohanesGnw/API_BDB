const router = require("express").Router();
const User = require("../models/User");
//cryptoJS = library buat security banyak hash sama encrypted dkk
const CryptoJS = require("crypto-js");
//jwt buat token buat security 
const jwt = require("jsonwebtoken");
const driver = require("bigchaindb-driver");
const axios = require("axios");
const { default: mongoose } = require("mongoose");

//SIGN UP
router.post("/register", async (req,res) => {

    const API_PATH = 'http://localhost:9984/api/v1/'
    const conn = new driver.Connection(API_PATH)

    const user = new driver.Ed25519Keypair()

    const newUser = new User({
        id: mongoose.Types.ObjectId,
        name: req.body.name,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password, process.env.PASS_USR
            ).toString(),
        phone: req.body.phone,
        dob: req.body.dob,
        address: req.body.address,
        userBDBPubKey: user.publicKey,
        userPubKey: req.body.userPubKey,
        partitionKey: "User",
    });

    try {
        const data ={
            "id": newUser.id,
            "name": newUser.name,
            "email": newUser.email,
            "password": newUser.password,
            "phone": newUser.phone,
            "dob": newUser.dob,
            "address": newUser.address,
            "userBDBPubKey": newUser.userBDBPubKey,
            "userPubKey": newUser.userPubKey,
            "partitionKey": newUser.partitionKey
        }

        const metadata = null

        const txCreateUser = driver.Transaction.makeCreateTransaction(
            data,
            metadata,

        // A transaction needs an output
        [ driver.Transaction.makeOutput(
            driver.Transaction.makeEd25519Condition(user.publicKey))
        ],
        user.publicKey
        )

        const txCreateUserSigned = driver.Transaction.signTransaction(txCreateUser, user.privateKey)

        conn.postTransactionCommit(txCreateUserSigned)
        .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))

        res.status(200).json({
            message: "your account successfully registered, heres your private key",
            data: user.privateKey
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

//login
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

            const accessToken = jwt.sign({
                id:resp.data[0].data.id
            }, 
            process.env.JWT_SEC,
            {expiresIn:"2d"}
            );
    
            const {password, ...others} = resp.data[0].data; //untuk sembunyiin password biar gak keliatan di respond
            res.status(200).json({...others, accessToken});
        })

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;