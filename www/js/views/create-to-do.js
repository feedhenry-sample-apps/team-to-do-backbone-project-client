/*  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  Create Todo's
 *  - Render View.
 *  - Handle various events.
 *  - Navigation Logic.
 *  - Logic for selecting the details needed for creating new todo.
 */

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'text!templates/create-to-do.html',
    'models/create-to-do',
    'views/select-location',
    'models/menu',
    'models/fetch-users',
    'models/custom'
], function($, _, Backbone, todoDetailsTemp, createToDoModel, selectLocationView, menuModel, fetchUsersModel, customModel) {
    var menuMdl,
            currentView,
            createToDoViewss = Backbone.View.extend({
        el: $('.mainContainer'),
        events: {
            'click #create': 'createToDo',
            'click #todoLocation': 'selectLocation',
            'click #backToList': 'backToDoList'
        },
        initialize: function() {
            currentScreen = "createToDo";     // used to track for current screen,which will help for back button implementation
            menuMdl = new menuModel();
            currentView = this;
            var fetchUsersMdl = new fetchUsersModel();

            // call to model method which will return user list
            fetchUsersMdl.getUsers(function(err, res) {
                if (res) {
                    currentView.render();
                }
            });
        },
        render: function() {
            customModel.hideMask();                         //hide loading mask
            this.$el.empty();                                       // clear pervious screen
            var compiledTemplate = _.template(todoDetailsTemp);     // loading html template 
            this.$el.append(compiledTemplate);                      // rendering or appending html 

            menuMdl.loadMenu();
            this.populateUsersList();
            var todoDetails = createToDoDetails;                    // Assigning value of global variable createToDoDetails 

            // if createToDoDetailsvariable contain values.We will refill create todo form with the help of this values                               
            if (todoDetails !== undefined && todoDetails !== null)
            {
                $("#todoTitle").val(todoDetails.title);
                $("#todoDescription").val(todoDetails.description);
                $('#todoDeadline').val(todoDetails.deadline);
                if (todoDetails.lat !== null && todoDetails.lat !== undefined)
                {
                    $("#todoLocation").val(todoDetails.lat.toPrecision(5) + "," + todoDetails.lng.toPrecision(5));
                    $("#hiddenLocation").val(todoDetails.lat + "," + todoDetails.lng);
                }
                $('#userList').val(todoDetails.user).attr("selected", "selected");
            }

            // This will initiate datetimepicker object 
            $('.datepicker').datetimepicker({
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0,
                autoclose: 1,
                startDate: new Date(),
                pickerPosition: 'bottom-left'
            });
        },
        // This function will get call when user click on create button. Pick all values from craete to-do form              
        createToDo: function() {
            customModel.showMask();         // Show loading screen

            var todoDetail = {},
                    title = $("#todoTitle").val(),
                    description = $("#todoDescription").val(),
                    deadline = $("#todoDeadline").val(),
                    userId = $("#userList").children(":selected").attr("id"),
                    locationData = $("#hiddenLocation").val().split(","),
                    latitude = locationData[0],
                    longitude = locationData[1];

            todoDetail = {
                "title": title,
                "description": description,
                "deadline": deadline,
                "assignedTo": userId,
                "latitude": latitude,
                "longitude": longitude
            };

            $("#todoError").css("display", "none");
            var createToDoMdl = new createToDoModel();
            createToDoMdl.validateToDo(todoDetail, function(err, res) {         // call to model method which will validate form fields
                if (res) {
                    createToDoDetails = "";                                     // clearing GLOBAL variable
                    $("#todoError").css("display", "none");
                    currentView.$el.off();
                    Backbone.history.navigate('todoList', {// handle success response
                        trigger: true
                    });
                } else {
                    customModel.hideMask();
                    $("#todoError").css("display", "block");                    // handle error response
                    $("#todoError").html(err.value);
                }
            });
        },
        // This function will pick create todo form value and redirect user to screen where user will select location for to-do.
        selectLocation: function() {
            customModel.showMask();                                 // Show loading mask
            //fetching values from create ToDO form
            var title = $("#todoTitle").val();
            var description = $("#todoDescription").val();
            var deadline = $("#todoDeadline").val();
            var userId = $("#userList").children(":selected").attr("id");
            var userName = $("#userList").val();

            //Assigning value to global variable.This variable will save values for create todo form so it will available to other view.
            createToDoDetails = {
                "title": title,
                "description": description,
                "deadline": deadline,
                "assignedTo": userId,
                "user": userName
            };
            this.$el.off();
            Backbone.history.navigate('selectLocation', {trigger: true});
            selectedToDo = null; //clearing GLOBAL variable
        },
        populateUsersList: function() {
            // this function will attach user list
            var list = usersList.payload.fetchUsers.userList;
            for (var i = 0; i < list.length; i++)
            {
                $('#userList').append(' <option value="' + list[i].userName + '" id="' + list[i].userId + '">' + list[i].userName +
                        '</option>');
            }
        },
        backToDoList: function()
        {
            this.$el.off();
            Backbone.history.navigate('todoList', {
                trigger: true
            });
        }
    });
    return createToDoViewss;
});


