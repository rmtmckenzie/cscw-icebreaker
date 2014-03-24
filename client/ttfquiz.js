
Template.infotruetruefalse.events = {
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
      TTF.insert({
        userid:Meteor.user()._id,
        true1:true1.value,
        true2:true2.value,
        false1:false1.value,
        num:num,
        rand:Math.random()
      });
      Router.go('ttfquestion')
    } else {
      console.log("Enter values!");
    }
  },
  'click button#prev' : function (event) {
    //save anything entered....
    window.history.back();
  }
}

Template.quiztruetruefalse.quizobj = function(){
  return Session.get("TTFData");
  //return this.storage.getData();
}

Template.quiztruetruefalse.answer = function(val){
  var ans = this.storage.getAnswer();  
  if(val && ans == val){
    return true;
  } else {
    return false;
  }
  return ans;
}

Template.quiztruetruefalse.created = function(){
  //allow to return to a question
  if(Session.get("TTFData"))return;

  Meteor.call('getRandomTTF',function(err,data){
    //TODO actually handle all the errors....
    if(err){
      console.log(err);
    } else if(data){
      Session.set("TTFData",data);
    } else {
      console.log("What the heck? TTF.");
    }
  });
}

Template.quiztruetruefalse.events = {
  'click button#next' : function(event){
    Router.go('done');
  },
  'click button#submit': function(event, template){
    var val = template.find('input[name=quizttfradio]:checked');
    if(!val){
      val = template.find('div.mustrespond');
      val.innerHTML="<h3>You must answer!<h3>";
      return;
    }
    val = val.value;
    data = Session.get("TTFData");
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
      data.guess = data["s"+val];
      data.lie = data["s"+data.a];
      data.other = data["s"+(6-val-data.a)];
    }
    Router.go("ttfanswer");
    Session.set("TTFData",data);
  },
  'click button#prev' : function (event) {
    //save anything entered....
    window.history.back();
  }
}

Template.resultttf.quizobj = function(){
  return Session.get("TTFData");
}


