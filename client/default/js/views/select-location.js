/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  This screen where allow user to select location by clicking on map
 */

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'views/create-to-do',
    'text!templates/select-location.html',
    'models/load-map',
    'models/create-to-do',
    'models/custom'
], function($, _, Backbone, createToDoView, selectLocationTemp, loadMapModel, createToDoModel,customModel) {
    var locationView = Backbone.View.extend({
        el: $('.mainContainer'),
        events: {
            'click #confirmLocation': 'setLocation' //define action when click on any todo.
        },
        initialize: function() {
        },
        render: function() {
            this.$el.empty();                                           // clear pervious screen
            var compiledTemplate = _.template(selectLocationTemp);      // loading html template 
            this.$el.append(compiledTemplate);
            var loadMapMdl = new loadMapModel();
            loadMapMdl.show(function(err, locDetails) {                 // call to model method which will render map
                if (locDetails)
                {
                    customModel.hideMask();                         //hide loading mask
                    var createToDoMdl = new createToDoModel();
                    createToDoMdl.getLatLng(locDetails);                // call to model method to get latitude longitude when user click on map
                }
                else {
                    customModel.hideMask();                         //hide loading mask
                    $("#locError").css("display", "block");
                    $("#locError").html(err.value);
                }
            });
            //rendering or appending html 
        },
        setLocation: function() {                   // action defination when user click on any todo.this action will open todo details page
            customModel.showMask();         // Show loading screen
            this.$el.off();
            Backbone.history.navigate('createToDo', {trigger: true});
        }
    });
    return locationView;
});

