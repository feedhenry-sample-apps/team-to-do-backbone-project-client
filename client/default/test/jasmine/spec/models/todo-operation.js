/* 
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  Spec for to-do operations
 */
describe('Model :: todoOperation', function() {
    var todoOperationsModel, done, todoData, operationType;
    beforeEach(function() {
        done = false;

        require(['models/todo-operations'], function(login) {
            // that.todos = new Todo.Collection();
            todoOperationsModel = new login();
            done = true;
        });

        waitsFor(function() {
            return done;
        }, "Create Models");
    });

    describe('Update To-Do', function() {
        it('Update To-Do with empty description', function() { //test-case for Update To-Do with empty description
            operationType = "update";
            todoData = {        //dummy data
                description: "",
                note: "to-do note text"
            };
            todoOperationsModel.validateToDo(operationType, todoData, function(err, res) {
                if (err)
                    expect(err.value).toEqual('Please enter todo description.');
            });
        });

        it('Update To-Do with empty notes', function() { //test-case for Update To-Do with empty notes
            operationType = "update";
            todoData = {            //dummy data
                description: "to-do description text",
                note: ""
            };
            todoOperationsModel.validateToDo(operationType, todoData, function(err, res) {
                if (err)
                    expect(err.value).toEqual('Please enter note.');
            });
        });

    });

    describe('Complete To-Do', function() {
        it('Complete To-Do with empty complete-note', function() { //test-case for Complete To-Do with empty complete-note
            operationType = "complete";
            todoData = {
                note: "",
                completedOn: "2013-11-10",  //dummy data
                latitude: "19.1212",
                photo: "dummy base64 text"
            };
            todoOperationsModel.validateToDo(operationType, todoData, function(err, res) {
                if (err)
                    expect(err.value).toEqual('Please enter complete note.');
            });
        });

        it('Complete To-Do without selecting completed on date', function() { //test-case for Complete To-Do without selecting completed on date
            operationType = "complete";
            todoData = {
                note: "to-do note text",    //dummy data
                completedOn: "",
                latitude: "19.1212",
                photo: "dummy base64 text"
            };
            todoOperationsModel.validateToDo(operationType, todoData, function(err, res) {
                if (err)
                    expect(err.value).toEqual('Please select date.');
            });
        });

        it('Complete To-Do without selecting location', function() {//test-case for Complete To-Do without selecting location
            operationType = "complete";
            todoData = {
                note: "to-do note text",
                completedOn: "2013-11-10",  //dummy data
                latitude: "",
                photo: "dummy base64 text"
            };
            todoOperationsModel.validateToDo(operationType, todoData, function(err, res) {
                if (err)
                    expect(err.value).toEqual('Please select location.');
            });
        });

        it('Complete To-Do without photo(without base64 text)', function() {//test-case for Complete To-Do without photo(without base64 text)
            operationType = "complete";
            todoData = {
                note: "to-do note text",
                completedOn: "2013-11-10",  //dummy data
                latitude: "12.2343",
                photo: ""
            };
            todoOperationsModel.validateToDo(operationType, todoData, function(err, res) {
                if (err)
                    expect(err.value).toEqual('Please take photo.');
            });
        });

    });

});