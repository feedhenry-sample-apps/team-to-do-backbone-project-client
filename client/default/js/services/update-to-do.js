/*  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  This service will hit to update to-do cloud end point using $fh.sync
 */

define([
    // Includes all dependant libraries / files.
    'models/session'
], function(sessionModel) {
    // Method Declaration.
    var updateOperation = {
        update: update
    };
    function update(todoData, callback) {
        var dataSetId = "toDo";
        sessionModel.load("sessionId", function(err, sessionID) {               // Fetch seession id from local storge
            if (sessionID) {
                $fh.sync.doRead(dataSetId, todoData.toDoId, function(res) {     // Call to doRead method of sync 
                    res.data.description = todoData.description;
                    res.data.deadline = todoData.deadline;
                    res.data.location.latitude = todoData.latitude;
                    res.data.location.longitude = todoData.longitude;
                    res.data.status = todoData.status;
                    res.data.note = todoData.note;
                    $fh.sync.doUpdate(dataSetId, todoData.toDoId, res.data, function(res) {         // Call to doUpdate method of sync
                        return callback(null, res);
                    },
                    function(code, msg) {
                        return callback(code, null);        // Handle error response
                    });
                }, function(code, msg) {
                    return callback(code, null);
                });
            }
            else {
                Backbone.history.navigate('', {
                    trigger: true                   // If session id is not present in local storage redirect user to login page
                });
            }
        });
    }
    return updateOperation;
});




    