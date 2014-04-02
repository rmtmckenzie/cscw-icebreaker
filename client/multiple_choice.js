Template.multiple_choice_question.events = {
  'click button#next' : function (event,template) {
    var questionObj = Session.get("Question"),
        prequiz_response = $("#response-boxes input[name=mcinput]:checked").first().val(),
        custom = $("#self_defn").val() || '';

    //console.log(custom);
    // Perform pre-checks on the form data
    if(!questionObj || (!prequiz_response && (custom.trim().length === 0))){
        return alert("Wowzers, please fill in at least a single value!");
    }

    if($("#response-boxes input:checkbox:checked").length > 1){
        return alert("Wowzers, please just choose one, thanks!");
    }
    Meteor.saveQuestion(questionObj.type,{
        prequiz_response : custom.trim().length > 0 ? custom.trim() : prequiz_response,
        choices : questionObj.choices,
        question : questionObj.question
    });

    Router.go('nextprequiz');
  },
  'change input#self_defn, input input#self_defn':function(events,template){
    var dom = events.target;
    
    if(dom.value != ''){
        $(template.findAll('input[name=mcinput]')).prop('checked',false).prop('disabled',true);
    } else {
        $(template.findAll('input[name=mcinput]')).prop('disabled',false);
    }
  }
};

Template.multiple_choice_response.events = {
  'click button#submit': function(event, template){
    var val = template.find('input[name=quizmcradio]:checked');
    if(!val){
        val = template.find('div.mustrespond');
        val.innerHTML="<h3>You must answer!<h3>";
        return;
    } 
    val = val.value; 
    var data;

    Deps.nonreactive(function(){
        data = Session.get("QuestionData");
    });

    if(data.prequiz_response == val){
        data.right = true;
    } else {
        data.right = false;
    }
    data.quiz_response = val;
    data.answered = true;

    Session.set("QuestionData",data);
  }


};

Template.multiple_choice_answer.events = {
  'click button#next' : function(event){
    //this is the quizobj because of the #with
    Meteor.saveResponse(this.right,this);
    Session.set("QuestionData");
  }
};

