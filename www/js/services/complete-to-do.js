/*  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  This service will hit to complete todo cloud end point using $fh.act
 */
define([
    // Includes all dependant libraries / files.
    'models/session'
], function(sessionModel) {
    var completeOperation = {
        complete: complete
    };
    function complete(todoData, callback) {
        sessionModel.load("sessionId", function(err, sessionID) {
            if (sessionID) {                    // Check for session 
                // Request Param.
                var params = 
                {
                    "request":
                    {
                        "header":
                        {
                            "sessionId": sessionID
                        },
                        "payload":
                        {
                            "completeToDo": todoData
                        }
                    }
                };
                // call to completeToDoAction end point.
                $fh.act({
                    "act": "completeToDoAction",
                    "req": params,
                    "timeout": 60000,
                    secure: true
                }, function(res) {
                    return callback(null, res.response);                // Returning success callback
                    completeToDoDetails = null;                         // Clearing GLOBAL variable completeToDoDetails
                }, function(msg, err) {
                    console.log(err.error);
                    return callback(JSON.parse(err.error, null));       // Returning error callback
                });

            }
            else {
                Backbone.history.navigate('', {                         // If session is expired (check local storage) redirect user to login page
                    trigger: true
                });
            }

        });
    }
    return completeOperation;
});




    