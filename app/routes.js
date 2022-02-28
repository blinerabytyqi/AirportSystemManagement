module.exports = function(app, passport) {


    app.get('/admin', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/admin/dashboard', isLoggedIn, function(req, res) {
        res.render('admin/dashboard', {
            user : req.user
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });



    // locally --------------------------------
        // LOGIN 
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/admin/dashboard', 
            failureRedirect : '/login', 
            failureFlash : true 
        }));

        // SIGNUP 
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/admin/dashboard', 
            failureRedirect : '/signup', 
            failureFlash : true 
        }));



    // google

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['email ', 'profile'] }));

        app.get('/auth/google/redirect',
            passport.authenticate('google', {
                successRedirect : '/admin/dashboard',
                failureRedirect : '/'
            }));
       };

// route middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/admin');
    }
