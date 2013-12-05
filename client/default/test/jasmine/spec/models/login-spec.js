/* 
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 *  Spec for login flow
 */
describe('Model :: login', function() {
    var loginModel;
    beforeEach(function() {
        done = false;

        require(['models/login'], function(login) {
            loginModel = new login();
            done = true;
        });

        waitsFor(function() {
            return done;
        }, "Create Models");
    });

    describe('Authentication', function() {
        it('Login with empty username and password', function() {
            loginModel.validate("", "", function(err, res) {
                if (err)
                    expect(err.value).toEqual('Please enter username  and password.');
            });
        });

        it('Login with empty username', function() { //test-case for login with empty username
            loginModel.validate("", "dummyPassword", function(err, res) {
                if (err)
                    expect(err.value).toEqual('Please enter username.');
            });
        });

        it('Login with empty password', function() { //test-case for login with empty password
            loginModel.validate("dummyUsername", "", function(err, res) {
                if (err)
                    expect(err.value).toEqual('Please enter pasword.');
            });
        });
    });

});