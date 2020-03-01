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
        user.getAnimals().then(animals => {
            res.render('profile/profile', { user, animals });
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

// GET form to edit profile
router.get("/edit", (req, res) => {
    db.user.findOne({
        where: {
            email: req.user.email
        }
    }).then(user => {
        res.render('profile/edit', { user });
    })
})


// POST add new favorite to profile
router.post("/favorites", (req, res) => {
    db.animal.findOrCreate({
        where: {
            speciesKey: req.body.speciesKey
        }, defaults: {
            location: req.body.location,
            name: req.body.name,
            lat: req.body.lat,
            long: req.body.long,
            img: req.body.img
        }
    }).then(([animal, created]) => {
        db.user.findOne({ 
            where: {
                id: req.user.id
            }
        }).then(user => {
            user.addAnimal(animal).then(animal => {
                res.redirect("/profile");
            })
        })
    }).catch(err => console.log(err));
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
            res.redirect("/profile");
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})

// DELETE delete a fav
router.delete("/:key", (req, res) => {
    db.animal.findOne({
        where: {
            speciesKey: req.params.key
        }
    }).then(animal => {
        console.log(animal, "🏔")
        db.usersAnimals.destroy({
            where: {
                userId: req.user.id,
                animalId: animal.id
            }
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
    res.redirect("/profile");
})

module.exports = router;