/* Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 * 
 *  This model handles logout request.
 */


define([
    'jquery',
    'underscore',
    'backbone',
    'services/log-out',
    'models/session',
    'models/custom'
], function($, _, Backbone, logOutService, sessionsModel,customModel) {

    var endSession = Backbone.Model.extend({
        initilize: function() {
            // code which will be run on initialize of model
        },
        logOut: function() {
            logOutService.clearSession(function(err, res) {
                if (res) {
                    sessionsModel.clearAll(function(err, res) {           // Call to service which will hit logout end point
                        if (res) {
                            customModel.hideMask();                         //hide loading mask
                            todoDetailsResponse = "";
                            Backbone.history.navigate('', {// Handle success response
                                trigger: true
                            });
                        }
                    });
                } else {
                    customModel.hideMask();                         //hide loading mask
                    todoDetailsResponse = "";
                    Backbone.history.navigate('', {// Handle success response
                        trigger: true
                    });

                }
            });
        }
    });
    return endSession;
});
