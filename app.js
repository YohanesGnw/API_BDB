const express = require("express");
const app = express();
//mongoose buat akses mongo db yang cloud
const mongoose = require("mongoose");
//dotenv = buat taro yang perlu disembunyiin
const dotenv = require("dotenv");

const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const userAppRoute = require('./routes/userApps');
const doctorWebRoute = require('./routes/doctorWeb');
const recordRoute = require('./routes/records');
const hospitalRoute = require('./routes/hospitals');
const patientRoute = require('./routes/patients');
const doctorRoute = require('./routes/doctors');
const diseaseRoute = require('./routes/diseases');

dotenv.config();

 mongoose.connect(
    'mongodb://localhost:27017/bigchain'
 )
 .then(()=> console.log("MongoDb connected!"))
 .catch((err) => {
     console.log(err);
 });

app.use(express.json());
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/userApp", userAppRoute);
app.use("/doctorWeb", doctorWebRoute);
app.use("/records", recordRoute);
app.use("/hospitals",hospitalRoute);
app.use("/patients", patientRoute);
app.use("/doctors", doctorRoute);
app.use("/diseases", diseaseRoute);

app.listen(process.env.PORT ||3000, () => {
    console.log("Backend server is running!");
});