/*  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  This service will hit to logout cloud end point using $fh.act
 */
define([
    // Includes all dependant libraries / files.
    'models/session'
], function(sessionModel) {
    var logOff = {
        clearSession: clearSession
    };
    function clearSession(callback) {
        sessionModel.load("sessionId", function(err, sessionID) {       // Fetch seession id from local storge
            if (sessionID) {
                var params = 
                {
                    "request":
                    {
                        "header": { "sessionId": sessionID }, 
                        "payload": { }
                    }
                };

                // Call to logoutAction endpoint using $fh.act api.
                $fh.act({
                    "act": "logoutAction",
                    "req": params,
                    "timeout": 25000,
                    secure: true
                }, function(res) {
                    return callback(null, res.response);                // Returning success callback
                    completeToDoDetails = null;
                }, function(msg, err) {
                    console.log(err.error);
                    return callback(JSON.parse(err.error, null));       // Returning error callback
                });
            }
            else {
                Backbone.history.navigate('', {
                    trigger: true                                       // If session id is not present in local storage redirect user to login page
                });
            }
        });
    }
    return logOff;
});




    