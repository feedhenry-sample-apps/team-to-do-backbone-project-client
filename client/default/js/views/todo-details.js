/*  
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  This screen will display to-do details as well as provde option to update and complete to-do
 */

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'text!templates/todo-details.html',
    'views/complete-to-do',
    'models/todo-operations',
    'models/menu',
    'datetimepicker',
    'models/custom'
], function($, _, Backbone, todoDetailsTemp, completeToDoView, todoOperationsModel, menuModel, Datetimepicker, customModel) {
    var menuMdl;
    var tododetailsView = Backbone.View.extend({
        el: $('.mainContainer'),
        events: {
            'click #complete': 'completeToDo', // Action for complete button 
            'click #update': 'updateToDo', // Action for Update todo button
            'click #todoLocation': 'showToDoLocation', // Action when user click to select location
            'click #backToList': 'backToDoList',
            'click .logo': 'backToDoList'
            
        },
        initialize: function() {
            currentScreen = "todoDetails";                  // used to track for current screen,which will help for back button implementation
            menuMdl = new menuModel();
        },
        render: function(todoId) {
            if (todoId == null) {
                if (selectedToDo != null) {                 //When user click on any todo from todo list page.
                    // Details of that todo will be stored in GLOBAL variable named selectedToDo.   
                    todoId = selectedToDo.toDoId;
                }
                else {
                    this.$el.off();
                    Backbone.history.navigate('todoList', {// Navigate to todo list page
                        trigger: true});
                }
            }

            this.$el.empty();                                       // clear pervious screen
            var compiledTemplate = _.template(todoDetailsTemp);     // loading html template 
            this.$el.append(compiledTemplate);                      // rendering or appending html 

            // value of GLOBAL variable named todoDetailsResponse will be tested against different conditions
            if (todoDetailsResponse !== undefined && todoDetailsResponse !== null) {
                this.populateToDoDetails(todoId);
            }
        },
        //This function will be called when user click on complete todo button.
        completeToDo: function() {
            completeToDoDetails = ''; //clearing value of GLOBAL variable named completeToDoDetails before navigate to complete todo page
            Backbone.history.navigate('competeToDo', {});
            var completeToDoViews = new completeToDoView();
            completeToDoViews.render();
        },
        /*
         * This function will called when user clicks on update button.
         * All update to-do form fields will be pick here and will validate by model function
         */
        updateToDo: function() {
            customModel.showMask();                             // show loading screen
            var operarionType = "update";
            var todoOperationsMdl = new todoOperationsModel();
            var todoDetails = selectedToDo;                     // assign value of GLOBAL variable named selectedToDo
            var updatedDesc = $("#description").val();
            var updatedDeadLine = $("#deadline").val();
            var updatedStatus = $("#status").val();
            var notes = $('#yournotes').val();

            //object containing values to be updated
            var updatedDetails = {
                "toDoId": todoDetails.toDoId, // as we have to update selected to from to-do list.Id of selected to-do                 
                "description": updatedDesc, // will be use at the time of update
                "deadline": updatedDeadLine,
                "latitude": todoDetails.location.latitude,
                "longitude": todoDetails.location.longitude,
                "status": updatedStatus,
                "note": notes

            };
            $("#detailsError").css("display", "none");
            //call to model function which will validate update to-do form field.
            var currentView = this;
            todoOperationsMdl.validateToDo(operarionType, updatedDetails, function(err, res) {
                if (res) {
                    $("#detailsError").css("display", "none");
                    currentView.$el.off();
                    //will handle success response and navigate to todo list page on successful update.
                    Backbone.history.navigate('todoList', {
                        trigger: true
                    });
                }
                else {
                    customModel.hideMask();
                    $("#detailsError").css("display", "block");
                    $("#detailsError").html(err.value);     //will handle error if any in update operation
                    Backbone.history.navigate('todoDetails', {
                        trigger: true});
                }
            });
        },
        //This function receive id of todo selected by user from todo list page and will show details of selected todo
        populateToDoDetails: function(todoId) {
            var todoData = todoDetailsResponse;
            var todoDetailsArray = todoData;

            var dataObj;

            /*
             * This for loop will used to find to-do from to-do list
             * stored in the GLOBAL variable---todoDetailsResponse
             * by using toId received form todo list page and populate 
             * details of selected todo
             */
            for (var i in todoDetailsArray)
            {
                dataObj = todoDetailsArray[i].data;
                if (dataObj.toDoId == todoId)
                {
                    //assign value of to-do to GLOBAL variable selectedToDo,if id of to-do is same as that of received form todo list page. 
                    selectedToDo = dataObj;
                    $(todoTitle).html(dataObj.title);

                    // get values.
                    $('#description').val(dataObj.description);
                    $('#deadline').val(dataObj.deadline);
                    $('#location').val(dataObj.location.latitude + "," + dataObj.location.longitude);
                    $('#yournotes').val(dataObj.note);

                    todostatus = dataObj.status;
                    $('#status').val(todostatus).attr("selected", "selected");
                }
            }
            menuMdl.loadMenu();
        },
        // This redirect user to location assigned for todo when user clicks on Click to map caption in todo details page.
        showToDoLocation: function() {
            customModel.showMask();         // Show loading screen
            this.$el.off();
            Backbone.history.navigate('location', {
                trigger: true
            });
        },
        backToDoList: function()
        {
            this.$el.off();
            Backbone.history.navigate('todoList', {
                trigger: true
            });
        }
    });
    return tododetailsView;
});


