var User = require('../models/user.js');
var user = new User();

exports.init = function(app) {
    app.get("/user/:username", user_page);
    app.get("/project/:project_name", project_page);
}

//user page and content
user_page = function(request, response) {
    var username = user.getUser(request.params.username);
    response.render('user_page', {'username' : username});
}

project_page = function(request, response) {
    var project = user.getProject(request.params.project_name);
    var username = user.getUserName();
    response.render('project_page', {'project_name' : project, 'username' : username });
}