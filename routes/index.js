exports.init = function(app) {
    app.get("/", login);
}

//First open - login screen
login = function(request, response) {
    response.render('login.ejs');
}