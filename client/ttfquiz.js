
Template.questiontruetruefalse.events = {
  'click button#next' : function (event,template) {
    //post to db
    //save user, true statement, true statment, false statement, num
    var true1 = template.find('#truth1'),
        true2 = template.find('#truth2'),
        false1 = template.find('#lie'),
        num = 1;

    if(!true1.value){
      $(true1).parent().addClass('has-error').one('keydown',function (event) {
        $(this).removeClass('has-error');
      });
    }

    if(!true2.value){
      $(true2).parent().addClass('has-error').one('keydown',function (event) {
        $(this).removeClass('has-error');
      });
    }

    if(!false1.value){
      $(false1).parent().addClass('has-error').one('keydown',function (event) {
        $(this).removeClass('has-error');
      });
    }

    if(true1.value && true2.value && false1.value){
      Meteor.saveQuestion('truetruefalse',{
        true1:true1.value,
        true2:true2.value,
        false1:false1.value,
      });
      Router.go('prequiz');

    } else {
      console.log("Enter values!");
    }
  },
  'click button#prev' : function (event) {
    //save anything entered....
    window.history.back();
  }
}

Template.truetruefalse.events = {
  'click button#submit': function(event, template){
    var val = template.find('input[name=quizttfradio]:checked');
    if(!val){
      val = template.find('div.mustrespond');
      val.innerHTML="<h3>You must answer!<h3>";
      return;
    }
    val = val.value;
    data = Session.get("QuestionData");
    if(val == data.a){
      data.right = true;
      switch(val){
        case 1:
          data.guess = data.s1;
          data.other1 = data.s2;
          data.other2 = data.s3;
          break;
        case 2:
          data.guess = data.s2;
          data.other1 = data.s1;
          data.other2 = data.s3;
          break;
        case 3:
          data.guess = data.s3;
          data.other1 = data.s1;
          data.other2 = data.s2;
          break;
      }
    } else {
      this.right = false;
      data.guess = data["s"+val];
      data.lie = data["s"+data.a];
      data.other = data["s"+(6-val-data.a)];
    }
    //set this so that the results template is rendered.
    data.type="resulttruetruefalse";
    Session.set("QuestionData",data);
  },
  'click button#prev' : function (event) {
    //save anything entered....
    window.history.back();
  }
}

Template.resulttruetruefalse.events = {
  'click button#next' : function(event){
    //this is the quizobj because of the #with
    Meteor.saveResponse(this.right,this);
    Session.set("QuestionData");
  }
}

