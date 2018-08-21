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
    oneway: true,
    data: true
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false
};

connection.videosContainer = document.getElementById('videos-container');


connection.onstream = function (event) {
    var mediaElement = document.getElementById(event.streamid);
    if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);
    }
    event.mediaElement.removeAttribute('src');
    event.mediaElement.removeAttribute('srcObject');
    var video = document.createElement('video');
    video.setAttributeNode(document.createAttribute('autoplay'));
    video.setAttributeNode(document.createAttribute('playsinline'));
    video.setAttributeNode(document.createAttribute('controls'));

    video.controls = true;
    if (event.type === 'local') {
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
    setTimeout(function () {
        mediaElement.media.play();
    }, 5000);
    mediaElement.id = event.streamid;
};
connection.onstreamended = function (event) {
    var mediaElement = document.getElementById(event.streamid);
    if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);
    }
    leaveLiveStreamJs();
};

function startLiveStreamJs() {
    connection.open(document.getElementById('room-id').value);
    document.getElementById('livstream').style.display = 'block';
}

function stopLiveStreamJs() {
    document.getElementById('livstream').style.display = 'none';
    connection.attachStreams.forEach(function (stream) {
        stream.stop();
    });
}

function joinLiveStreamJs() {
    connection.checkPresence(document.getElementById('room-id').value, function (isRoomExist) {
        if (isRoomExist) {
            connection.sdpConstraints.mandatory = {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true
            };
            connection.join(document.getElementById('room-id').value);
            document.getElementById('livstream').style.display = 'block';
            return;
        } else {
            alert('live stream not started yet');
        }

    });
}

function leaveLiveStreamJs() {
    document.getElementById('livstream').style.display = 'none';
    connection.leave();
    return;
}

document.getElementById('input-text-chat').onkeyup = function (e) {
    if (e.keyCode != 13) return;
    // removing trailing/leading whitespace
    this.value = this.value.replace(/^\s+|\s+$/g, '');
    if (!this.value.length) return;
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    var chatText = this.value + '|' + UserData.name;
    connection.send(chatText);
    appendDIV(chatText);
    this.value = '';
};

var chatContainer = document.querySelector('.chatul');
connection.onmessage = appendDIV;
var index=0;

function appendDIV(chatText) {
    var chatDataElement = chatText.data || chatText;
    var chatElement = chatDataElement.split('|');
    var li = document.createElement('li');
    if (index%2 === 0) {
        li.className = 'orange';
    } else {
        li.className = 'red';
    }
    index++;
    //appending user name
    var divusername = document.createElement('div');
    divusername.className = 'user_name';
    divusername.innerHTML = chatElement[1];
    var d = new Date();
    //appending span
    var span = document.createElement('span')
    span.innerHTML = d.toLocaleTimeString();
    divusername.appendChild(span);
    li.appendChild(divusername);
    var message = chatElement[0];
    li.appendChild(document.createTextNode(message));
    //chatContainer.insertBefore(li, chatContainer.childNodes[0]);
    chatContainer.appendChild(li);
    li.tabIndex = 0;
    li.focus();
    document.getElementById('input-text-chat').focus();
}

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