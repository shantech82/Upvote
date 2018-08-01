// __________________
// broadcast.js
window.enableAdapter = true;

var connection = new RTCMultiConnection();
//connection.socketURL = '/';
connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/'
connection.socketMessageEvent = 'video-broadcast-demo';

connection.session = {
    audio: true,
    video: true,
    oneway: true
};

connection.stream

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false
};


connection.videosContainer = document.getElementById('videos-container');

connection.onstream = function(event) {
    event.mediaElement.removeAttribute('src');
    event.mediaElement.removeAttribute('srcObject');
    var video = document.createElement('video');
    video.controls = true;
    if(event.type === 'local') {
        video.muted = true;
    }
    video.srcObject = event.stream;
    var width = parseInt(connection.videosContainer.clientWidth / 2) - 20;
    var mediaElement = getHTMLMediaElement(video, {
        title: event.userid,
        buttons: ['full-screen'],
        width: width,
        showOnMouseEnter: false
    });
    connection.videosContainer.appendChild(mediaElement);
    setTimeout(function() {
        mediaElement.media.play();
    }, 5000);
    mediaElement.id = event.streamid;
};
connection.onstreamended = function(event) {
    var mediaElement = document.getElementById(event.streamid);
    if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);
    }
};

document.getElementById('startlive').onclick = function() {
    //disableInputButtons();
    connection.openOrJoin(document.getElementById('room-id').value, function(isRoomExist, roomid) {
        document.getElementById('livstream').style.display = "block";
        document.getElementById('stoplive').style.display = "block";
        document.getElementById('startlive').style.display = "none";
        if (!isRoomExist) {
            showRoomURL(roomid);
        }
        else {
            connection.sdpConstraints.mandatory = {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true
            };
        }
    });
};

document.getElementById('joinlive').onclick = function() {
    //disableInputButtons();
    connection.openOrJoin(document.getElementById('room-id').value, function(isRoomExist, roomid) {
        document.getElementById('livstream').style.display = "block";
        if (!isRoomExist) {
            showRoomURL(roomid);
        }
        else {
            connection.sdpConstraints.mandatory = {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true
            };
        }
    });
};

document.getElementById('stoplive').onclick = function() {
    //disableInputButtons();
    connection.attachStreams.forEach(function(stream) {
        stream.stop();
    });
    document.getElementById('stoplive').style.display = "none";
    document.getElementById('livstream').style.display = "none";
    document.getElementById('startlive').style.display = "block";
};



function showRoomURL(roomid) {
    var roomHashURL = '#' + roomid;
    var roomQueryStringURL = '?roomid=' + roomid;
    var html = '<h2>Unique URL for your room:</h2><br>';
    html += 'Hash URL: <a href="' + roomHashURL + '" target="_blank">' + roomHashURL + '</a>';
    html += '<br>';
    html += 'QueryString URL: <a href="' + roomQueryStringURL + '" target="_blank">' + roomQueryStringURL + '</a>';
    // var roomURLsDiv = document.getElementById('room-urls');
    // roomURLsDiv.innerHTML = html;
    // roomURLsDiv.style.display = 'block';
}