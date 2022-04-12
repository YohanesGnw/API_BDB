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

dotenv.config();

// mongoose.connect(
//     process.env.MONGOATLAS_URL
// )
// .then(()=> console.log("DB atlas connected!"))
// .catch((err) => {
//     console.log(err);
// });

app.use(express.json());
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/userApp", userAppRoute);
app.use("/doctorWeb", doctorWebRoute);

app.listen(process.env.PORT ||3000, () => {
    console.log("Backend server is running!");
});