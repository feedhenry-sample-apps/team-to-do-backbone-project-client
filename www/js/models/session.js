/* 
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  This model will perform session related operation.
 */

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'feedhenry'
], function($, _, Backbone, $fh) {

    //interface----------------------------------
    var store = {
        save: _save, // save a data to local storage
        load: _load, // load a data from local storage
        clear: _clear, // clear a data from local storage
        clearAll:_clearAll
    };

    //implementation-------------------------------

    function _save(modelName, model, callback) {
        var model = model || {};

        localStorage.setItem(modelName, model);
        return callback(null, "true");
    }
    ;

    function _load(modelName, callback) {

        var res = localStorage.getItem(modelName);
        return callback(null, res);
    }
    ;

    function _clear(modelName, callback) {

        localStorage.removeItem(modelName);
        return callback(null, "true");
    }
    ;
    function _clearAll(callback) {
        localStorage.clear();
        return callback(null, "true");
    }
    ;
    return store;

});