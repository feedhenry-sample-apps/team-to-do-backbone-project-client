/* 
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *  
 *  This service will hit to create todo cloud end point using $fh.sync
 */
define([
    'models/session'
], function(sessionModel) {
    var createToDoResponse = {
        insertToDo: insertToDo
    };
    function insertToDo(todoDetails, callback) {
        var dataSetId ="toDo";
        sessionModel.load("sessionId", function(err, sessionId) {       // fetch seession id from local storge
            if (sessionId) {
                // creating request param
                var params = 
                {
                    "request": {
                        "header": 
                        {
                            "sessionId": sessionId
                        },
                        "payload":
                        {
                            "createToDo":
                            {
                                "title": todoDetails.title,
                                "description": todoDetails.description,
                                "deadline": todoDetails.deadline,
                                "assignedTo": todoDetails.assignedTo,
                                "latitude": todoDetails.latitude,
                                "longitude": todoDetails.longitude
                            }
                        }
                    }
                };
                $fh.sync.doCreate("toDo", params, function(res) {
                    return callback(null, res);                         // Returning success callback
                }, function(code, msg) {
                    return callback(code, null);
                });
            }
            else {
                // if session id is not present in local storage redirect user to login page
                Backbone.history.navigate('', {
                    trigger: true
                });
            }
        });
    }
    return createToDoResponse;
});
    