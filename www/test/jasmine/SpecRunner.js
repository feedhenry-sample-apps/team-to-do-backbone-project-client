/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.  
 * 
 *  Entry point for test cases. Includes all dependacies.
*/
require.config({
    baseUrl: "../../js/",
    urlArgs: 'cb=' + Math.random(),
    paths: {
        jquery: '../../default/js/lib/jquery-1.10.2',
        underscore: '../../default/js/lib/underscore',
        backbone: '../../default/js/lib/backbone',
        feedhenry: '../../default/js/lib/feedhenry',
        datetimepicker:'../../default/bootstrap/datepicker/bootstrap-datetimepicker.min',
        'jasmine-html': '../test/lib/jasmine-html',
        jasmine: '../test/lib/jasmine',
        spec: '../test/jasmine/spec',
        images:'../images'
    },
    shim: {
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        jasmine: {
            exports: 'jasmine'
        },
        'jasmine-html': {
            exports: 'jasminehtml'
        }
    }
});



require(['jquery', 'jasmine-html'], function($, jasminehtml) {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    var specs = [];

    //Loading specs
    specs.push('spec/models/login-spec');
    specs.push('spec/models/create-todo-spec');
    specs.push('spec/models/todo-operation');

    $(function() {
        require(specs, function() {
            jasmineEnv.execute();
        });
    });
});