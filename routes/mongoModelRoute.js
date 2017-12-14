var express = require("express");
var app = express();
var qs = require('qs');

var mongoModel = require("../models/mongoModel.js");

exports.init = function(app) {
  app.get("/user/:username/:project_name", getProject);
  app.post("/create/:username/:project_name/:yt_vid/:dancers/:times?/:formations?", postProject);
  app.put("/edit/:username/:project_name/:times?/:formations?", putProject);
}

getProject = function(request, response) { //is this finished
    if (request.params.project_name == 'projects') {
      mongoModel.retrieveAll('projects',
      function(modelData) {
        if (modelData.length) {
          response.send(JSON.stringify(modelData));
        } else {
          var message = "No projects found.";
          response.send(JSON.stringify({title: 'Mongo Demo', obj: message}));
        }
      });
    } else {
      var query = {username: request.params.username, project_name: request.params.project_name};
      mongoModel.retrieve('projects', query,
      function(modelData) {
        console.log(modelData);
        if (modelData.length) {
          response.send(JSON.stringify(modelData));
        } else {
          var message = "No documents with "+ request.query + 
                        " in collection "+ request.params.project_name +" found.";
          response.send(JSON.stringify({title: 'Mongo Demo', obj: message}));
        }
      });
    }
}

postProject = function(request, response) {
    if (Object.keys(request.params).length == 0) {
      response.send(JSON.stringify({title: 'Mongo Demo', obj: "No create message body found."}));
      return;
    }
    mongoModel.create('projects', request.params,
          function(result) {
            // result equal to true means create was successful
            var success = (result ? "Create successful" : "Create unsuccessful");
            response.send(result);
          });
}

putProject = function(request, response) {
    // if there is no filter to select documents to update, select all documents
    var filter = {username: request.params.username, project_name: request.params.project_name};
    // if there no update operation defined, render an error page.
    if (!request.params) {
      response.send(JSON.stringify({title: 'Mongo Demo', obj: "No update operation defined"}));
      return;
    }

   //if times parameter is not submitted
   if (request.params.times == "null") {
      console.log("yeh");
      var f = request.params.formations;
      var update = { '$set': { formations: f } };
    } else { //if times / formations parameter are submitted
      var t = request.params.times;
      var f = request.params.formations;
      var update = { '$set': { times: t, formations: f } };
    }
    mongoModel.update('projects', filter, update,
      function(status) {
        response.send(status);
      });
}

// deleteDancer = function(request, response) {
//     //var result = dancer.deleteDancer(request.params.name);
//     //var stringified = JSON.stringify(dancer.dancersCollection);
//     //response.send(stringified);
//     var filter = {name: request.params.name};
//     mongoModel.remove(
//     request.params.name,
//     filter,
//         function(modelData) {
//           if (modelData.length) {
//             response.send(JSON.stringify(modelData));
//         } else {
//            response.send(JSON.stringify(modelData));
//           var message = "No documents with "+request.query+ 
//                         " in collection "+request.params.name+" found.";
//         }
//     });
// }