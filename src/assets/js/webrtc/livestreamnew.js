var connection = new RTCMultiConnection();
connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/'
connection.socketMessageEvent = 'ICOlivestream';
connection.enableLogs = true;
connection.enableFileSharing = true;
var roomid = 'Q12345e123'

connection.session = {
    audio: true,
    video: true,
    data: true
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
};

connection.getScreenConstraints = function (callback) {
    getScreenConstraints(function (error, screen_constraints) {
        if (!error) {
            screen_constraints = connection.modifyScreenConstraints(screen_constraints);
            callback(error, screen_constraints);
            return;
        }

        throw error;
    });
};



document.getElementById('startlivestream').onclick = function () {
    connection.open(roomid);
    connection.extra = {
        fullname: getName()
    };
}

document.getElementById('moderatorjoin').onclick = function () {
    connection.checkPresence(roomid, function(isRoomExist,roomid,error) {
        if (isRoomExist) {
            connection.join(roomid);
        } else {
            alert('live stream not started');
          }
          if(error) {
            console.log(error);
        }
    });
    connection.extra = {
        fullname: getName()
    };
}

document.getElementById('joinlivestream').onclick = function () {
    connection.session = {
        audio: false,
        video: false,
        data: true
    };
    connection.extra = {
        fullname: getName()
    };
    connection.checkPresence(roomid, function(isRoomExist) {
        if (isRoomExist) {
            connection.join(roomid);
        } else {
            alert('live stream not started yet')
        }
    });
}

/*document.getElementById('share-file').onclick = function (file) {
    var fileSelector = new FileSelector();
    fileSelector.selectSingleFile(function (file) {
        connection.send(file);
    });
};*/

document.getElementById('sharescreen').onclick = function () {
    connection.addStream({
        screen: true,
        oneway: true
    });
};

document.getElementById('stoplivestream').onclick = function () {
    connection.attachStreams.forEach(function (stream) {
        stream.stop();
    });
    connection.leave();
    connection.close();
};

//connection.filesContainer = document.getElementById('file-container');
var presentervideosContainer = document.getElementById('presentervideo');
var moderatorvideosContainer = document.getElementById('moderatorvideo');
var livevideoparentContainer = document.getElementById('livevideoparent');

//var screenContainer = document.getElementById('screen-container');
//var leftvideocontainer = document.getElementById('left-video-container');
var lastSelectedFile;
var chunk_size = 60 * 1000;
connection.fileReceived = {};
connection.chunkSize = chunk_size;
var chatContainer = document.querySelector('.chatwindow');
var numberOfKeys = 0;
var lastMessageUUID;

connection.onstreamended = function (event) {
    connection.onUserStatusChanged(event);
    var mediaElement = document.getElementById(event.streamid);
    if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);
    }
}

connection.onstream = function (event) {
    /*if (event.stream.isScreen !== true) {
        initHark({
            stream: event.stream,
            streamedObject: event,
            connection: connection
        });
    }*/

     if (document.getElementById(event.streamid)) {
         var existing = document.getElementById(event.streamid);
         existing.parentNode.removeChild(existing);
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
    if (event.stream.isScreen === true) {
        video.id = event.stream.id;
        video.className = 'screencontainervideo';
        screenContainer.appendChild(video);
        //placingVideos(video, 'screen');
    } else {
        video.id = event.stream.id;
        if(event.type === 'local') {
            moderatorvideosContainer.appendChild(video);
        } else {
            var childcount = presentervideosContainer.childElementCount;
            if(childcount === 1) {
                livevideoparentContainer.className = 'live_video two';
            } else if(childcount > 1) {
                livevideoparentContainer.className = 'live_video three';
            }
            presentervideosContainer.appendChild(video);
        }
        //placingVideos(video, 'video');
    }
}

function getName() {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData !== undefined && UserData !== null) {
        return UserData.name;
    } else {
        return 'guest';
    }
}

 function appendDIV(data, type) {
    var existing = false;
    var disabl = false;
    if(disabl){
        div;
        if (document.getElementById(data.lastMessageUUID)) {
            div = document.getElementById(data.lastMessageUUID);
            existing = true;
        } else {
            div = document.createElement('div');
            if (data.lastMessageUUID) {
                div.id = data.lastMessageUUID;
            }
        }
        if(type === 1) {
            div.innerHTML = data.username + ' says: ' + data.text;
        } else {
            div.innerHTML = data.username + ' typing ';
        }
    }

    var li = document.createElement('li');
    var img = document.createElement('img');
    img.src = "../../assets/img/ico-user.png";
    li.appendChild(img);
    var divchatcontent = document.createElement('div');
    divchatcontent.className = 'chat_content';
    
    var span = document.createElement('span')
    var d = new Date();
    span.innerHTML  = d.toLocaleTimeString();
    divchatcontent.appendChild(span);

    var h5 = document.createElement('h5');
    h5.innerHTML = data.username;
    divchatcontent.appendChild(h5);

    var p = document.createElement('p');
    p.innerHTML = data.text;
    divchatcontent.appendChild(p);

    li.appendChild(divchatcontent);


    if (!existing) {
        chatContainer.appendChild(li);
    }
    chatContainer.tabIndex = 0;
    chatContainer.focus();
}

document.getElementById('chat-input').onkeypress = function(e) {
    numberOfKeys++;
    var disabled = false;
    if(disabled){
        if (numberOfKeys > 3) {
            numberOfKeys = 0;
        }

        if (!numberOfKeys) {
            if (!lastMessageUUID) {
                lastMessageUUID = Math.round(Math.random() * 999999999) + 9995000;
            }

            var chatmessage = {
                username: connection.extra.fullname,
                lastMessageUUID: lastMessageUUID
            }

            connection.send({
                type: 'typing',
                content: chatmessage
            });
        }
    
        if (!this.value.replace(/^\s+|\s+$/g, '').length) {
            var chatmessage = {
                username: connection.extra.fullname,
                lastMessageUUID: lastMessageUUID
            }
            connection.send({
                type: 'stoppedtyping',
                content: chatmessage
            });
            return;
        }
    }
    if (e.keyCode !== 13) return;

    this.value = this.value.replace(/^\s+|\s+$/g, '');

    chatmessage = {
        username: connection.extra.fullname,
        text: this.value,
        lastMessageUUID: lastMessageUUID
    }
    appendDIV(chatmessage,1);
    connection.send({
        type: 'message',
        content: chatmessage
    });

    lastMessageUUID = null;
    this.value = '';
    this.focus();
};

connection.onmessage = function (event) {
    if(event.data.type === 'message') {
        appendDIV(event.data.content, 1);
        return;
    } else if(event.data.type === 'typing') {
        appendDIV(event.data.content, 2);
        return;
    } else if(event.data.type === 'stoppedtyping') {
        var div = document.getElementById(event.data.content.lastMessageUUID);
        if (div) div.parentNode.removeChild(div);
        return;
    }
}


/*var numberOfConnectedUsers = document.getElementById('noofusers');
var userlist = document.getElementById('userlist');

function setConnectedUsers(length) {
    numberOfConnectedUsers.innerHTML = "No.Of Connected Users: " + length;
    
}

connection.onopen = function (event) {
    setConnectedUsers(connection.getAllParticipants().length);
    userListUpdate(event)

    document.getElementById('share-file').disabled = false;
    if (document.getElementById('chat-input')) {
        document.getElementById('chat-input').disabled = false;
    }
}

function userListUpdate(event) {
    var usernamediv = document.createElement('div');
    usernamediv.id = event.userid;
    usernamediv.innerHTML = event.extra.fullname;
    usernamediv.style.color = 'green';

    var usestatusdiv = document.createElement('span');
    usestatusdiv.id = event.userid + 'status';
    usestatusdiv.innerHTML = ' Online';
    usestatusdiv.style.color = 'green';

    usernamediv.appendChild(usestatusdiv);
    userlist.appendChild(usernamediv);
}

connection.onUserStatusChanged = function (event) {
    var usernamediv = document.getElementById(event.userid);
    var usestatusdiv = document.getElementById(event.userid + 'status');

    if (usestatusdiv && event.status) {
        if (event.status === 'online') {
            usestatusdiv.style.color = 'green';
            usernamediv.style.color = 'green';
            usestatusdiv.innerHTML = ' Online';
        } else if (event.status === 'offline') {
            usestatusdiv.style.color = 'red';
            usernamediv.style.color = 'red';
            usestatusdiv.innerHTML = ' Offline';
        }
    }
}

connection.onleave = function(event) {
    var usernamediv = document.getElementById(event.userid);
    var usestatusdiv = document.getElementById(event.userid + 'status');
    usestatusdiv.style.color = 'blue';
    usernamediv.style.color = 'blue';
    usestatusdiv.innerHTML = ' left';
    
    setConnectedUsers(connection.getAllParticipants().length);
};

var progressHelper = {};

// to make sure file-saver dialog is not invoked.
connection.autoSaveToDisk = false;

connection.onFileProgress = function (chunk, uuid) {
    var helper = progressHelper[chunk.uuid];
    helper.progress.value = chunk.currentPosition || chunk.maxChunks || helper.progress.max;
    updateLabel(helper.progress, helper.label);
};
var existinguid;
connection.onFileStart = function (file) {
    if (existinguid !== file.uuid) {
        var div = document.createElement('div');
        div.title = file.name;
        div.innerHTML = '<label>0%</label> <progress></progress>';
        connection.filesContainer.appendChild(div);
        progressHelper[file.uuid] = {
            div: div,
            progress: div.querySelector('progress'),
            label: div.querySelector('label')
        };
        progressHelper[file.uuid].progress.max = file.maxChunks;
        existinguid = file.uuid;
    }
};

connection.onFileEnd = function (file) {
    progressHelper[file.uuid].div.innerHTML = '<a href="' + file.url + '" target="_blank" download="' + file.name + '">' + file.name + '</a>';
};

function updateLabel(progress, label) {
    if (progress.position == -1) return;
    var position = +progress.position.toFixed(2).split('.')[1] || 100;
    label.innerHTML = position + '%';
}


connection.onspeaking = function (e) {
    connection.send({
        username: e.extra.fullname,
        speaking: true,
        streamid: e.streamid,
        type: 'voice'
    });
};

connection.onsilence = function (e) {
    connection.send({
        username: 'No one',
        speaking: false,
        type: 'voice'
    });
};

connection.onvolumechange = function (event) {
    event.mediaElement.style.borderWidth = event.volume;
};

function initHark(args) {
    if (!window.hark) {
        throw 'Please link hark.js';
        return;
    }

    var connection = args.connection;
    var streamedObject = args.streamedObject;
    var stream = args.stream;

    var options = {};
    var speechEvents = hark(stream, options);

    speechEvents.on('speaking', function () {
        connection.onspeaking(streamedObject);
    });

    speechEvents.on('stopped_speaking', function () {
        connection.onsilence(streamedObject);
    });

    speechEvents.on('volume_change', function (volume, threshold) {
        streamedObject.volume = volume;
        streamedObject.threshold = threshold;
        connection.onvolumechange(streamedObject);
    });
}


  /*connection.onstreamended = function (e) {
    // e.mediaElement (audio or video element)
    // e.stream     native MediaStream object
    // e.streamid   unique identifier of the stream synced from stream sender
    // e.session {audio: true, video: true}
    // e.blobURL
    // e.type     "local" or "remote"
    // e.extra
    // e.userid   the person who shared stream with you!
  
    // easiest way to remove relevant element!
    e.mediaElement.parentNode.removeChild(e.mediaElement);
  
    // e.isVideo ---- if it is a  Video stream
    // e.isAudio ---- if it is an Audio stream
  }

  connection.onUserStatusChanged = function(event) {
    var isOnline = event.status === 'online';
    var isOffline = event.status === 'offline';
  
    var targetUserId = event.userid;
    var targetUserExtraInfo = event.extra;
  };


connection.onsilence = function (e) {
  // e.streamid, e.userid, e.stream, etc.
  e.mediaElement.style.border = '';
};*/