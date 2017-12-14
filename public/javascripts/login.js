$(document).ready(function() {
    window.localStorage.clear();

    //New user functions
    //Text color changes
    $('#new_user').hover(function() {
        $('#new_user').css("color", "gray");
    }, function() {
        $('#new_user').css("color", "black");
    });

    //Register instead of login
    $('#new_user').on("click", function() {
        $("#entry_errors").html("");
        $('#login').hide();
        $('#register').show();
    });

    //Existing user functions
    //Text color changes
    $('#existing_user').hover(function() {
        $('#existing_user').css("color", "gray");
    }, function() {
        $('#existing_user').css("color", "black");
    });

    //Register instead of login
    $('#existing_user').on("click", function() {
        $("#entry_errors").html("");
        $('#register').hide();
        $('#login').show();
    });

    //Login button
    $('#login_btn').click(function(e) {
        e.preventDefault();
        var username = $("#username").val();
        var password = $("#password").val();
        checkExistence(username, password);
    });

    //Register button
    $('#signup_btn').click(function(e) {
        e.preventDefault();
        var username = $("#new_username").val();
        var password = $("#new_password").val();
        var confirm_password = $("#confirm_password").val();
        if (password != confirm_password) {
            $("#entry_errors").html("Passwords don't match.");
            $('#login').hide();
            $('#register').show();
        } else {
            makeUser(username, password);
        }
    });
});

function checkExistence(username, password) {
    var usernames = JSON.parse(localStorage.usernames);
    if (usernames == null) { //usernames array doesn't exist yet
        $("#entry_errors").html("Username doesn't exist.");
    } else if (!(username in usernames) || (usernames[username] != password)){ //check if username even exists ADD PASSWORD ASPECT

        $("#entry_errors").html("Wrong username and/or password.");
    } else { 
        localStorage.username = username;
        console.log(localStorage.username);
        location.href = '/user/'+localStorage.username;
    }
}

function makeUser(username, password) {
    //check if user exists already
    var check_names = localStorage.usernames;
    if (check_names == null) { //usernames array doesn't exist yet
        let usernames = {};
        usernames[username] = password;
        localStorage.usernames = JSON.stringify(usernames);
        $("#entry_errors").html("User has been created.");
    } else if (check_names.indexOf(username) != -1) { //check if username already exists
        $("#entry_errors").html("Username already exists.");
    } else { //user needs to be made!
        let usernames = JSON.parse(localStorage.usernames);
        usernames[username] = password;
        localStorage.usernames = JSON.stringify(usernames);
        $("#entry_errors").html("User has been created.");
    }
}