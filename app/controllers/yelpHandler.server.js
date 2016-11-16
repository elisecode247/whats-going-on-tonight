'use strict';
var Yelp = require('yelp');
var Bars = require('../models/bars.js');
var Users = require('../models/users.js');

function yelpHandler() {
    var yelp = new Yelp({
        consumer_key: process.env.YELP_KEY,
        consumer_secret: process.env.YELP_SECRET,
        token: process.env.YELP_TOKEN,
        token_secret: process.env.YELP_TOKEN_SECRET,
    });
    this.search = function(req, res) {
        yelp.search({
                term: 'bar',
                location: req.params.place,
                limit: 4
            })
            .then(function(data) {
                let modifiedData = data.businesses;
                modifiedData.map(function(val){
                   val._id = val.id;
                   val.attending = false;
                });
                for (let i = 0; i < modifiedData.length; i++) {
                        Bars.findOneAndUpdate({
                            '_id': modifiedData[i].id
                        }, {
                            $setOnInsert: {
                                '_id': modifiedData[i].id,
                                'name': modifiedData[i].name,
                                'url': modifiedData[i].url,
                                'image_url': modifiedData[i].image_url,
                                'address': modifiedData[i].location.address,
                                'city': modifiedData[i].location.city,
                                'state': modifiedData[i].location.state_code,
                                'zip': modifiedData[i].location.postal_code,
                                'snippet': modifiedData[i].snippet_text,
                                'attendance': []
                            }
                        }, {
                            upsert: true
                        }).exec(function(err, result) {
                            if (result !== null){
                                if (req.loggedIn){
                                    if (result.attendance.indexOf(req.userId) >= 0){
                                        modifiedData[i].attendance = result.attendance.length -1;
                                        modifiedData[i].attending = true;
                                    } else {
                                        modifiedData[i].attendance = result.attendance.length;  
                                    }
                                } else {
                                    modifiedData[i].attendance = result.attendance.length;
                                }
                            } else {
                                modifiedData[i].attendance = 0;
                            }
                            if(i === modifiedData.length -1){
                                res.json({businesses: modifiedData, loggedIn: req.loggedIn});
                            }

                        });
                    };
            })
            .catch(function(err) {
                console.error(err);
                res.json({error: true});
            });

    };
    this.going = function(req, res) {
        Bars.find({'_id':req.params.bar,'attendance':req.userId})
        .exec(function(err, result){
            if (result[0]){           
                Bars
                .findByIdAndUpdate(req.params.bar,
                    {$pull:{'attendance':req.userId}},
                    {new: true})
                .exec(function(err,result){
                    if (err){throw err; res.json({'error':true})};
                    res.json({'error':'false','attending':false});
                });
            } else {
                Bars
                .findByIdAndUpdate(req.params.bar,
                    {$addToSet:{'attendance':req.userId}},
                    {new: true, passRawResult : true })
                .exec(function(err,result){
                    if (err){throw err; res.json({'error':true})};
                    res.json({'error':'false','attending':true});
            });
            }
        });

    };
}

module.exports = yelpHandler;
