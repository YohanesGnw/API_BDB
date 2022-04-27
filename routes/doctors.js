const router = require("express").Router();
const mongoose = require("mongoose");

const doctorController = require('../controllers/doctor');

router.post("/",doctorController.add_doctor);
router.get("/",doctorController.get_doctors);
router.get("/:idDoctor",doctorController.get_doctor);

module.exports = router;