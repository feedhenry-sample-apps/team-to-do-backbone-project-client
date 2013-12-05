/* 
 * Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * This model renders map.
 */

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'views/select-location'
], function($, _, Backbone, selectLocationView) {

    var map = Backbone.Model.extend({
        initilize: function() {
        },
        // Show the map on screen
        show: function(callback) {
            $fh.geo({                                                      //give current location of user
                interval: 0
            }, function(res) {
                if (selectedToDo != null && selectedToDo != undefined) {   //here check is applied to decide what location to be show on map 
                                                                           //if GLOBAL variable selectedToDo is not null i.e user came to this page from to-do details 
                                                                           //page then show location of to-do.otherwise show current location of user
                    res.lat = selectedToDo.location.latitude;
                    res.lon = selectedToDo.location.longitude;
                }
                $fh.map({   //load map 
                    target: document.getElementById('maps_div'),
                    lat: res.lat,
                    lon: res.lon,
                    zoom: 15
                }, function(map) {
                    var locDetails = {
                        "map": map,
                        "res": res
                    };
                    return callback(null, locDetails);
                }, function(error) {
                    error = {
                        value: "Error in loading map.",
                        status: 401
                    };
                    return callback(error, null);
                });
            });
        }
    });
    return map;
});
