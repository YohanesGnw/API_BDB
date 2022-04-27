const router = require("express").Router();
const mongoose = require("mongoose");

const diseaseController = require('../controllers/disease');

router.get("/",diseaseController.get_diseases);
router.get("/:idDisease",diseaseController.get_disease);

module.exports = router;