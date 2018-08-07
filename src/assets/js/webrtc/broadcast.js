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
    document.getElementById('leavelive').click();
};

document.getElementById('startlive').onclick = function () {
    //disableInputButtons();
    connection.open(document.getElementById('room-id').value, function (isRoomExist, roomid) {
        document.getElementById('livstream').style.display = "block";
        document.getElementById('stoplive').style.display = "block";
        document.getElementById('startlive').style.display = "none";
    });
};

document.getElementById('moderatorjoin').onclick = function () {
    navigator.getDisplayMedia({
        video: true
    }).then(externalStream => {
        connection.addStream(externalStream);
    }, error => {
        alert(error);
    });
};


document.getElementById('joinlive').onclick = function () {
    document.getElementById('livstream').style.display = "block";
    connection.checkPresence(document.getElementById('room-id').value, function (isRoomExist) {
        if (isRoomExist) {
            connection.sdpConstraints.mandatory = {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true
            };
            connection.join(document.getElementById('room-id').value);
            document.getElementById('joinlive').style.display = "none";
            document.getElementById('leavelive').style.display = "block";
            return;
        }
    });
};

document.getElementById('leavelive').onclick = function () {
    connection.leave()
    connection.checkPresence(document.getElementById('room-id').value, function (isRoomExist) {
        if (isRoomExist) {
            document.getElementById('joinlive').style.display = "block";
        } else {
            document.getElementById('joinlive').style.display = "none";
        }
    });
    document.getElementById('leavelive').style.display = "none";
    document.getElementById('livstream').style.display = "none";
    return;
}


document.getElementById('stoplive').onclick = function () {
    connection.attachStreams.forEach(function (stream) {
        stream.stop();
    });
    connection.close();
    document.getElementById('stoplive').style.display = "none";
    document.getElementById('livstream').style.display = "none";
    document.getElementById('startlive').style.display = "block";
    
};

document.getElementById('input-text-chat').onkeyup = function (e) {
    if (e.keyCode != 13) return;
    // removing trailing/leading whitespace
    this.value = this.value.replace(/^\s+|\s+$/g, '');
    if (!this.value.length) return;
    // var chatElement = createChatText(this.value);
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    var chatText = this.value + '|' + UserData.name;
    //var createdElement = createChatText(this.value);
    // connection.send(userName);
    // connection.send(this.value);
    connection.send(chatText);
    appendDIV(chatText);
    this.value = '';
};

var chatContainer = document.querySelector('.chatul');
connection.onmessage = appendDIV;

function appendDIV(chatText) {
    var chatDataElement = chatText.data || chatText;
    var chatElement = chatDataElement.split('|');
    var li = document.createElement('li');
    //appending user name
    var divusername = document.createElement('div');
    divusername.className = 'user_name';
    // const UserData = JSON.parse(localStorage.getItem('UserData'));
    divusername.innerHTML = chatElement[1];
    var d = new Date();
    //appending span
    var span = document.createElement('span')
    span.innerHTML = d.toLocaleTimeString();
    divusername.appendChild(span);
    li.appendChild(divusername);
    var message = chatElement[0];
    li.appendChild(document.createTextNode(message));
    chatContainer.insertBefore(li, chatContainer.childNodes[0]);
    li.tabIndex = 0;
    li.focus();
    document.getElementById('input-text-chat').focus();
}

function createChatText(chatText) {
    var li = document.createElement('li');
    //appending user name
    var divusername = document.createElement('div');
    divusername.className = 'user_name';
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    divusername.innerHTML = UserData.name;
    var d = new Date();
    //appending span
    var span = document.createElement('span')
    span.innerHTML = d.toLocaleTimeString();
    divusername.appendChild(span);
    li.appendChild(divusername);
    var chattext = chatText.data || chatText;
    li.appendChild(document.createTextNode(chattext));
    return li;
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