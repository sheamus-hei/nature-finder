const express = require('express');
const router = express.Router();
const db = require('../models');

// GET show all journals
router.get("/", (req, res) => {
    res.send("Showing all journals");
});

// GET form to make new journal
router.get("/new", (req, res) => {
    res.send("form to make a new journal");
});

// GET form to edit journal
router.get("/:id/edit", (req, res) => {
    res.send("a form to edit a journal");
});

// GET show one journal
router.get("/:id", (req, res) => {
    res.send("showing one journal");
});

// POST make new journal
router.post("/", (req, res) => {
    console.log("post new journal route responding");
    res.redirect("/");
});

// PUT edit a journal
router.put("/:id", (req, res) => {
    console.log("edit journal route responding");
    res.redirect("/");
});

// DELETE delete a journal
router.put("/:id", (req, res) => {
    console.log("delete journal route responding");
    res.redirect("/");
})

module.exports = router;