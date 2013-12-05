/* 
 * Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * This model will perform all data operation related to todo update and todo complete process.
 */

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'models/session',
    'services/update-to-do',
    'services/complete-to-do'
], function($, _, Backbone, sessionModel, updateToDoService, completeToDoService) {

    var todoOperation = Backbone.Model.extend({
        initilize: function() {
        },
        /*  This function validate data of to-do which is to be updated or completed depending upon the operation type. 
         *  If it is update operation it will hit update end point. 
         *  If it is complete operation it will hit complete end point.
         */
        validateToDo: function(operationType, todoData, callback) {            
            if (operationType == "update") {
                if (todoData.description == null || todoData.description == "") {
                    var error = {
                        'value': 'Please enter todo description.',
                        'status': 401
                    };
                    return callback(error, null);
                }
                else if (todoData.note == null || todoData.note == "") {
                    var error = {
                        'value': 'Please enter note.',
                        'status': 401
                    };
                    return callback(error, null);
                } else {
                    updateToDoService.update(todoData, function(err, res) { //if all validation get pass then call update service
                        if (res)
                        {
                            return callback(null, "true");  //handle success response
                        }
                        else {
                            error = {
                                value: err, //handle error response
                                status: 401
                            };
                            return callback(error, null);
                        }
                    });
                }
            }
            // Field level validations.
            if (operationType == "complete") {
                if (todoData.note == null || todoData.note == "") {
                    var error = {
                        'value': 'Please enter complete note.',
                        'status': 401
                    };
                    return callback(error, null);
                } else if (todoData.completedOn == null || todoData.completedOn == "") {
                    var error = {
                        'value': 'Please select date.',
                        'status': 401
                    };
                    return callback(error, null);
                } else if (todoData.latitude == null || todoData.latitude == "") {
                    var error = {
                        'value': 'Please select location.',
                        'status': 401
                    };
                    return callback(error, null);
                } else if (todoData.photo == null || todoData.photo == "") {
                    var error = {
                        'value': 'Please take photo.',
                        'status': 401
                    };
                    return callback(error, null);
                } else {
                    // If all validation get pass then call update service
                    completeToDoService.complete(todoData, function(err, res) {     
                        if (res)
                        {
                            return callback(null, "true");
                        }
                        else {
                            error = {
                                value: err.response.payload.error.description,
                                status: 401
                            };
                            return callback(error, null);
                        }
                    });
                }
            }
        },
        getLatLng: function(locationDetails)
        {
            var locDetails = locationDetails;

            // Keep the reference to the map object;
            self.map = locDetails.map.map;
            // Map is being shown, lets populate it with data points
            // Create the marker, then add it to the map
            var pos = new google.maps.LatLng(locDetails.res.lat, locDetails.res.lon);

            completeToDoDetails.lat = locDetails.res.lat;   //latitude value will be pushed in GLOBAL variable named completeToDoDetails.
            completeToDoDetails.lng = locDetails.res.lon;   //longitude value will be pushed in GLOBAL variable named completeToDoDetails.
            var marker = new google.maps.Marker({
                position: pos,
                map: self.map,
                title: "Current Location"
            });

            google.maps.event.addListener(self.map, 'click', function(event) {
                completeToDoDetails.lat = event.latLng.lat();    //This function will respond if user click on map   
                completeToDoDetails.lng = event.latLng.lng();   //latitude and longitude of that point will be pushed in GLOBAL variable named completeToDoDetails.   
                placeMarker(event.latLng);
            });

            function placeMarker(location) {
                if (marker == undefined) {       //This function will place new marker where user click on map    
                    marker = new google.maps.Marker({
                        position: location,
                        map: map
                    });
                }
                else {
                    marker.setPosition(location);
                }
            }
        },
        /*
         *  This function get call when user click to take photo while completeing to-do
         *  This uses $fh.cam api to take photo
         */
        getPhoto: function(callback)
        {
            
            $fh.cam({
            }, function(res) {
                return callback(null, res); // handle base64 response
            }, function(msg, err)
            {
                return callback(err, null); // handle error response
            });
        }
    });
    return todoOperation;
});
