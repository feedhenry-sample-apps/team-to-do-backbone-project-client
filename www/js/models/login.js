/* 
 * Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  This model will be perform all data operation related to login.
 *  This model will perform validation and will hit to login cloud end point.
 */

define([ 
    // Includes all dependant libraries / files.   
    'jquery',
    'underscore',
    'backbone',
    'models/session',
    'services/login'
], function($, _, Backbone, sessionModel, loginServices) {

    var login = Backbone.Model.extend({
        initilize: function() {

        },
        
        // This function will receive username and password from login screen. Validation will be performed on this values     
        validate: function(username, password, callback) {            
            var error = '';
            this.applyCSS(username, password);          // Apply CSS based on empty fields.

            if (username == "" && password == "") {
                error = {
                    value: "Please enter username  and password.",
                    status: 401
                };
                return callback(error, null);           // return error to login view
            } else if (username == "") {                

                $("#loginError").html("Please username");
                error = {
                    value: "Please enter username.",
                    status: 401
                };
                return callback(error, null);
            } else if (password == "") {                   
                $("#loginError").html("Please username");
                error = {
                    value: "Please enter pasword.",
                    status: 401
                };
                return callback(error, null);
            } else {                
                // If all field get validate username and password will be passed to login cloud end point service.
                loginServices.authUser(username, password, function(err, res) {
                    if (res) {
                        sessionModel.save("userDetails",JSON.stringify(res.payload.login.userProfile), function(err, resp){
                            
                        });
                        sessionModel.save("sessionId", res.header.sessionId, function(err, resp) {
                            if (resp) {
                                return callback(null, "true");
                            } else {
                                error = {
                                    value: "Error in server.",
                                    status: 401
                                };
                                return callback(error, null);
                            }
                        });
                    } else {
                        error = {
                            value: err.response.payload.error.description,
                            status: 401
                        };
                        return callback(error, null);
                    }
                });
            }
        },
        // Method apply CSS to empty fields.
        applyCSS: function (username, password) {
            $("#loginError").css("display", "none");
            if (username === "") {                
                // Apply CSS to various element to reflect error condition.
                $("#username").css("border", "none");
                $("#username").css("border", "1px solid red");
                $("#loginError").css("display", "block");
            }
            if (password === "") {
                // Apply CSS to various element to reflect error condition.
                $("#password").css("border", "none");
                $("#password").css("border", "1px solid red");
                $("#loginError").css("display", "block");
            }
        }

    });
    return login;
});
