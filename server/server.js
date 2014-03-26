Meteor.startup(function () {
  var fs = Meteor.fs = Npm.require('fs');
  var path = Meteor.path = Npm.require('path');
  var meteor_root = fs.realpathSync( process.cwd() + '/../' );
  var application_root = fs.realpathSync( meteor_root + '/../' );

  // if running on dev mode
  if( path.basename( fs.realpathSync( meteor_root + '/../../../' ) ) == '.meteor' ){
      application_root =  fs.realpathSync( meteor_root + '/../../../../' );
  }
  Meteor.assets_folder = application_root + '/public/uploads/';
});


Questions.allow({
  insert: function(userId, data){
    switch(data.type){
    case "truetruefalse":
      check(data.true1, NonEmptyString);
      check(data.true2, NonEmptyString);
      check(data.false1, NonEmptyString);
      break;
    case "video":
        check(data.video, NonEmptyString);
        check(data.audio, NonEmptyString);
        check(data.question, NonEmptyString);
        check(data.answer, NonEmptyString);
        break;
    default:
      throw new Error("No question type defined");
    }
    check(data.userid, Match.Where(function(x){ return userId === x}));
    check(data.rand, Number);
    console.log("allowed insert...");
    return true;
  }
});

Meteor.publish("QuestionCount", function qc() {
  var self = this,
      userid = this.userId,
      initializing = true,
      count = 0;
      // count = Questions.find({userid: this.userId}).count() || 0;

  console.log("Subscribed?");

  // observeChanges only returns after the initial `added` callbacks
  // have run. Until then, we don't want to send a lot of
  // `self.changed()` messages - hence tracking the
  // `initializing` state.
  var handle = Questions.find({userid: userid}).observeChanges({
    added: function () {
      count++;
      console.log("num",count);
      if (!initializing)
        self.changed("QuestionCount", userid, {count: count});
    },
    removed: function (id) {
      count--;
      self.changed("QuestionCount", userid, {count: count});
    }
    // don't care about changed
  });

  // Instead, we'll send one `self.added()` message right after
  // observeChanges has returned, and mark the subscription as
  // ready.
  initializing = false;
  self.ready();
  self.added("QuestionCount", userid, {count: count});

  // Stop observing the cursor when client unsubs.
  // Stopping a subscription automatically takes
  // care of sending the client any removed messages.
  self.onStop(function () {
    handle.stop();
  });
});

Meteor.publish("AnswerCount", function ac() {
  var self = this,
      userid = this.userId,
      initializing = true,
      count = Answers.find({userid_answer: this.userId}).count() || 0;

  // observeChanges only returns after the initial `added` callbacks
  // have run. Until then, we don't want to send a lot of
  // `self.changed()` messages - hence tracking the
  // `initializing` state.
  var handle = Answers.find({userid_answer: userid}).observeChanges({
    added: function () {
      count++;
      if (!initializing)
        self.changed("AnswerCount", userid, {count: count});
    },
    removed: function (id) {
      count--;
      self.changed("AnswerCount", userid, {count: count});
    }
    // don't care about changed
  });

  // Instead, we'll send one `self.added()` message right after
  // observeChanges has returned, and mark the subscription as
  // ready.
  initializing = false;
  self.added("AnswerCount", userid, {count: count});
  self.ready();

  // Stop observing the cursor when client unsubs.
  // Stopping a subscription automatically takes
  // care of sending the client any removed messages.
  self.onStop(function () {
    handle.stop();
  });
});
