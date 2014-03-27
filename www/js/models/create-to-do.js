/* 
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  Perform data operation for create to-do operation 
 *      like:form field validattion,get latitude-longitude for to-do location 
 *      and give service call to create to-do cloud end point.
 */

define([ 
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'services/create-to-do'
], function($, _, Backbone, createToDoService) { 

    var createToDo = Backbone.Model.extend({
        /*
         * Here values of create to-do form will be received from variable-todoDetails.
         * Validation will be performed on these values as follow. If validation get pass
         * then service call to create to-do cloud end point will take place 
         */
        validateToDo: function(todoDetails, callback) {
            var todoTitle = todoDetails.title,
                todoDescription = todoDetails.description,
                todoDeadline = todoDetails.deadline,
                assignedTo = todoDetails.assignedTo,
                todoLocation = todoDetails.longitude;
            if (todoTitle == "" || todoTitle == null) {
                var err = {
                    'value': 'Please enter todo title.',
                    'status': 401
                };
                return callback(err, null);
            } else if (todoDescription == "" || todoDescription == null) {
                var err = {
                    'value': 'Please enter todo description.',
                    'status': 401
                };
                return callback(err, null);
            }else if (todoDeadline == "" || todoDeadline == null) {
                var err = {
                    'value': 'Please select date.',
                    'status': 401
                };
                return callback(err, null);
            } else if (todoLocation == "" || todoLocation == null) {
                var err = {
                    'value': 'Please select Location.',
                    'status': 401
                };
                return callback(err, null);
            } else if (assignedTo == "" || assignedTo == null) {
                var err = {
                    'value': 'Please select user.',
                    'status': 401
                };
                return callback(err, null);
            } else {
                createToDoService.insertToDo(todoDetails, function(err, res) {
                    if (res) {
                        return callback(null, res);
                    } else {
                        error = {
                            value: err,
                            status: 401
                        };
                        return callback(error, null);
                    }
                });
            }
        },

        /*
         * When user will click on map while creating to-do.This function will give latitude and longitude.
         * Value of latitude and longitude will be pushed in GLOBAL variable named createToDoDetails.
         */
        getLatLng: function(locationDetails)
        {            
            var locDetails = locationDetails;
            // Keep the reference to the map object;
            self.map = locDetails.map.map;
            // Map is being shown, lets populate it with data points. Create the marker, then add it to the map
            var pos = new google.maps.LatLng(locDetails.res.lat, locDetails.res.lon);

            createToDoDetails.lat = locDetails.res.lat; //latitude value will be pushed in GLOBAL variable named createToDoDetails.
            createToDoDetails.lng = locDetails.res.lon; //longitude value will be pushed in GLOBAL variable named createToDoDetails.

            var marker = new google.maps.Marker({
                position: pos,
                map: self.map, //Create marker on map
                title: "Current Location"
            });

            google.maps.event.addListener(self.map, 'click', function(event) {
                createToDoDetails.lat = event.latLng.lat();     //This function will respond if user click on map            
                createToDoDetails.lng = event.latLng.lng();     //latitude and longitude of that point will be pushed in GLOBAL variable named createToDoDetails.   
                placeMarker(event.latLng);
            });

            // This function will place new marker where user click on map.
            function placeMarker(location) {
                if (marker == undefined) {
                    marker = new google.maps.Marker({
                        position: location,
                        map: map                         
                    });
                }
                else {
                    marker.setPosition(location);
                }
            }
        }
    });
    return createToDo;
});