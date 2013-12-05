/*
  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.

  The purpose of file is to define all the route mappings of the applications.
*/

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'views/login',
    'views/todo-list',
    'views/todo-details',
    'views/complete-to-do',
    'views/select-location',
    'views/create-to-do',
    'views/location',
    'views/about',
    'views/completed-at'
], function($, _, Backbone, loginView, todoListView, todoDetailsView, completeToDoView, selectLocationView, createToDoView, 
    locationView, aboutView, completedAtView) {
    
    // Define Router.
    var AppRouter = Backbone.Router.extend({
        routes: {
            // Define URL routes
            '': 'login',
            'todoList': 'todoList',
            'createToDo': 'createToDo',
            'todoDetails': 'todoDetails',
            'competeToDo': 'competeToDo',
            'selectLocation': 'selectLocation',
            'location': 'location',
            'about': 'about',
            'completedAt': 'completedAt'
        }
    });

    // Initialize all router actions.
    var initialize = function() {    
        var app_router = new AppRouter;
        app_router.on('route:login', function() { //action for '' route i.e for login 
            var loginViews = new loginView();
            loginViews.render();
        });

        app_router.on('route:todoList', function() { //action for todoList route i.e for ToDo listing page
            var todoListViews = new todoListView();
        });

        app_router.on('route:createToDo', function() { //action for todoList route i.e for ToDo create page
            var createToDoViews = new createToDoView();
        });

        app_router.on('route:todoDetails', function() { //action for 'todoDetails' route i.e for ToDo details page 
            var todoDetailsViews = new todoDetailsView();
            todoDetailsViews.render();
        });

        app_router.on('route:competeToDo', function() { //action for 'competeToDo' route i.e for ToDo complete page 
            var completeToDoViews = new completeToDoView();
            completeToDoViews.render();
        });

        app_router.on('route:selectLocation', function() { //action for 'selectLocation' route i.e for select location page
            var selectLocationViews = new selectLocationView();
            selectLocationViews.render();
        });

        app_router.on('route:location', function() { //action for 'location' route i.e for location page
            var locationViews = new locationView();
            locationViews.render();
        });

        app_router.on('route:about', function() { //action for 'about' route i.e for about page 
            var aboutViews = new aboutView();
            aboutViews.render();
        });

        app_router.on('route:completedAt', function() { //action for 'completedAt' route i.e for completedAt page 
            var completedAtViews = new completedAtView();
            completedAtViews.render();
        });
        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});
