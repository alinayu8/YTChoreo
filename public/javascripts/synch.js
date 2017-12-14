

function processResponse_2(dance_name) {
var responseObject = JSON.parse(responseJSON);
var displayText = "";
for (var i = 0; i<responseObject.dances.length; i++) {
        var dance = responseObject.dances[i];
        if (dance.name == dance_name) {
            var youtube1 = dance.one;
            var youtube2 = dance.two;
            var youtube3 = dance.three;
            var youtube4 = dance.four;
        }
}
displayVideos(youtube1, youtube2, youtube3, youtube4);
}

//Display YouTube videos
function displayVideos(youtube1, youtube2, youtube3, youtube4) {
if ((typeof player1 !== 'undefined') && (youtube1 != "")) {
    console.log(player1);
    player1.destroy();
}
if ((typeof player2 !== 'undefined') && (youtube2 != "")) {
    console.log(typeof player2);
    console.log(player2);
    player2.destroy();
}
if ((typeof player3 !== 'undefined') && (youtube3 != "")) {
    player3.destroy();
}
if ((typeof player4 !== 'undefined') && (youtube4 != "")) {
    player4.destroy();
}
//Remove window first
$('#window').hide();
//Show header
$('#header').show();
//Display YouTube videos
if (youtube1 != "") {
    player1 = new YT.Player('youtube1', {
      height: '390',
      width: '640',
      videoId: youtube1.slice(32),
      events: {
        'onStateChange': onPlayerStateChange
      }
    });
} else {
    $("#youtube1").hide();
}
if (youtube2 != "") {
    player2 = new YT.Player('youtube2', {
      height: '390',
      width: '640',
      videoId: youtube2.slice(32)
    });
} else {
    $("#youtube2").hide();
}
if (youtube3 != "") {
    player3 = new YT.Player('youtube3', {
      height: '390',
      width: '640',
      videoId: youtube3.slice(32)
    });
} else {
    $("#youtube3").hide();
}
if (youtube4 != "") {
    player4 = new YT.Player('youtube4', {
      height: '390',
      width: '640',
      videoId: youtube4.slice(32)
    });
} else {
    $("#youtube4").hide();
}
}

//Toggle starting windows
$(document).ready(function() {
$('#exit').click(function () {
    $('#window').hide();
})

$('.window-open').click(function() {
    $('.window-open').hide();
    $('.window-new').hide();
});

$('.window-new').click(function() {
    $('.window-open').hide();
    $('.window-new').hide();
    $('#form_new').show();
});

$('.top-new').click(function() {
    $('#saved').hide();
    $('#window').show();
    $('#form_new').show();
    $('#exit').show();
});

$('#form_new').submit(function(event) {
    var formArray = $(this).serializeArray();
    var namesArray = ['name', 'one', 'two', 'three', 'four'];
    var returnArray = {};
    for (var i = 0; i < 5; i++){
        returnArray[namesArray[i]] = formArray[i]['value'];
    }
    doXMLHttpRequest_3(returnArray);
    event.preventDefault();
});

$('#vidtimes').submit(function(event) {
    var formArray = $(this).serializeArray();
    var namesArray = ['duration', 'one', 'two', 'three', 'four'];
    returnArray = {};
    for (var i = 0; i < 5; i++){
        returnArray[namesArray[i]] = formArray[i]['value'];
    }
    loopVideos(returnArray);
    event.preventDefault();
});
});

//Function to loop vids from start time to end time
function loopVideos(vidTimes) {
start1 = +vidTimes['one'];
end1 = +vidTimes['one'] + +vidTimes['duration'];
start2 = +vidTimes['two'] + 1;
end2 = +vidTimes['two'] + +vidTimes['duration'];
start3 = +vidTimes['three'] + 1.4;
end3 = +vidTimes['three'] + +vidTimes['duration']
start4 = +vidTimes['four'] + 2;
end4 = +vidTimes['four'] + +vidTimes['duration'];
if (vidTimes['one'] != '') {
    var vid_url1 = player1.getVideoUrl();
    player1.loadVideoById({
        videoId: vid_url1.slice(vid_url1.length-11), 
        startSeconds: start1, 
        endSeconds: end1 });
}
if (vidTimes['two'] != '') {
    var vid_url2 = player2.getVideoUrl();
    player2.loadVideoById({
        videoId: vid_url2.slice(vid_url2.length-11), 
        startSeconds: start2, 
        endSeconds: end2 });
}
if (vidTimes['three'] != '') {
    var vid_url3 = player3.getVideoUrl();
    player3.loadVideoById({
        videoId: vid_url3.slice(vid_url3.length-11), 
        startSeconds: start3, 
        endSeconds: end3});
}
if (vidTimes['four'] != '') {
    var vid_url4 = player4.getVideoUrl();
    player4.loadVideoById({
        videoId: vid_url4.slice(vid_url4.length-11), 
        startSeconds: start4, 
        endSeconds: end4});
}
}

//Event listener
function onPlayerStateChange(state) {
if (state.data === YT.PlayerState.ENDED) {
    loopVideos(returnArray);
}
}