/* Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 * 
 * Handles request for fetch User List.
 */

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'models/session',
    'services/fetch-users'
], function($, _, Backbone, sessionModel, fetchUsersServices) {
    var userList = Backbone.Model.extend({        
        initilize: function() {
        },
        getUsers: function(callback) {
            fetchUsersServices.fetchUsers(function(err, res) {   // service call to fetch userlist
                if (res) {   
                    usersList = res;
                    return callback(null,res);                  // handle success response
                }
                else {
                    return callback(err,null);                  // handle error response
                }
            });
        }
    });
    return userList;
});
