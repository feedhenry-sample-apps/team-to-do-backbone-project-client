/* Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 * 
 *  This model contain function to load side menu panel on each screen and functionality to 
 *  navigate based on the menu links
 */

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'models/log-out',
    'models/custom'
], function($, _, Backbone, logOutModel,customModel) {

    var menu = Backbone.Model.extend({
        initilize: function() {

        },
        navigate: function(navigateTo) {
            // Receive keyword which tell to which screen user want to navigate  
            // This function get call when user clicks link from side menu pannel
            selectedToDo = null;     // Clear GLOBAL variable.
            customModel.showMask();         // Show loading screen
            if(navigateTo == "logOut") {   
               var logOutMdl =new logOutModel();    // If user clicks on logout link from menu, call logout end point of model
               logOutMdl.logOut();
            } else {
                Backbone.history.navigate(navigateTo, {
                    trigger: true
                });        
            }
        },
        /* Menu Slider */
        loadMenu: function() {            
            $('#top-menu').toggle(
                    function() {
                        $('#container').css('position', 'fixed');

                        $('#menu').css('height', $(window).height()); // add window height to navigation menu

                        $('#container').animate({left: 230}, 'fast', function() {
                        });
                    },
                    function() {
                        $('#container').css('position', 'absolute');
                        $('#container').animate({left: 0}, 'fast', function() {

                        });
                    }
            );

            //handle device resize( potrait & landscape mode)
            $(window).resize(function() {
                $('#menu').css('height', $(window).height());
            });
        }       

    });
    return menu;
});
