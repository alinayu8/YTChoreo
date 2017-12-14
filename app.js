var express = require("express");
var app = express();
var morgan = require('morgan');
var qs = require('qs');
var fs = require('fs');

app.use(morgan('tiny'));

//Handle static files
app.use(express.static(__dirname + '/public'));

//Set views directory
app.set('views', __dirname + '/views');

//Define view engine
app.set('view engine', 'ejs');

//Routes
require('./routes/index.js').init(app);
require('./routes/user.js').init(app);
require('./routes/mongoModelRoute.js').init(app);

//Catch routes with error message
app.use(function(request, response) {
    var message = 'Error, did not understand path '+request.path;
    // Set the status to 404 not found, and render a message to the user.
    response.status(404).render('error', { 'message': message });
});

app.listen(50000);
console.log("Server listening at http://localhost:50000/");