const router = require("express").Router();
const axios = require("axios");

router.get("/test", (req,res)=>{
    axios.get('http://localhost:9984/api/v1/assets/?search="'+req.body.id+'"')
        .then(function (resp) {
            var json = {
                message: 'test dulu yaa',
                data: []
            }
            for (x = 0; x < resp.data.length; x++) {
                if (resp.data[x].data.partitionkey == "EHR") {
                    json.data.push(
                    resp.data[x].data
                    ) 
                }

            }
            let saringData = [...new Set(json.data)];
            res.status(200).json(saringData);
        })
        .catch(function(err){
            res.status(500).json({
                message: err.message
            })
        })
})

router.get("/", (req,res)=>{
    axios.get('http://localhost:9984/api/v1/assets/?search="'+req.body.id+'"')
        .then(function (resp) {
            var json = {
                message: 'List disease yang pernah kamu alami:',
                data: []
            }
            for (x = 0; x < resp.data.length; x++) {
                if (resp.data[x].data.partitionkey == "EHR") {
                    json.data.push(
                    resp.data[x].data.patient.EHRrecords.diseases
                    ) 
                }
            }
            let saringData = [...new Set(json.data)];
            res.status(200).json(saringData);
        })
        .catch(function(err){
            res.status(500).json({
                message: err.message
            })
        })
})

router.get("/diseases", (req,res)=>{

    const diseasesName = req.body.diseasesName;
    axios.get('http://localhost:9984/api/v1/assets/?search="'+req.body.id+'"')
        .then(function (resp) {
            var json = {
                data: []
            }
            for (x = 0; x < resp.data.length; x++) {
                if (resp.data[x].data.partitionkey == "EHR" && resp.data[x].data.patient.EHRrecords.diseases == diseasesName) {
                    json.data.push(
                    resp.data[x].data
                    ) 
                }
            }
            let saringData = [...new Set(json.data)];
            res.status(200).json(saringData);
        })
        .catch(function(err){
            res.status(500).json({
                message: err.message
            })
        })
})
    
router.get("/hospital", (req,res) =>{

    axios.get('http://localhost:9984/api/v1/assets/?search="'+req.body.id+'"')
        .then(function (resp) {
            var json = {
                message: 'List Rumah sakit yang pernah kamu kunjungi:',
                data: []
            }
            for (x = 0; x < resp.data.length; x++) {
                if (resp.data[x].data.partitionkey == "EHR") {
                    json.data.push(
                    resp.data[x].data.hospital.name
                    ) 
                }
            }
            let saringData = [...new Set(json.data)];

            res.status(200).json(saringData);
        })
        .catch(function(err){
            res.status(500).json({
                message: err.message
            })
        })

});

router.get("/hospital/disease", (req,res) =>{
    const hospitalName = req.body.hospitalName;

    axios.get('http://localhost:9984/api/v1/assets/?search="'+req.body.id+'"')
        .then(function (resp) {
            var json = {
                message: 'List disease yang pernah kamu alami di Rumah sakit '+hospitalName,
                data: []
            }

            for (x = 0; x < resp.data.length; x++) {
                if (resp.data[x].data.partitionkey == "EHR" && resp.data[x].data.hospital.name == hospitalName) {
                    json.data.push(
                        resp.data[x].data.patient.EHRrecords.diseases
                    )
                }
                
            }
            let saringData = [...new Set(json.data)];

            res.status(200).json(saringData);
        })
        .catch(function(err){
            res.status(500).json({
                message: err.message
            })
        })
});

router.get("/hospital/disease/date", (req,res) =>{
    const hospitalName = req.body.hospitalName;
    const diseasesName = req.body.diseasesName;

    axios.get('http://localhost:9984/api/v1/assets/?search="'+req.body.id+'"')
        .then(function (resp) {
            var json = {
                data: []
            }
            for (x = 0; x < resp.data.length; x++) {
                if (resp.data[x].data.partitionkey == "EHR" && resp.data[x].data.hospital.name == hospitalName && resp.data[x].data.patient.EHRrecords.diseases == diseasesName) {
                    json.data.push(
                        resp.data[x].data.patient.EHRrecords.date
                    )
                }  
            }
            res.status(200).json(json);
        })
        .catch(function(err){
            res.status(500).json({
                message: err.message
            })
        })
})

router.get("/hospital/disease/date/detail", (req,res) =>{
    const hospitalName = req.body.hospitalName;
    const diseasesName = req.body.diseasesName;
    const date = req.body.date;

    axios.get('http://localhost:9984/api/v1/assets/?search="'+req.body.id+'"')
        .then(function (resp) {
            var json = {
                data: []
            }
            for (x = 0; x < resp.data.length; x++) {
                if (resp.data[x].data.partitionkey == "EHR" && 
                    resp.data[x].data.hospital.name == hospitalName && 
                    resp.data[x].data.patient.EHRrecords.diseases == diseasesName &&
                    resp.data[x].data.patient.EHRrecords.date == date) {
                    json.data.push(
                        resp.data[x].data
                    )
                }  
            }
            res.status(200).json(json);
        })
        .catch(function(err){
            res.status(500).json({
                message: err.message
            })
        })
})

module.exports = router;
