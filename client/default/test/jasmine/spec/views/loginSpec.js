describe('Login View', function() {

    beforeEach(function() {
        var loginView = this,
            flag = false;
        require(['views/login'], function(login) {
            loginView = new login();
            $('#mainContainer').html(loginView.render());
        });

        waitsFor(function() {
            return flag;
        });
    });

    afterEach(function() {
        loginView.remove();
    });

    describe('Load Login View', function() {
        it('load container div', function() {
            expect(this.view.$el.is(':visible')).toEqual(true);
        });
    });
});