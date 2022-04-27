const Diseases = require("../models/Diseases");
const mongoose = require("mongoose");
const express = require("express");

exports.get_diseases = async (req, res) => {
    var db = mongoose.connection;
    var collection = db.collection('assets');

    collection.find({
        'data.model': "disease"
    }).toArray(function (err, resp) {
        try {
            var json = {
                message: 'List diseases yang ada di db!',
                data: []
            }

            for (x = 0; x < resp.length; x++) {
                json.data.push(
                    resp[x].data
                )
            }
            res.status(200).json(json.data)

        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }

    })
}

exports.get_disease = async (req, res) => {
    var db = mongoose.connection;
    var collection = db.collection('assets');

    collection.find({
        'data._id': req.params.idDisease,
        'data.model': "disease"
    }).toArray(function (err, resp) {
        try {
            var json = {
                message: 'disease yang kamu cari!',
                data: resp[0].data
            }
            res.status(200).json(json.data)

        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }

    })
}