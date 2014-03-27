/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.  
 * 
 *  Entry point for application. Includes all dependacies, initializes Router.
 *  Or can include any common stuff need to be handled throught application.
*/

// Loads application level dependant libraries.
require.config({
    paths: {
        feedhenry: 'lib/feedhenry',
        jquery: 'lib/jquery-1.10.2',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        bootstrap:'../bootstrap/js/bootstrap',
        datetimepicker:'../bootstrap/datepicker/bootstrap-datetimepicker.min'
    },

    // Configure the dependencies, exports, and custom initialization for older, traditional "browser globals" scripts 
    // that do not use define() to declare the dependencies and set a module value.
    shim: {
        'backbone': {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        'bootstrap':{
            deps: ["jquery"],
            exports: "Bootstrap"
        },
        'datetimepicker':{
            deps: ["jquery"],
            exports: "Datetimepicker"
        }
    }
});


// Start the main app logic.
require([
    // Loading appRouter module 
    'app-router', // Request router.js

], function(Router) {
    Router.initialize();
});
  