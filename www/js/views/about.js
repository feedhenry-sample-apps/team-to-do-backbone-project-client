/*  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  About Screen
 *  - Handle events.
 *  - View render and navigation logic.
 */

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'text!templates/about.html',
    'models/menu',
    'models/custom'
], function($, _, Backbone, aboutTemp, menuModel, customModel) {
    var menuMdl;
    var aboutView = Backbone.View.extend({
        el: $('.mainContainer'),
        events: {
            'click #backToList': 'backToDoList'
        },
        initialize: function() {
            currentScreen = "about";
            menuMdl = new menuModel();
        },
        render: function() {
            customModel.hideMask();                         //hide loading mask
            this.$el.empty();                                   // clear pervious screen
            var compiledTemplate = _.template(aboutTemp);       // loading html template 
            this.$el.append(compiledTemplate);                  // rendering or appending html 

            menuMdl.loadMenu();
        },
        backToDoList: function()
        {
            this.$el.off();
            Backbone.history.navigate('todoList', {
                trigger: true
            });
        }
    });
    return aboutView;
});

