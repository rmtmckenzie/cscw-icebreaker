
Template.postquestion_video.rendered = function(){
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
    response;

Template.question_video.events = {
    'click button#videoquestion' : function(event,template){
        // Check the question and response, then store them for insert into DB later
        // once we've recorded the video
        if(template.find('#question') && template.find('#question').value) {
           question = template.find('#question').value;
        }

        if(template.find('#response') && template.find('#response').value) {
           response = template.find('#response').value;
        }

        Router.go('postquestion_video');
    }

};

Template.postquestion_video.flipped = function() {
  var flipped = Deps.nonreactive(function () { return Session.get('WebcamFlipped'); });
  return flipped;
};

Template.postquestion_video.events = {
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

        console.log("Saving the newly created audio and video into a question object");

        //get parameter to be put into database
        var saveobj = Meteor._getQuestionObj("video",{
          question:question,
          response:response
        });

        //save the audio files and insert question data in database
        Meteor.call(
          'saveVideoQuestion',
          {
            video:dataURL.video,videoformat:'.webm',
            audio:dataURL.audio,audioformat:'.wav'
          },
          saveobj
        );

        //manually update questioncount as might take
        // a while for server to finish actually updating
        Deps.nonreactive(function(){
          var q = Session.get("QuestionCount") || 0;
          Session.set("QuestionCount",q+1);
        })

        console.log("Saved new video question");
        //turns webcam off
        template.stream.stop();
      });

     // Go to next question
     Router.go('prequiz');
  }
};

