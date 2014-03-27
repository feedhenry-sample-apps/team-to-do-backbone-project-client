/*  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  This service will hit to fetch user cloud end point using $fh.act
 */

define([
    // Includes all dependant libraries / files.
    'models/session'
], function(sessionModel) {
    var users = {
        fetchUsers: fetchUsers
    };
    function fetchUsers(callback) {
        sessionModel.load("sessionId", function(err, sessionId) {   // fetch seession id from local storge
            if (sessionId) {
                var params = 
                {
                    "request": {                                    // creating request parameters
                        "header": { "sessionId": sessionId },
                        "payload": { }
                    }
                };
                // Call to fetchUserListAction end point using $fh.act api.
                $fh.act({
                    "act": "fetchUserListAction",
                    "req": params,
                    "timeout": 25000,
                    secure: true
                }, function(res) {
                    return callback(null, res.response);                // Returning success callback
                }, function(msg, err) {
                    return callback(JSON.parse(err.error), null);       // Returning error callback
                });
            }
            else {
                Backbone.history.navigate('', {                         // If session id is not present in local storage redirect user to login page
                    trigger: true
                });
            }
        });
    }
    return users;
});




    