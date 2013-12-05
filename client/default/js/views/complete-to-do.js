/*  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  Complete todo's
 *  - Rendering view.
 *  - Select various details for todo completion.
 *  - Handle all events.
 */

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'text!templates/complete-to-do.html',
    'models/menu',
    'models/todo-operations',
    'models/custom'
], function($, _, Backbone, completeToDoTemp, menuModel, todoOperationsModel, customModel) {
    var menuMdl,
            completeToDoView = Backbone.View.extend({
        el: $('.mainContainer'),
        events: {
            'click #submit': 'completeToDo', // Action for submit button click
            'click #backToList': 'backToDoList',
            'click #completedAt': 'selectLocation', // action when user click to capture location
            'click #photoproof': 'capturePhoto'             // action when user click to capture photo 
        },
        initialize: function() {
            currentScreen = "completeToDo";                 // used to track for current screen,which will help for back button implementation
            if (selectedToDo == '' && completeToDoDetails == '' && selectedToDo == null) {
                this.$el.off();
                Backbone.history.navigate('todoList', {
                    trigger: true
                });
            }
            if (selectedToDo != undefined && selectedToDo != "") {
                completeToDoDetails.toDoId = selectedToDo.toDoId;
            }
            menuMdl = new menuModel();
        },
        render: function() {
            var d = new Date();
            //creating formated date from system's curren date
            var autodate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes();
            this.$el.empty();                                           // clear pervious screen
            var compiledTemplate = _.template(completeToDoTemp);        // loading html template 
            this.$el.append(compiledTemplate);                          // rendering or appending html 
            customModel.hideMask();                         //hide loading mask
            var completeDetail = completeToDoDetails;
            // Check for undefined / null details
            if (completeDetail !== undefined && completeDetail !== null) {
                $("#completeNote").val(completeDetail.note);
                $("#completedOn").val(completeDetail.completedOn);

                if (completeDetail.lat != null && completeDetail.lat != '') {
                    $("#completedAt").val(completeDetail.lat.toPrecision(5) + "," + completeDetail.lng.toPrecision(5));
                    $("#hiddenLocation").val(completeDetail.lat + "," + completeDetail.lng);
                }
            }

            // Populated Date / Time Picker.
            $('.datetimepicker').datetimepicker({
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0,
                autoclose: 1,
                endDate: new Date(),
                pickerPosition: 'bottom-left'
            }).on('changeDate', function(ev) {
                var d = new Date(Date.parse(ev.date));
                var dateString = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                var curr_date = new Date();
                var dateTime = dateString + " " + curr_date.getHours() + ":" + curr_date.getMinutes();
                $('#completedOn').val('');
                $('#completedOn').val(dateTime);
            });
            $('#completedOn').val('');
            $('#completedOn').val(autodate); //pre-fill current date-time 
            menuMdl.loadMenu();

            $("#photoproof").css("display", "block");
            $("#photoContainer").css("display", "none");
            $("#photoproof").val(null);
        },
        /*
         *  This function will get call when user click on submit to-do button.
         *  pick all values from complete to-do form 
         */
        completeToDo: function() {
            customModel.showMask();                         // Show loading screen

            var currentview = this,
                    operarionType = "complete",
                    id,
                    completeNote = $("#completeNote").val(),
                    completedOn = $("#completedOn").val(),
                    completedAt = $("#hiddenLocation").val().split(","),
                    latitude = completedAt[0],
                    longitude = completedAt[1],
                    photoproof = $('#photoproof').val();
            if (selectedToDo != null && selectedToDo != "") {
                id = selectedToDo.toDoId;
            }
            if (completeToDoDetails != null && completeToDoDetails != "") {
                id = completeToDoDetails.toDoId;
            }
            var completeDetails = {
                "toDoId": id,
                "note": completeNote,
                "completedOn": completedOn,
                "latitude": latitude,
                "longitude": longitude,
                "photo": photoproof
            };
            $("#submitError").css("display", "none");   // Apply CSS

            var todoOperationsMdl = new todoOperationsModel;
            todoOperationsMdl.validateToDo(operarionType, completeDetails, function(err, res) {
                if (res) {
                    //handle success response
                    completeToDoDetails = null;
                    currentview.$el.off();
                    Backbone.history.navigate('todoList', {
                        trigger: true});
                }
                else {
                    //handle error response 
                    customModel.hideMask();
                    $("#submitError").css("display", "block");
                    $("#submitError").html(err.value);

                }
            });
        },
        /*
         *  This function will pick complete todo form value and redirect user to screen 
         *  where user will select location for complete to-do proof. 
         */
        selectLocation: function() {
            customModel.showMask();                                 // Show loading mask
            // Fetching values from create ToDO form
            $("#photoproof").val(null);
            var note = $("#completeNote").val(),
                    completeDate = $("#completedOn").val(),
                    photoProof = $("#photoproof").val(),
                    todoID;
            if (selectedToDo != null && selectedToDo != "") {
                todoID = selectedToDo.toDoId;
            }
            if (completeToDoDetails != null && completeToDoDetails != "") {
                todoID = completeToDoDetails.toDoId;
            }

            //Assigning value to global variable.This variable will save values for complete todo form so it will available to other view.
            completeToDoDetails = {
                "toDoId": todoID,
                "note": note,
                "completedOn": completeDate,
                "photo": photoProof
            };
            selectedToDo = null;        // clearing GLOBAL variable
            Backbone.history.navigate('completedAt', {trigger: true});
        },
        // Function will handle click photo request.
        capturePhoto: function() {
            $("#submitError").css("display", "none");
            var todoOperationsMdl = new todoOperationsModel;
            todoOperationsMdl.getPhoto(function(err, res) {         // Call to model method which will open 
                // Device's camera and allow user to click photo
                // Response will be base64 format
                if (res) {
                    $("#photoproof").css("display", "none");
                    $("#photoproof").val(res.b64);
                    completeToDoDetails.photo = res.b64;
                    $("#photoThumbnail").html('');
                    $("#photoThumbnail").append('<img src="data:image/png;base64,' + res.b64 + '" border="0" alt="an image base64 encoded" />');
                    $("#photoContainer").css("display", "block");
                } else {
                    $("#submitError").css("display", "block");
                    $("#submitError").html("Error in capturing photo");
                }
            });
        },
        backToDoList: function()
        {
            if (selectedToDo != null)
            {
                this.$el.off();
                Backbone.history.navigate('todoDetails', {
                    trigger: true
                });
            }
            else {
                this.$el.off();
                Backbone.history.navigate('todoList', {
                    trigger: true
                });
            }
        }
    });
    return completeToDoView;
});


