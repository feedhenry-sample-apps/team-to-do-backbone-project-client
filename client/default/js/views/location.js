/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  View provides provision to select location
 *  - Renders map on view.
 *  - Handle Events
 *  - Navigation Logic.
 */

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'views/create-to-do',
    'text!templates/location.html',
    'models/load-map',
    'views/todo-details',
    'views/todo-list',
    'models/menu',
    'models/custom'

], function($, _, Backbone, createToDoView, locationTemp, loadMapModel, todoDetailsView, todoListView, menuModel, customModel) {
    var menuMdl,
            locationView = Backbone.View.extend({
        el: $('.mainContainer'),
        events: {
            'click #back': 'back', // define action when click on back button.
        },
        initialize: function() {
            // This are the GLOBAL variable used to track current screen and previous screen which will be used in back button implementation
            previousScreen = currentScreen;
            currentScreen = "location";
        },
        render: function() {
            this.$el.empty();                                   // clear pervious screen                                                
            var compiledTemplate = _.template(locationTemp);    // loading html template 
            this.$el.append(compiledTemplate);

            var loadMapMdl = new loadMapModel();
            loadMapMdl.show(function(err, locDetails) {
                if (locDetails) {
                    customModel.hideMask();                         //hide loading mask
                    self.map = locDetails.map.map;  // Keep the reference to the map object;
                    // Map is being shown, lets populate it with data points. Create the marker, then add it to the map.
                    var pos = new google.maps.LatLng(locDetails.res.lat, locDetails.res.lon);
                    var marker = new google.maps.Marker({
                        position: pos,
                        map: self.map,
                        title: "Current Location"
                    });
                    $("#mapError").css("display", "none");
                }
                else {
                    customModel.hideMask();                         //hide loading mask
                    $("#mapError").css("display", "block");
                    $("#mapError").html(err.value);
                }

            });
            menuMdl = new menuModel();
            menuMdl.loadMenu();
            if (selectedToDo != null && selectedToDo != undefined) {
                $('#locTitle').html('To-Do Location');
            }
            else {
                $('#locTitle').html('My Location');
            }
        },
        // Action defination when user click on any todo.this action will open todo details page
        back: function() {
            if (undefined != selectedToDo) {
                this.$el.off();
                Backbone.history.navigate('todoDetails', {trigger: false});
                var detailsView = new todoDetailsView();
                detailsView.render(selectedToDo.toDoId);
            }
            else {
                this.$el.off();
                Backbone.history.navigate('todoList', {trigger: false});
                var todoListViews = new todoListView();
                todoListViews.render();
            }
        },
    });
    return locationView;
});

