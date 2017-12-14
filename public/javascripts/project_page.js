$(document).ready(function() {
  //INITIALIZE

  var result = ''; //define within this function
  var username = localStorage.username;
  var project = localStorage.project;
  var player = null;
  var state = 'play';
  
  $.ajax({
      url: '/user/' + username + '/' + project,
      type: 'get',
      success: function(data) {
        result = JSON.parse(data)[0];
        youtube(result);
        dancer_panel(result);
      }
  });


  //SYNCH WITH YOUTUBE


  //Dancers
  function youtube(result) {
    var youtube_url = result["yt_vid"];
    player = new YT.Player('youtube_vid', {
          height: '390',
          width: '640',
          videoId: youtube_url,
          events: {
            'onStateChange': onPlayerStateChange
          }
        });
  }

  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        state = "play";
        displayFormations();
    } else {
      state = "stop";
      $("#formations").html("");
    }
  }

  function displayFormations() {
      console.log("called");
      var time_passed = [];
      var formations = JSON.parse(result["formations"]);
      var all_dancers = JSON.parse(result["dancers"]);
      var times = JSON.parse(result["times"]);
      var current_seconds = player.getCurrentTime();
      for (var i = 0; i < times.length; i++) {
        var time = times[i];
        if (!time_passed.includes(time) && (current_seconds >= time)) {
          time_passed.push(time);
          $("#formations").html("");
          var dancers = formations[time];
          for (var key in dancers) {
            var dancer = key;
            var x = dancers[dancer][0];
            var y = dancers[dancer][1];
            var dancer_color = all_dancers[dancer];
            console.log(dancer, dancer_color, x, y);
            $("#formations").append("<div class=\"dot move\" id=\"movedot" + "_" + dancer + "\">" + dancer + "</div><br>")
            $("#movedot_" + dancer).css("background-color", "#" + dancer_color);
            $("#movedot_" + dancer).css("top", y);
            $("#movedot_" + dancer).css("left", x);
          }
        }
      }
      if (state != "stop") {
        setTimeout(displayFormations, 200);
      } else {
        $("#formations").html("");
      }
  }

  function dancer_panel(result) {
    var dancers = JSON.parse(result["dancers"]);
    Object.keys(dancers).forEach(function(key) {
      var dancer_color = dancers[key];
      $("#dancer_panel").append("<div class=\"dot static\" id=\"dot" + "_" + key + "\">" + key + "</div><br>");
      $("#dot_" + key).css("background-color", "#" + dancer_color);
    });
  }

  //Formations
  //storing times
  $("#add_time").click(function(e) {
      e.preventDefault();
      var time = $("input[name=time]").val();
      var times = result["times"]; //did not parse
      if (times == null) {
        times = [];
      } else {
        times = JSON.parse(times);
      }
      times.push(time);
      localStorage.time = time; //current time
      times.sort((a, b) => a - b);

      var formations = result["formations"];
      var new_formations = null;

      if (formations == null) {
        new_formations = {};
        new_formations[time] = {};
      } else {
        new_formations = JSON.parse(formations);
        new_formations[time] = {};
      }

      $.ajax({
        url: '/edit/' + username + '/' + project + '/' + JSON.stringify(times) + '/' + JSON.stringify(new_formations),
        type: 'put',
        success: function(data) {
          $("#youtube_time").hide();
          $("#add_time").hide();
          $("#navigate").show();
        }
      });
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

      var dancer = $(elmnt).html();
      localStorage.dancer = dancer;
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
      updateFormation();
    }
  }

  function updateFormation() {
    var formations = JSON.parse(result["formations"]);
    var time = localStorage.time;

    dancer = '';
    var dancer = localStorage.dancer;
    var x = localStorage.x;
    var y = localStorage.y;

    if (formations == null) {
      formations = {};
      formations[time] = {};
    } else if (formations[time] == undefined) {
      formations[time] = {};
    }
    formations[time][dancer] = [];
    formations[time][dancer][0] = x;
    formations[time][dancer][1] = y;
    localStorage.dancer = '';

    console.log(JSON.stringify(formations));
    //update
    $.ajax({
        url: '/edit/' + username + '/' + project + '/null/' + JSON.stringify(formations),
        type: 'put',
        success: function(data) {
          console.log(data);
        }
      });

    //get again
    $.ajax({
      url: '/user/' + username + '/' + project,
      type: 'get',
      success: function(data) {
        result = JSON.parse(data)[0];
      }
  });
  }

  $("#add_formation").click(function(e) {
    $("#formations").html("");
    $("#add_yt_time").show();
    $("#navigate").hide();
    localStorage.dancer = '';
    localStorage.x = null;
    localStorage.y = null;
  });



  //

});