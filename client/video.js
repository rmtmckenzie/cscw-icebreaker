
Template.answer_video.rendered = function(){
  var cam = this.find('#videoViewport')
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


var question,
    answer;

Template.question_video.events = {
    'click button#videoquestion' : function(event,template){
        // Check the question and answer, then store them for insert into DB later
        // once we've recorded the video
        if(template.find('#question') && template.find('#question').value) {
           question = template.find('#question').value;
        }

        if(template.find('#answer') && template.find('#answer').value) {
           answer = template.find('#answer').value;
        }

        Router.go('answer_video');
    }

};

Template.answer_video.flipped = function() {
  var flipped = Deps.nonreactive(function () { return Session.get('WebcamFlipped'); });
  return flipped;
};

Template.answer_video.events = {
  'click button#videoflip' : function(event,template){
    var flipped = Session.get('WebcamFlipped');
    console.log("Setting to "+ (!flipped ? "Flipped":"Not Flipped"));
    Session.set('WebcamFlipped',!flipped);
    $('.videoHolder').toggleClass("flipY");
  },
  'click button#videorecord' : function(event,template){
    var mRecordRTC = template.mRecordRTC;
    if(!template.recording){
      mRecordRTC.addStream(template.stream);
      mRecordRTC.startRecording();
      template.recording = true;
    }
  },
  'click button#videodone' : function(event,template){
    var mRecordRTC = template.mRecordRTC;

     if(!template.recording){
        return;
     }

      mRecordRTC.stopRecording();

      mRecordRTC.getDataURL(function(dataURL) {

        // Save the audio and video files associated with the questions
        video = Meteor.call('saveFile', dataURL.audio, '.wav','video','binary');
        audio = Meteor.call('saveFile', dataURL.video, '.webm','video','binary');

        console.log("Saving the newly created audio and video into a question object");

        Meteor.saveQuestion("video",{
          video:video,
          audio:audio,
          question:question,
          answer:answer
        });
        console.log("Saved new video question");
      });

     // Go to next question
     Router.go('prequiz');
  }
};

