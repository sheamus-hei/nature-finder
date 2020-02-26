const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/ppConfig');
const isLoggedIn = require('../middleware/isLoggedIn');
const methodOverride = require('method-override');


router.use(methodOverride('_method'));


// GET show profile
router.get('/', isLoggedIn, function(req, res) {
    db.user.findOne({
        where: {
            email: req.user.email
        }
    }).then(user => {
        console.log(user);
        res.render('profile/profile', { user });
    })
});

// GET form to edit profile
router.get("/edit", (req, res) => {
    db.user.findOne({
        where: {
            email: req.user.email
        }
    }).then(user => {
        console.log(user);
        res.render('profile/edit', { user });
    })
})

// GET a favorite
router.get("/:id", (req, res) => {
    res.send("this is one animal");
});

// POST add new favorite to profile
router.post("/", (req, res) => {
    console.log("post fave route responding");
    res.redirect("/");
});

// PUT edit profile
router.put("/edit", (req, res) => {
    db.user.findOne({
        where: {
            email: req.user.email
        }
    }).then(user => {
    // update fields not email
    let name = (req.body.name? req.body.name : user.name);
    let email = (req.body.email? req.body.email : user.email);
    let img = (req.body.img? req.body.img : user.img);
    let password = (req.body.password? req.body.password : user.password);
    // handle unique email exception
    if (user.email != email) {
        db.user.update({
            email: email
        }, {
            where: {
                id: user.id
            }
        })
    }
    db.user.update({
       name: name,
       password: password,
       img: img
    },   {
        where: {
            id: user.id
        }
    }).then(() => {
        res.redirect("/profile")
    })
})
})

// DELETE delete a fav
router.delete("/:id", (req, res) => {
    console.log("delete fav route responding");
    res.redirect("/");
})

module.exports = router;