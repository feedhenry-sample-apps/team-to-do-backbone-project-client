/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  - Renders todo list
 *  - Handles Data related to todo.
 *  - Handle events.
 */

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'text!templates/todo-list.html',
    'views/todo-details',
    'models/session',
    'models/menu',
    'models/custom'
], function($, _, Backbone, todoListTemp, todoDetailsView, sessionModel, menuModel, customModel) {
    var menuMdl, self, resp, dataSetId = "toDo", currentFlag=0,maxRender=1
            todoListView = Backbone.View.extend({
        el: $('.mainContainer'),
        events: {
            'click .list-group-item': 'showToDoDetails', // define action when click on any todo.
            'click #refresh': 'refreshToDoList', // Action for refresh button
            'click .menuNavigation': 'menuNavigation'
        },
        initialize: function() {
            self = this;                                        // Reference to this will be saved in self variable.

            // Sync is initialized here. Configure sync service.
            $fh.sync.init({
                "sync_frequency": 5,
                // "do_console_log": true,
                "notify_sync_started": true,
                "local_update_applied": true,
                "notify_delta_received": true
            });

            sessionModel.load("sessionId", function(err, sessionId) {

                //This function will give session id if it is present in local storage. 
                if (sessionId) {
                    resp = sessionId;
                    var params = {"request": {"header": {"sessionId": resp}, "payload": {}}}; // Creating request parameters.               
                    $fh.sync.notify(self.handleSyncNotifications);  // Get notification and call respective function if get any notification.
                    $fh.sync.manage(dataSetId, null, params);       // Get the Sync service to manage the dataset called "Job LIst".
                }
                else {
                    Backbone.history.navigate('', {
                        trigger: true               // If session id is not present in local storage. User will redirect to login screen.
                    });
                }
            });
        },
        // This method will render view.
        render: function() {
            currentScreen = "todoList";
            customModel.hideMask();                         //hide loading mask
            menuMdl = new menuModel();
            this.$el.empty();                                   // Clear pervious screen
            currentFlag = currentFlag + 1;
            var compiledTemplate = _.template(todoListTemp);    // Loading html template 
            this.$el.append(compiledTemplate);                  // Rendering or appending html 

            $('#todoListing').html('');

            //appending text to left side menu pannel
            sessionModel.load("userDetails", function(err, resp) {
                if (resp) {
                    var details = JSON.parse(resp);
                    $('#guest').html("Welcome " + details.firstName);
                }
                else {
                    $('#guest').html("Welcome to Team To-Dos");
                }
            });

            // scrollable to-do list
            // 60 is addition of margin used for containers
            var elementHeight = $('.top-header').height() + 100 + $('.button-container').height();
            var maxHeight = $(window).height() - elementHeight;
            $('ul.list-group').css({'max-height': maxHeight, 'overflow': 'auto'});

            /*
             * Here GLOBAL variable named todoDetailsResponse will be tested against different conditions
             * Depending on that what to be show on list page will be decided
             */
            if (todoDetailsResponse != undefined && todoDetailsResponse != null && todoDetailsResponse != "") {
                this.populateToDoList(todoDetailsResponse);
            }
            else {
                this.populateToDoList(null);
            }

            customModel.hideMask();
            menuMdl.loadMenu();
        },
        /*
         * This function will be call when there is notifivation form sync service. 
         * It will recevie different notifications as sync_started,delta_received 
         */
        handleSyncNotifications: function(notification) {
            if ('sync_started' == notification.code) {
                self.syncToDoList();    // Call to syncToDoList function
            }
            else if ('delta_received' == notification.code) {
                self.syncToDoList();
            }
            else if ('remote_update_failed' === notification.code) {
                var errorMsg = notification.message ? notification.message.msg ? notification.message.msg : undefined : undefined;
                var action = notification.message ? notification.message.action ? notification.message.action : 'action' : 'action';
                var errorStr = 'The following error was returned from the data store: ' + errorMsg;
            }
        },
        syncToDoList: function() {
            $fh.sync.doList(dataSetId, function(response) {             // Call to sync doList function
                if (Backbone.history.fragment == "todoList")
                {
                    if (Object.keys(response).length == "0") {
                        todoDetailsResponse = null;
                        if (currentFlag <= maxRender)
                            self.render();                                  // This part will handle success response
                    }
                    else {
                        // Response of doList function will be strored in GLOBAL variable named todoDetailsResponse.
                        todoDetailsResponse = response;
                        if (currentFlag <= maxRender)
                            self.render();
                    }
                }
            }, function(code, msg) {
                if (Backbone.history.fragment == "todoList") {
                    todoDetailsResponse = null;              //This part will handle error response
                    self.render();
                }
            });
        },
        showToDoDetails: function(evnt) {                       // action defination when user click on any todo.this action will open todo details page
            var id = $(evnt.currentTarget).attr("id");
            this.unbindEvents();                                // unbind event of current screen before redirected to any other page
            currentFlag = 0;
            Backbone.history.navigate('todoDetails', {});
            var todoDetailsViews = new todoDetailsView();
            todoDetailsViews.render(id);                        // id of selected to-do will be passed to to-do details page
        },
        unbindEvents: function() {
            this.$el.off();
        },
        // populate ToDoList function will populate to-do list and receive doList response.
        populateToDoList: function(todoData) {

            if (todoData != null) {
                var todoListArray = todoData,
                        dataObj;
                $('#todoListing').html('');
                for (var i in todoListArray)
                {
                    dataObj = todoListArray[i].data;
                    if (dataObj.title !== undefined) {
                        $('#todoListing').append('<div class="list-group-item" id="' + dataObj.toDoId + '">' +
                                '<span class="date">' + dataObj.deadline + '</span>' +
                                '<span class="description">' + dataObj.title + '</span>' +
                                ' <span class="arrow-icon pull-right"><i class="icon-chevron-right"></i></span>' +
                                '</div>');
                    }
                }
            } else {
                $('#todoListing').append('No ToDos');
            }
        },
        refreshToDoList: function() {
            currentFlag = 0;
            customModel.showMask(); //functionality of refresh button
            var currentView = this;
            currentView.initialize();
        },
        menuNavigation: function(evnt) {
            var id = $(evnt.currentTarget).attr("id");
            if (id != "guestName") {
                currentFlag = 0;
                this.$el.off();         //This will navigate to respective screen when user click on side menu
                menuMdl.navigate(id);
            }
        }
    });
    return todoListView;
});

