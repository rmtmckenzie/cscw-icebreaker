var questionObj,
    question_text,
    prequiz_response,
    choices,
    custom;

Template.video_postquestion.rendered = function(){
  var cam = this.find('#videoViewport'),
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
      _this.find("#videoflip").disabled = false;
      _this.find("#videorecord").disabled = false;
      cam.src = window.URL.createObjectURL(stream);
      cam.play();
      _this.stream = stream;
    }
  );
};


Template.video_question.events = {
    'click button#videoquestion' : function(event,template){
        // Check the question and response, then store them for insert into DB later
        // once we've recorded the video

        questionObj = Session.get("Question");
        question_text = questionObj.question;
        custom = $("#self_defn").val() || '';
        prequiz_response = $("#response-boxes input[name=videoinput]:checked").first().val() || '';

        if($("#response-boxes input:checkbox:checked").length > 1){
            return alert("Wowzers, please just choose one, thanks!");
        }

        if((custom.trim().length === 0) && prequiz_response.trim().length === 0)
            return alert("You must submit at least a single value");

        choices = questionObj.choices;
        Router.go('video_postquestion');
    },
    'change input#self_defn, input input#self_defn':function(events,template){
      var dom = events.target;
      
      if(dom.value != ''){
          $(template.findAll('input[name=videoinput]')).prop('checked',false).prop('disabled',true);
      } else {
          $(template.findAll('input[name=videoinput]')).prop('disabled',false);
      }
    }
};

Template.video_postquestion.flipped = function() {
  var flipped = Deps.nonreactive(function () { return Session.get('WebcamFlipped'); });
  return flipped;
};

Template.video_postquestion.events = {
  'click button#videoflip' : function(event,template){
    var flipped = Session.get('WebcamFlipped');
    console.log("Setting to "+ (!flipped ? "Flipped":"Not Flipped"));
    Session.set('WebcamFlipped',!flipped);
    $('.videoHolder').toggleClass("flipY");
  },
  'click button#videorecord' : function(event,template){
    var mRecordRTC = template.mRecordRTC;
    template.find("#videodone").disabled = false;
    template.find("#videorecord").disabled = true;
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

        var flipped = false;

        Deps.nonreactive(function(){
          flipped = Session.get("WebcamFlipped") || 0;
        });

        console.log("Saving the newly created audio and video into a question object");

        //get parameter to be put into database
        var saveobj = Meteor._getQuestionObj(questionObj.type,{
          question:question_text,
          choices:choices,
          flipped:flipped,
          prequiz_response : custom.trim().length > 0 ? custom.trim() : prequiz_response
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

Template.video_response.events = {
  'click button#answer' : function(event,template){
    // 1. Check the answer,
    var answer = $("#checkbox-answers input:radio:checked").first().val() || '';
    var questionObj;
    Deps.nonreactive(function(){
        questionObj = Session.get("QuestionData");
    });


    if(answer.length === 0)
        return alert("Please answer the question before continuing");

    questionObj.quiz_response = answer;
    questionObj.answered = true;

    // 2. Give them the result
    if(answer === questionObj.prequiz_response) {
        questionObj.right = true;
    } else {
        questionObj.right = false;
    }

    Session.set('QuestionData', questionObj);
    // 3. Send it to the video response showing the result
    //Router.go('video_result');
  }
};

Template.video_answer.events = {
  'click button#next' : function(event, template){
    Meteor.saveResponse(this.right,this);
    Session.set('QuestionData');
  }
}
