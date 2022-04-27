const router = require("express").Router();
const mongoose = require("mongoose");

const recordController = require('../controllers/record');

router.post("/",recordController.add_record);
router.get("/",recordController.get_records);
router.get("/:idRecord",recordController.get_record);

module.exports = router;