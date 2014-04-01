Template.question_mc.events = {
  'click button#next' : function (event,template) {
    var questionObj = Session.get("Question"),
        prequiz_response = $("#response-boxes input:checkbox:checked").first().val(),
        custom = $("#self_defn").val();

    console.log(custom);
    // Perform pre-checks on the form data
    if(!questionObj || (!prequiz_response && (custom.trim().length === 0)))
        return alert("Wowzers, please fill in at least a single value!");

    if($("#response-boxes input:checkbox:checked").length > 1)
        return alert("Wowzers, please just choose one, thanks!");

    Meteor.saveQuestion('question_mc',{
        prequiz_response : prequiz_response,
        choices : questionObj.choices,
        question : questionObj.question
    });

    Router.go('nextprequiz');
  }
}

Template.response_mc.events = {
  'click button#next' : function(event){
    //this is the quizobj because of the #with
    Meteor.saveResponse(this.right,this);
    Session.set("QuestionData");
  }
};

