module.exports = function(req, res, next) {
    // check if there is no user
    if (!req.user) {
        // send scathing message
        req.flash('error', 'You must be logged in to access this page');
        //redirect to login page
        res.redirect('/auth/login');
    } else {
        //carry on
        next();
    }
}