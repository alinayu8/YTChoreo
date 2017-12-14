$(document).ready(function() {
  //var username = $("#username").html();
  var username = localStorage.username;
  $('#open_proj').click(function() {
      $.ajax({
          url: location.href + '/projects/',
          type: 'get',
          success: function(data) {
            $("#window").text(data);
          }
        });
    });

  $('#new_proj').click(function() {
      $('#window').hide();
      $('#new_proj_form').show();
    });

    $("#add_more_dancers").click(function(e) {
        var wrapper = $(".input_fields_wrap"); //Fields wrapper      
        $(wrapper).append('<input name="dancer_name[]" type="text" placeholder="enter a dancer\'s name"><input name="dancer_color[]" type="color" placeholder="select a dancer\'s color"><br>'); //add input box
        e.preventDefault();
    });

    $("#create_project").click(function(e) {
        e.preventDefault();
        var dancer_names = [];
        var proj_name = $("input[name=proj_name]").val();
        var youtube_url = $("input[name=youtube_url]").val().slice(32);
        var formations = [];
        var dancers = {};

        $('input[name="dancer_name[]"]').each(function() {
            dancer_names.push($(this).val());
        });
        $('input[name="dancer_color[]"]').each(function() {
            let dancer_name = dancer_names.shift();
            dancers[dancer_name] = $(this).val().slice(1);
        });
        $.ajax({
            url: '/create/' + username + '/' + proj_name + '/' + youtube_url + '/' + JSON.stringify(dancers),
            type: 'post',
            success: function(data) {
              if (data) {
                $("#window").hide();
                $("#new_proj_form").hide();
                localStorage.project = proj_name;
                location.href = "/project/" + localStorage.project;
              } else {
                $("#window").html("Create failed. Try again.");
              }
            }
        });
    });

});

