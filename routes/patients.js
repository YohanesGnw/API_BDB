const router = require("express").Router();
const mongoose = require("mongoose");

const patientController = require('../controllers/patient');

router.post("/signUp",patientController.add_patient);
router.post("/login",patientController.login_patient);
router.get("/",patientController.get_patients);
router.get("/:idPatient",patientController.get_patient);
router.get("/:idPatient/diseases",patientController.get_diseases_byPatient_Id);
router.get("/:idPatient/diseases/:idDiseases",patientController.get_spesificDisease);
router.get("/:idPatient/diseases/:idDiseases/records/:idRecord",patientController.get_fullData);
router.get("/:idPatient/hospitals",patientController.get_hospital_byPatient_Id);
router.get("/:idPatient/hospitals/:idHospital",patientController.get_diseases_byHospital_Id);
router.get("/:idPatient/hospitals/:idHospital/diseases/:idDiseases",patientController.get_spesificDisease_byHospital_Id);

module.exports = router;