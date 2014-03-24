

/*
ctx.save();
ctx.scale(1,-1);
ctx.translate(0,-height);
//doo
ctx.restore()
*/
Template.webcam.rendered = function(){
  //this.soundAndVision = new SoundAndVision('.webcamHolder', {  video: true });
  //this.soundAndVision.start();
  //this.stream = this.soundAndVision.stream;
  var cam = this.find('#webcamViewport')
  var _this = this;
  
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
}

Template.webcam.flipped = function(){
  var flipped = Deps.nonreactive(function () { return Session.get('WebcamFlipped'); });
  return flipped;
}

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
      event.target.innerHTML = "<h4>Stop</h4>";
    } else {
      mRecordRTC.stopRecording();
      mRecordRTC.getDataURL(function(dataURL) {
        Meteor.call('saveFile', dataURL.audio, 'testing.wav','webcam','binary',function(err,data){
          //TODO actually handle all the errors....
          if(err){
            console.log("Saving wav failed",err);
          } else {
            console.log("Saving wav passed?");
          }
        });

        Meteor.call('saveFile', dataURL.video, 'testing.webm','webcam','binary',function(err,data){
          //TODO actually handle all the errors....
          if(err){
            console.log("Saving webm failed",err);
          } else {
            console.log("Saving webm passed?");
          }
        });
      });
    }//!else
  }//clickwebcamrecord
}

