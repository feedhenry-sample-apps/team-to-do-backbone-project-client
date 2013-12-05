/* 
 * Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  - This model having functionality to show loading screen on cloud call as well as back button implementation.
 */

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'feedhenry'
], function($, _, Backbone, $fh) {

    // Interface----------------------------------
    var custom = {
        showMask: _showMask, // load mask for loading screen
        hideMask: _hideMask, // hide mask for loading screen

    };

    // Implementation-------------------------------
    function _showMask() {
        var docHeight = $(document).height();
        $("body").append("<div id='overlay'></div>");
        $("#loader").css({'display': 'block'});
        $("#overlay").height(docHeight);
    };

    function _hideMask() {
        $("#overlay").remove();
        $("#loader").css('display', 'none');
    };

    // Back Button Imlementation
    document.addEventListener("backbutton", function() {    // catch back button event
        $('.datepicker').datetimepicker('hide');
        $('.datetimepicker').datetimepicker('hide');

        if (currentScreen == "completeToDo") {
            Backbone.history.navigate('todoDetails', {
                trigger: true});
        }
        else if (currentScreen == "todoDetails") {
            Backbone.history.navigate('todoList', {
                trigger: true});
        }
        else if (currentScreen == "location") {
            Backbone.history.navigate(previousScreen, {
                trigger: true});
        }
        else if(currentScreen != "login"){
            Backbone.history.navigate('todoList', {
                trigger: true});
        }
        else if(currentScreen == "login")
            {
                navigator.app.exitApp(); //exit app on back button press
            }
    });

    return custom;

});