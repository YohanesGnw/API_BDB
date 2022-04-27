const router = require("express").Router();
const mongoose = require("mongoose");

const hospitalController = require('../controllers/hospital');

router.post("/",hospitalController.add_hospital);
router.get("/",hospitalController.get_hospitals);
router.get("/:idHospital",hospitalController.get_hospital);

module.exports = router;