/*  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  Renders map and allow user to select location.
 */

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'text!templates/select-location.html',
    'models/load-map',
    'models/todo-operations',
    'models/custom'
], function($, _, Backbone, selectLocationTemp, loadMapModel, todoOperationsModel, customModel) {
    var locationView = Backbone.View.extend({
        el: $('.mainContainer'),
        events: {
            'click #confirmLocation': 'setLocation'             // Define action when click on set location button.
        },
        initialize: function() {
        },
        render: function() {
            this.$el.empty();                                           // Clear pervious screen
            var compiledTemplate = _.template(selectLocationTemp);      // Loading html template 
            this.$el.append(compiledTemplate);
            var loadMapMdl = new loadMapModel();                        // Created model object
            loadMapMdl.show(function(err, locDetails) {                 // Call to model method which will render map and return                 
                // Latitude and longitude selected point
                if (locDetails) {
                    customModel.hideMask();                         //hide loading mask
                    var todoOperationsMdl = new todoOperationsModel();
                    // Get latitude and longitude of location from map
                    todoOperationsMdl.getLatLng(locDetails);
                    $("#locError").css("display", "none");
                }
                else {
                    customModel.hideMask();                         //hide loading mask
                    $("#locError").css("display", "block");
                    $("#locError").html(err.value);
                }
            });
        },
        // Action defination when user click on any todo. this action will open todo details page.
        setLocation: function() {
            customModel.showMask();                                 // Show loading mask
            this.$el.off();
            Backbone.history.navigate('competeToDo', {trigger: true});
        }
    });
    return locationView;
});

