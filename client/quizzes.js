
Template.webcam.rendered = function(){
  var cam = this.find('#webcamViewport')
      _this = this;

  this.mRecordRTC = new MRecordRTC();
  this.mRecordRTC.mediaType = {
  	audio: true,
  	video: true
  };
  navigator.getUserMedia(
  {
      audio: true,
      video: true
    }, function(stream) {
      console.log("Got stream...");
      cam.src = window.URL.createObjectURL(stream);
      cam.play();
      _this.stream = stream;
    }
  );
};

Template.webcam.flipped = function(){
  var flipped = Deps.nonreactive(function () { return Session.get('WebcamFlipped'); });
  return flipped;
};

Template.webcam.events = {
  'click button#webcamflip' : function(event,template){
    var flipped = Session.get('WebcamFlipped');
    console.log("Setting to "+ (!flipped ? "Flipped":"Not Flipped"));
    Session.set('WebcamFlipped',!flipped);
    $('.webcamHolder').toggleClass("flipY");
  },
  'click button#webcamrecord' : function(event,template){
    var mRecordRTC = template.mRecordRTC;
    if(!template.recording){
      mRecordRTC.addStream(template.stream);
      mRecordRTC.startRecording();
      template.recording = true;
    }
  },
  'click button#webcamdone' : function(event,template){
    var mRecordRTC = template.mRecordRTC;

     if(!template.recording){
        return;
     }

      mRecordRTC.stopRecording();

      mRecordRTC.getDataURL(function(dataURL) {

        // Save the audio and video files associated with the questions
        Meteor.call('saveFile', dataURL.audio, 'testing.wav','webcam','binary');
        Meteor.call('saveFile', dataURL.video, 'testing.webm','webcam','binary');

        // Now let's redirect the a review screen
        Router.go('/');

      });
  }
};

