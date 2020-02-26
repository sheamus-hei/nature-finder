const express = require('express');
const router = express.Router();
const db = require('../models');

// GET show all results
router.get("/", (req, res) => {
    res.send("this is the results page");
})

// GET show one result
router.get("/", (req, res) => {
    res.send("this is the results");
})