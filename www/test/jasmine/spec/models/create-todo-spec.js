/* 
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  Spec for creating to-do
 */
describe('Model :: createToDo', function() {
    var createToDoModel, done, todoDetails;
    beforeEach(function() {
        done = false;

        require(['models/create-to-do'], function(createToDo) {//loading create-to-do model
            createToDoModel = new createToDo();
            done = true;
        });

        waitsFor(function() {
            return done;
        }, "Create Models");
    });

    describe('Create To-Do', function() {
        it('Create To-Do with empty title', function() { //test-case for Create To-Do with empty title 
            todoDetails = {
                title: "",
                description: "to-do description",
                deadline: "2013-11-10",
                assignedTo: "userName",
                longitude: "19.1213"
            };

            createToDoModel.validateToDo(todoDetails, function(err, res) {
                if (err)
                    expect(err.value).toEqual('Please enter todo title.');
            });
        });

        it('Create To-Do with empty description', function() { //test-case for Create To-Do with empty description
            todoDetails = {
                title: "to-do title",
                description: "",
                deadline: "2013-11-10", //dummy data
                assignedTo: "userName",
                longitude: "19.1213"
            };

            createToDoModel.validateToDo(todoDetails, function(err, res) {
                if (err)
                    expect(err.value).toEqual('Please enter todo description.');
            });
        });

        it('Create To-Do without selecting deadline date', function() { //test-case for Create To-Do without selecting deadline date
            todoDetails = {
                title: "to-do title",
                description: "to-do description",
                deadline: "",                       //dummy data
                assignedTo: "userName",
                longitude: "19.1213"
            };

            createToDoModel.validateToDo(todoDetails, function(err, res) {
                if (err)
                    expect(err.value).toEqual('Please select date.');
            });
        });

        it('Create To-Do without selecting user', function() { //test-case for Create To-Do without selecting user
            todoDetails = {
                title: "to-do title",
                description: "to-do description",
                deadline: "2013-11-10",
                assignedTo: "",                         //dummy data
                longitude: "19.1213"
            };

            createToDoModel.validateToDo(todoDetails, function(err, res) {
                if (err)
                    expect(err.value).toEqual('Please select user.');
            });
        });

        it('Create To-Do without selecting location', function() {//test-case for Create To-Do without selecting location
            todoDetails = {
                title: "to-do title",
                description: "to-do description",   //dummy data
                deadline: "2013-11-10",
                assignedTo: "userName",
                longitude: ""
            };

            createToDoModel.validateToDo(todoDetails, function(err, res) {
                if (err)
                    expect(err.value).toEqual('Please select Location.');
            });
        });

    });

});