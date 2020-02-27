const express = require('express');
const router = express.Router();
const db = require('../models');
const axios = require('axios');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({accessToken: process.env.API_KEY});

// GET show all results
router.get("/", (req, res) => {
    // use mapbox api to convert result into a lat and long range
    geocodingClient.forwardGeocode({query: req.query.location})
    .send().then(response => {
        let places = response.body.features.filter(result => {
            if(result['place_type'][0] === 'place') {
                return true;
            }
        }).map( city => {
            return { 
                location: city.place_name,
                lat: city.center[1],
                long: city.center[0]
            }
        });
        // if there is one location, show the animal results
        // else take them to a page where they can pick from the list of locations
        if (places.length === 1) {
            // query the GBIF api to show animal results
            let lat = places[0].lat;
            let long = places[0].long;
            let url = `https://api.gbif.org/v1/occurrence/search?decimalLongitude=${long-0.1},${long+0.1}&decimalLatitude=${lat-0.1},${lat+0.1}&kingdomKey=1`;
            axios.get(url).then(apiResponse => {
                // make an array of animals with each animal showing once
                let animals = {};
                apiResponse.data.results.forEach(result => {
                    if (!animals.hasOwnProperty(result.speciesKey)) {
                        animals[result.speciesKey] = {
                            img: result.media[0].identifier,
                            species: result.species,
                            count: 1
                        }
                    } else {
                        animals[result.speciesKey].count++;
                    }  
                })
                console.log(animals);
                res.render('results/results', {result: places, animals});
            }).catch(err => console.log(err))
        } else {
            res.render('results/locations', {results: places});
        }
    }).catch(err => console.log(err))

    // query GBIF api to get results
    // map results into an array of original animals
    // res.send("this is the results page");
});

// GET show one result
router.get("/", (req, res) => {
    res.send("this is one result");
});

module.exports = router;