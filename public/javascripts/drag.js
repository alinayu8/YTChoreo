$(document).ready(function() { 
  var result = ''; //define within this function
  var username = localStorage.username;
  var project = localStorage.project;

  $.ajax({
      url: '/user/' + username + '/' + project,
      type: 'get',
      success: function(data) {
        result = JSON.parse(data)[0];
      }
  });

  //click a dancer
  $("body").on("click",".static",function(e){
      var dancer = $(this).html();
      localStorage.dancer = dancer; //current dancer

      //retrieve color
      var dancers = JSON.parse(result["dancers"]);
      var dancer_color = dancers[dancer];
      $("#formations").append("<div class=\"dot move\" id=\"movedot" + "_" + dancer + "\">" + dancer + "</div><br>")
      $("#movedot_" + dancer).css("background-color", "#" + dancer_color);

      //make dancer draggable
      e.stopPropagation();
      dragElement(document.getElementById(("movedot_" + localStorage.dancer)));
  });

    //Rest player values if click outside of a player
    $(document).click(function(){
        localStorage.player = '';
        localStorage.y = null;
        localStorage.x = null;
    });

    //change dancer value whenever click on movable dancer
    $(".move").on("click", function(e) {
      var dancer = $(this).html();
      localStorage.dancer = dancer;
    });
 
  //Make the DIV element draggagle (maybe make new js file)
  //CREDIT: Taken from w3schools
  function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      localStorage.y = elmnt.style.top;
      localStorage.x = elmnt.style.left;

      updateFormation();
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  function updateFormation() {
    var exist_form = result["formations"];

    var time = localStorage.time;
    var dancer = localStorage.dancer;
    var x = localStorage.x;
    var y = localStorage.y;

    //Check existence of formations structure
    if (exist_form == null) {
      var formations = {};
    } else {
      var formations = JSON.parse(exist_form);
    }
    //Check existence of time in formations
    //console.log(time);
    if (!(time in formations)) {
      formations[time] = {};
    }

    if (!(dancer in formations[time])) {
      formations[time][dancer] = [];
    }

    formations[time][dancer][0] = x;
    formations[time][dancer][1] = y;
    console.log(JSON.stringify(formations));

    $.ajax({
        url: '/edit/' + username + '/' + project + '/null/' + JSON.stringify(formations),
        type: 'put',
        success: function(data) {
        }
      });
  }
});