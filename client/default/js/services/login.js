/*  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  Purpose : This service will hit to cloud end point using $fh.act
 */

define([
], function() {

    var authentication = {
        authUser: authUser          // Method declaration.
    };

    // Call to cloud end point service goes here.
    function authUser(userId, password, callback) {
        // Request Param.
        var params = 
        { 
            "request": { 
                "header": {
                    "appType": "Client"
                },
                "payload":
                {
                    "login":
                    {
                        "userName": userId,
                        "password": password
                    }
                }
            }
        };

        // Call to authenticateAction end point using FeedHenry $fh.act api.
        $fh.act({
            "act": "authenticateAction",    // Will hit to cloud end point
            "req": params,
            "timeout": 10000,               // Timeout.
            secure: true
        }, function(res) {
            return callback(null, res.response);              // Returning success callback
        }, function(msg, err) {
            console.log(err.error);
            return callback(JSON.parse(err.error, null));      // Returning error callback
        });
    }
    return authentication;
});




    