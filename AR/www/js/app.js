// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

  socket = new WebSocket("ws://54.250.246.57:8080/");
  text = $('.inner_text');




  socket.onopen = function(e) {
    alert('server connect');
  }

  socket.onclose = function(e) {
    alert('server close');
  }

  socket.onerror = function(e) {
    alert('occured error');
  }

  socket.onmessage = function(e) {
      var result = e.data;
      console.log(e.data)
      text.text(result);
  }


  function getVideoSources(callback) {
    if (!navigator.mediaDevices) {
      console.log("MediaStreamTrack");
      MediaStreamTrack.getSources(function(cams) {
        cams.forEach(function(c, i, a) {
          if (c.kind != 'video') return;
          callback({
            name: c.facing,
            id: c.id
          });
        });
      });
    } else {
      navigator.mediaDevices.enumerateDevices().then(function(cams) {
        cams.forEach(function(c, i, a) {
          console.log("mediaDevices", c);
          if (c.kind != 'videoinput') return;
          callback({
            name: c.label,
            id: c.deviceId
          });
        });
      });
    }
  }


    var video = document.querySelector('video');
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    var localMediaStream = null;
    var control = document.getElementById("buttons");


    //カメラ画像キャプチャ
    snapshot = function() {
      if (localMediaStream) {
        ctx.drawImage(video, 0, 0);
        image = canvas.toDataURL('image/jpeg');
        base64 = image.split(',')[1];
        socket.send(base64);
        //console.log(base64)
      }
    }




    getVideoSources(function(cam) {
      console.log("cam", cam);
      var b = document.createElement("input");
      b.type = "button";
      b.value = 'button';
      b.onclick = getMain(cam.id);
      control.appendChild(b);
    });


    function getMain(cam_id) {
      return function() {
        main(cam_id);
      };
    }

    function main(cam_id) {
      navigator.getUserMedia({
        video: {
          optional: [
            { sourceId: cam_id}
          ]
        }
      }, function(stream) { // success
        localMediaStream = stream;
        video.src = window.URL.createObjectURL(stream);
        $('.inner_text').css('display','block');
      }, function(e) { // error
      });
    };

    setInterval('snapshot()', 1000);
    var permissions = cordova.plugins.permissions;
    // カメラの場合
    permissions.requestPermission(permissions.CAMERA, function(status) {
      alert(status.hasPermission); // true or false
    }, null);
  });
})





