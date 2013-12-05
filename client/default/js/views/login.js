/* 
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  Login View :
 *  - Rendering view.
 *  - Handle events.
 *  - Navigation logic.
 *  - Sync with Model for data.
 */

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'text!templates/login.html',
    'models/login',
    'views/todo-list',
    'models/session',
    'models/custom'
], function($, _, Backbone, loginTemp, loginModel, todoListView, sessionModel, customModel) {

    var loginView = Backbone.View.extend({
        el: $('.mainContainer'), // This will refer to div on index page having class mainContainer
        events: {
            'click #loginBtn': 'login'          // Defined event when login button will be clicked
        },
        initialize: function() {
            localStorage.removeItem("sessionId");           // When App will be open local storage data will be cleared
            sessionModel.load("sessionId", function(err, sessionID) {
                if (sessionID) {
                    Backbone.history.navigate('todoList', {
                        trigger: true
                    });
                }
            });
        },
        render: function() {
            currentScreen = "login";                                //keep track of current screen,so that it will help in back button implementation.
            this.$el.empty();                                       // Clear pervious screen
            var compiledTemplate = _.template(loginTemp);           // Loading html template 
            this.$el.append(compiledTemplate);                      // Rendering or appending html             
        },
        login: function() {
            customModel.showMask();                                 // Show loading mask
            var currentView = this;                                 // Storing refrence to this in currentView variable.
            var id = $.trim($("#username").val()),                  // Trimming the Login Id
                pass = $("#password").val(),
                loginMdl = new loginModel();

            // Call to model function.Model function will validate login credentials
            loginMdl.validate(id, pass, function(err, res) {
                todoDetailsResponse = "";
                if (res) {
                    currentView.$el.off();
                    // If all fields are validated user will be redirected to to do list page 
                    Backbone.history.navigate('todoList', {
                        trigger: true
                    });
                    $("#loginError").css("display", "none");
                }
                else {
                    customModel.hideMask();
                    $("#loginError").css("display", "block");       // Error will be shown here
                    $("#loginError").html(err.value);
                }
            });
        }
    });
    return loginView;
});
