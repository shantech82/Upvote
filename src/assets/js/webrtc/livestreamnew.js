var connection = new RTCMultiConnection();
connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/'
connection.socketMessageEvent = 'ICOlivestream';
connection.enableLogs = true;
connection.enableFileSharing = true;

connection.processSdp = function(sdp) {
    sdp = BandwidthHandler.setApplicationSpecificBandwidth(sdp, connection.bandwidth, !!connection.session.screen);
    sdp = BandwidthHandler.setVideoBitrates(sdp, {
        min: 30,
        max: 50
    });
    sdp = BandwidthHandler.setOpusAttributes(sdp);
    return sdp;
};

connection.iceServers =  [{   
    'urls': [ "stun:bturn2.xirsys.com" ]
    }, {   
        'username': "UMTxhdumtUDJCUshCNP_4u1QzNHcSQs9elpeML2dR2nIgjBZf1IyredwHEr2a6U-AAAAAFzUAY5tb2hhbmNoYWxsb3RyZQ==",
        'credential': "a33cbc52-7245-11e9-8d8b-9646de0e6ccd",
        'urls': [ "turn:bturn2.xirsys.com:80?transport=udp",
            "turn:bturn2.xirsys.com:3478?transport=udp",
            "turn:bturn2.xirsys.com:80?transport=tcp",
            "turn:bturn2.xirsys.com:3478?transport=tcp",
            "turns:bturn2.xirsys.com:443?transport=tcp",
            "turns:bturn2.xirsys.com:5349?transport=tcp"
            ]
        }
    ]

var roomid = 'Q12345e123'

connection.session = {
    audio: true,
    video: true,
};

var RMCMediaTrack = {
    cameraStream: null,
    cameraTrack: null,
    screen: null
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

function startLiveStreamJs(userImage) {
    userType = getModerator();
    console.log("start live stream");
    if(userType === 1){
        moderatorJoin(userImage);
    } else if (userType === 2) {
        presenterJoin(userImage);
    } else if (userType === 3) {
        investorJoin(userImage);
    }
}

function moderatorJoin(userImage) {
    connection.session = {
        audio: true,
        video: true,
        data: true
    };
    connection.checkPresence(roomid, function(isRoomExist,roomid,error) {
        if (isRoomExist) {
            connection.join(roomid);
            return;
        } else {
            connection.open(roomid);
            return;
          }
          if(error) {
            console.log(error);
        }
    });
    connection.extra = {
        fullname: getName(),
        image: userImage,
        Type: 'Modertor',
        id: getUserId()
    };
}

function presenterJoin(userImage){
    connection.session = {
        data: true,
        audio: true,
        video: true
    };
    connection.checkPresence(roomid, function(isRoomExist,roomid,error) {
        if (isRoomExist) {
            connection.join(roomid);
            return;
        } else {
            connection.open(roomid);
            return;
          }
          if(error) {
            console.log(error);
        }
    });
    connection.extra = {
        fullname: getName(),
        image: userImage,
        Type: 'Presenter',
        id: getUserId()
    };
}

function investorJoin(userImage){
    connection.session = {
        audio: false,
        video: false,
        data: true
    };
    connection.extra = {
        fullname: getName(),
        image: userImage,
        Type: 'Investor',
        id: getUserId()
    };
    connection.checkPresence(roomid, function(isRoomExist) {
        if (isRoomExist) {
            connection.join(roomid);
            return;
        } else {
            connection.open(roomid);
            return;
        }
    });
}

function connectionClose(){
  //  alert("connection close");
    connection.attachStreams.forEach(function (stream) {
        stream.stop();
    });
    // connection.leave();
    //connection.close();

}

document.getElementById('share-file').onclick = function (file) {
    var fileSelector = new FileSelector();
    fileSelector.selectSingleFile(function (file) {
        connection.send(file);
    });
};

/*document.getElementById('sharescreen').onclick = function () {
    connection.addStream({
        screen: true,
        oneway: true
    });
};*/

window.onbeforeunload = function(e) {
    connection.attachStreams.forEach(function (stream) {
       // stream.stop();
    });
   // connection.leave();
    //connection.close();
};

connection.filesContainer = document.getElementById('file-container');
var presentervideosContainer = document.getElementById('presentervideo');
var moderatorvideosContainer = document.getElementById('moderatorvideo');
var livevideoparentContainer = document.getElementById('livevideoparent');

var screenContainer = document.getElementById('videos-container');
var lastSelectedFile;
var chunk_size = 60 * 1000;
connection.fileReceived = {};
connection.chunkSize = chunk_size;
var chatContainer = document.querySelector('.chatwindow');
var numberOfKeys = 0;
var lastMessageUUID;

connection.onstreamended = function (event) {
    btnShareScreen.style.pointerEvents = "auto";
    btnShareScreenDiv.classList.remove("icon_inactive");
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

     if(event.type === 'local' && event.stream.isVideo) {
      RMCMediaTrack.cameraStream = event.stream;
      RMCMediaTrack.cameraTrack = event.stream.getVideoTracks()[0];
    }

    event.mediaElement.removeAttribute('src');
    event.mediaElement.removeAttribute('srcObject');
    event.mediaElement.muted = true;
    event.mediaElement.volume = 0;

    var video = document.createElement('video');

    
    try {
        video.setAttributeNode(document.createAttribute('autoplay'));
        video.setAttributeNode(document.createAttribute('playsinline'));
    } catch (e) {
        video.setAttribute('autoplay', true);
        video.setAttribute('playsinline', true);
    }

    // RMCMediaTrack.selfVideo = video;

    video.controls = false;
    if (event.type === 'local') {
        video.muted = true;
    }
    
    video.srcObject = event.stream;

    if (event.stream.isScreen === true) {
        video.id = event.stream.id;
        video.className = 'screencontainervideo';
        // screenContainer.appendChild(video);
    } else {
        video.id = event.stream.id;
        if(event.extra.Type === 'Modertor') {
            moderatorvideosContainer.appendChild(video);
        } else {
            var childcount = presentervideosContainer.childElementCount;
            if(childcount === 1) {
                livevideoparentContainer.className = 'live_video two';
            } else if(childcount === 2) {
                livevideoparentContainer.className = 'live_video three';
            }
            else if(childcount === 3) {
                livevideoparentContainer.className = 'live_video four';
            }
            presentervideosContainer.appendChild(video);
        }
    }

    if(event.type === 'local') {
      RMCMediaTrack.selfVideo = video;
    }

    // to keep room-id in cache
    localStorage.setItem(connection.socketMessageEvent, connection.sessionid);
}

function getName() {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData !== undefined && UserData !== null) {
        return UserData.name;
    } else {
        return 'guest';
    }
}

function getImage() {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData !== undefined && UserData !== null && UserData.image !== '' && UserData.image !== null && UserData.image !== undefined) {
        var fileUrl = UserData.image;
        if (fileUrl.indexOf('http') === -1) {
            return environment.ApiHostURL + 'static/' + fileUrl;
        } else {
            return fileUrl;
        }
    } else {
        return "../../assets/img/ico-user.png";
    }
}

function getUserId() {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData !== undefined && UserData !== null) {
        return UserData.id;
    } else {
        return 0;
    }
}

function getModerator() {
    const UserData = JSON.parse(localStorage.getItem('UserData'));
    if (UserData !== undefined && UserData !== null) {
        if(UserData.ismoderator) {
            return 1;
        } else if(UserData.isinvestor) {
            return 3
        } else {
            return 2;
        }
    } else {
        return 0;
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
    img.src = data.image;
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
    li.tabIndex = 0;
    li.focus();


    if (!existing) {
        chatContainer.appendChild(li);
    }
    chatContainer.tabIndex = 0;
   // chatContainer.focus();
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
                image: connection.extra.image,
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
                image: connection.extra.image,
                lastMessageUUID: lastMessageUUID,
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
        image: connection.extra.image,     
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


var numberOfConnectedUsers = document.getElementsByClassName('view_more');
var userlist = document.getElementById('connectedusers');

function setConnectedUsers(length) {
    if(length > 5) {
        numberOfConnectedUsers.innerHTML = "+ " + length;
    }
}

connection.onopen = function (event) {
   // setConnectedUsers(connection.getAllParticipants().length);
    //userListUpdate(event);
}

connection.onjoin = function (event) {
    setConnectedUsers(connection.getAllParticipants().length);
    userListUpdate(event);
}

function userListUpdate(event) {
    //alert(1);
    var usernameli = document.createElement('li');
    usernameli.id = event.userid;
    var linktoUser = document.createElement('a');
    linktoUser.href = "/UProfile/" + event.extra.id;
    linktoUser.target = "_blank";
    var userImage = document.createElement("img");
    userImage.src = event.extra.image;
    linktoUser.appendChild(userImage);
    usernameli.appendChild(linktoUser);
    userlist.appendChild(usernameli);
}

/*connection.onUserStatusChanged = function (event) {
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
};*/

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
        var li = document.createElement('li');
        li.title = file.name;
        li.innerHTML = '<label>0%</label> <progress></progress>';
        connection.filesContainer.appendChild(li);
        progressHelper[file.uuid] = {
            li: li,
            progress: li.querySelector('progress'),
            label: li.querySelector('label')
        };
        progressHelper[file.uuid].progress.max = file.maxChunks;
        existinguid = file.uuid;
    }
};

connection.onFileEnd = function (file) {
    progressHelper[file.uuid].li.innerHTML = '<a href="' + file.url + '" target="_blank" download="' + file.name + '">' + file.name + '</a>';
};

function updateLabel(progress, label) {
    if (progress.position == -1) return;
    var position = +progress.position.toFixed(2).split('.')[1] || 100;
    label.innerHTML = position + '%';
}

var btnShareScreen = document.getElementById('screen-share');
var btnShareScreenDiv = document.getElementById('screenShareDiv');
var cameraTextDiv = document.getElementById('camera_div_text');
var micTextDiv = document.getElementById('mic_div_text');


function startScreenSharing(){
    // connection.session = {
    //     audio: true,
    //     video: true,
    //     data: true,
    //     oneway: true,
    //     screen: true,
    // };

    // connection.open(roomid);
    // btnShareScreen.disabled = true;
    btnShareScreen.style.pointerEvents = "none";
    btnShareScreenDiv.classList.add("icon_inactive");
    getScreenStream(function(screen) {
       var isLiveSession = connection.getAllParticipants().length > 0;
        if (isLiveSession) {
            replaceTrack(RMCMediaTrack.screen);
        }

        // now remove old video track from "attachStreams" array
        // so that newcomers can see screen as well
        connection.attachStreams.forEach(function(stream) {
            stream.getVideoTracks().forEach(function(track) {
                stream.removeTrack(track);
            });

            // now add screen track into that stream object
            stream.addTrack(RMCMediaTrack.screen);
        });
    });
}

function getScreenStream(callback) {
    getScreenId(function(error, sourceId, screen_constraints) {
        navigator.mediaDevices.getUserMedia(screen_constraints).then(function(screen) {
            RMCMediaTrack.screen = screen.getVideoTracks()[0];

            RMCMediaTrack.selfVideo.srcObject = screen;

            // in case if onedned event does not fire
            (function looper() {
                // readyState can be "live" or "ended"
                if (RMCMediaTrack.screen.readyState === 'ended') {
                    RMCMediaTrack.screen.onended();
                    return;
                }
                setTimeout(looper, 1000);
            })();

            var firedOnce = false;
            RMCMediaTrack.screen.onended = RMCMediaTrack.screen.onmute = RMCMediaTrack.screen.oninactive = function() {
                if (firedOnce) return;
                firedOnce = true;

                if (RMCMediaTrack.cameraStream.getVideoTracks()[0].readyState) {
                    RMCMediaTrack.cameraStream.getVideoTracks().forEach(function(track) {
                        RMCMediaTrack.cameraStream.removeTrack(track);
                    });
                    RMCMediaTrack.cameraStream.addTrack(RMCMediaTrack.cameraTrack);
                }

                RMCMediaTrack.selfVideo.srcObject = RMCMediaTrack.cameraStream;

                connection.socket && connection.socket.emit(connection.socketCustomEvent, {
                    justStoppedMyScreen: true,
                    userid: connection.userid
                });

                // share camera again
                replaceTrack(RMCMediaTrack.cameraTrack);

                // now remove old screen from "attachStreams" array
                connection.attachStreams = [RMCMediaTrack.cameraStream];

                // so that user can share again
                btnShareScreen.style.pointerEvents = "auto";
                btnShareScreenDiv.classList.remove("icon_inactive");
            };

            connection.socket && connection.socket.emit(connection.socketCustomEvent, {
                justSharedMyScreen: true,
                userid: connection.userid
            });

            callback(screen);
        });
    });
}

function replaceTrack(videoTrack) {
    if (!videoTrack) return;
    if (videoTrack.readyState === 'ended') {
        alert('Can not replace an "ended" track. track.readyState: ' + videoTrack.readyState);
        return;
    }
    connection.getAllParticipants().forEach(function(pid) {
        var peer = connection.peers[pid].peer;
        if (!peer.getSenders) return;

        var trackToReplace = videoTrack;

        peer.getSenders().forEach(function(sender) {
            if (!sender || !sender.track) return;

            if (sender.track.kind === 'video' && trackToReplace) {
                sender.replaceTrack(trackToReplace);
                trackToReplace = null;
            }
        });
    });
}

function joinScreenSharing(){
    // connection.session = {
    //     audio: true,
    //     video: true,
    //     data: true,
    //     oneway: true,
    //     screen: true,
    // };

    connection.join(roomid);
    return;

}

function silence(mike_element){
   var localStream = connection.attachStreams[0];
   localStream.mute('audio');
   mike_element.classList.add("icon_inactive");
   micTextDiv.innerHTML = 'Mic Off';
  
}

function onspeak(mike_element){
   var localStream = connection.attachStreams[0];
   localStream.unmute();
   mike_element.classList.remove("icon_inactive");
   micTextDiv.innerHTML = 'Mic On';
  
}
function onCameraStop(camera_element){
   var localStream = connection.attachStreams[0];
   localStream.mute('video');
   camera_element.classList.add("icon_inactive");
   cameraTextDiv.innerHTML = 'Camera Off';
}

function onCameraStart(camera_element){
   var localStream = connection.attachStreams[0];
   localStream.unmute('video');
   camera_element.classList.remove("icon_inactive")
   cameraTextDiv.innerHTML = 'Camera On';
}

document.getElementById("mic_div").onclick = function () {
  var mike_element =  this;
  if(mike_element.classList.contains('icon_inactive')){
      onspeak(mike_element);
  }else{
     silence(mike_element);
  }
};

document.getElementById("camera_div").onclick = function () {
  var camera_element =  this;
  if(camera_element.classList.contains('icon_inactive')){
      onCameraStart(camera_element);
  }else{
     onCameraStop(camera_element);
  }
};

/*connection.onspeaking = function (e) {
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