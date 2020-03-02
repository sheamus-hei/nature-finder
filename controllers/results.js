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
            if(result['place_type'][0] === 'place' 
                || result['place_type'][0] === 'poi'
                || result['place_type'][0] === 'postcode') {
                console.log(result)
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
        if (places.length === 1 || req.query.index) {
            let index = (req.query.index)? req.query.index : 0;
            // query the GBIF api to show animal results
            let lat = places[index].lat;
            let long = places[index].long;
            let url = `https://api.gbif.org/v1/occurrence/search?decimalLongitude=${long-0.1},${(long+0.1)}&decimalLatitude=${lat-0.1},${(lat+0.1)}&kingdomKey=1&limit=50`;
            console.log(url);
            axios.get(url).then(apiResponse => {
                // make an object of animals with each animal showing once
                let animals = {};
                apiResponse.data.results.forEach(result => {
                    if(result.speciesKey) {
                        if (!animals.hasOwnProperty(result.speciesKey)) {
                            animals[result.speciesKey] = {
                                img: ((result.media[0]&&result.media[0].type=="StillImage")
                                        ? result.media[0].identifier : "./img/bird.jpeg"),
                                species: result.species,
                                count: 1
                            }
                        } else {
                            animals[result.speciesKey].count++;
                        }  
                    }
                })
                res.render('results/results', {
                    location: places[index].location,
                    animals,
                    lat,
                    long
                });
            }).catch(err => console.log(err))
        } else {
            // res.send(places);
            res.render('results/locations', {results: places, query: req.query.location});
        }
    }).catch(err => console.log(err))
});

// GET show one result
router.get("/:id", (req, res) => {
    // calls the GBIF api for a species
    axios.get(`https://api.gbif.org/v1/species/${req.params.id}`)
    .then(apiResponse => {
        // get the vernacular name in a separate call
        axios.get(`https://api.gbif.org/v1/species/${req.params.id}/vernacularNames`)
        .then(nameResponse => {
            let vernacularName;
            if(nameResponse.data.results[0]) {
                // only add if english (unfortunate but otherwise the first name listed for a russian bird is in french and i hate the french)
                nameResponse.data.results.forEach((entry, index) => {
                    if (entry.language == "eng") {
                        vernacularName = nameResponse.data.results[index].vernacularName;
                    }
                })
            }
            // checks occurences for that animal in that location
            let lat = Number(req.query.lat);
            let long = Number(req.query.long);
            let occurenceURL =`https://api.gbif.org/v1/occurrence/search?decimalLongitude=${long-0.1},${(long+0.1)}&decimalLatitude=${lat-0.1},${(lat+0.1)}&speciesKey=${req.query.speciesKey}&limit=100`;
            console.log(occurenceURL)
            axios.get(occurenceURL).then(occurenceResponse => {
                // include two other sightings
                // let otherSightings = {
                //     secondPhoto: null,
                //     secondLocation: null,
                //     thirdPhoto: null,
                //     thirdLocation: null
                // }
                let count = 0;
                // track occurences over current and past year
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth();
                let tracker = {
                    thisYear: year,
                    thisMonth: month,
                    lastYear: year - 1,
                    thisYearTotal: 0,
                    lastYearTotal: 0,
                    thisPeakMonth: 0,
                    lastPeakMonth: 0,
                    thisMonthTotals: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    lastMonthTotals: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                } 
                occurenceResponse.data.results.forEach(dataset => {
                    // update other occurences
                    // if (count == 1) {
                    //     otherSightings.secondLocation = dataset.verbatimLocality,
                    //     otherSightings.secondPhoto = (dataset.media[0] && dataset.media[0] == "stillImage")?
                    //                  dataset.media[0].identifier : "./img/bird.jpeg";
                    // } else if (count == 2) {
                    //     otherSightings.thirdLocation = dataset.verbatimLocality,
                    //     otherSightings.thirdPhoto = (dataset.media[0] && dataset.media[0] == "stillImage")?
                    //                  dataset.media[0].identifier : "./img/bird.jpeg";
                    // }
                    // count the year
                    if (dataset.year == tracker.thisYear) {
                        tracker.thisYearTotal++;
                        tracker.thisMonthTotals[dataset.month - 1]++;
                        if (tracker.thisMonthTotals[dataset.month - 1] > tracker.thisMonthTotals[tracker.thisPeakMonth]) {
                            tracker.thisPeakMonth = dataset.month - 1;
                        }
                    } else if (dataset.year == tracker.lastYear) {
                        tracker.lastYearTotal++;
                        tracker.lastMonthTotals[dataset.month - 1]++;
                        if (tracker.lastMonthTotals[dataset.month - 1] > tracker.lastMonthTotals[tracker.lastPeakMonth]) {
                            tracker.lastPeakMonth = dataset.month - 1;
                        }
                    }
                    count++;
                })
                //check if animal is in favorites
                let alreadySaved = false;
                db.animal.findOne({
                    where: { 
                        speciesKey: req.params.id
                    }, include: [db.user]
                }).then(animal => {
                    // check if animal has current user
                    if (animal !== null && req.user) {
                        animal.getUsers({
                            where: {
                                id: req.user.id
                            }
                        }).then(users => {
                            alreadySaved = (users.length > 0);
                            res.render("results/show", {
                                location: req.query.location,
                                animal: apiResponse.data, 
                                alreadySaved,
                                img: req.query.img, 
                                name: vernacularName,
                                tracker,
                                lat,
                                long
                                // otherSightings
                            });
                        });
                    } else {
                        res.render("results/show", {
                            location: req.query.location,
                            animal: apiResponse.data, 
                            alreadySaved,
                            img: req.query.img, 
                            name: vernacularName,
                            tracker,
                            lat,
                            long
                            // otherSightings
                        });
                    }
                }).catch(err => {
                    console.log('problem in db call');
                    console.log(err);
                });
            }).catch(err => {
                console.log('problem in axios occurences call');
                console.log(err);
            });
        }).catch(err => {
            console.log('problem in axios name call');
            console.log(err);
        });
    }).catch(err => {
        console.log('problem in axios call');
        console.log(err);
    });
});

module.exports = router;