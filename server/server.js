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

Meteor.getUploadsPath = function(path){
  return Meteor.assets_folder + (path ? '/' + path + '/' : '/');
}

// Router.map(function () {
//   this.route('testing', {
//     where: 'server',
//     path: '/testing/:_filename',
//     action: function () {
//       var fs = Meteor.fs,
//           path = Meteor.getUploadsPath("video"),
//           filename = path + this.params._filename,
//           buffer,
//           acceptEncoding = this.request.headers['accept-encoding'];

//       if(acceptEncoding && acceptEncoding.indexOf('*') >= 0){
//         // console.log("asdf");

//         if(!fs.existsSync(path)){
//           throw new Meteor.Error(500,"No file found","No video at video/"+this.params._filename);
//         }

//         buffer = fs.readFileSync(filename,{encoding:"binary"});

//         this.response.writeHead(206, {
//           //'Content-Type': 'video/webm',
//           // 'encoding': 'binary',
//           // 'connection':'keep-alive',
//           // 'Content-type':'video/webm',
//           // 'encoding':'binary',
//           // 'transfer-encoding':'chunked',
//           // 'vary':'Accept-Encoding'
//           'accept-ranges':'bytes',
//           'cache-control':'public, max-age=86400',
//           'connection':'keep-alive',
//           'content-length':'265497',
//           'content-type':'video/webm',
//           // 'date':'Tue, 01 Apr 2014 03:37:21 GMT',
//           // 'etag':"265497-1396323255000",
//           // 'last-modified':'Tue, 01 Apr 2014 03:34:15 GMT',
//           'vary':'Accept-Encoding'
//         });

//         this.response.end(buffer);
//       } else {
//         // console.log("fdsa");

//         this.response.writeHead(200
//           ,
//           {
//             // 'encoding':'binary',
//             'content-Type':'video/webm'
//           }
//         );
//       }
//     }
//   });
// });

Questions.allow({
  insert: function(userId, data){
    switch(data.type){
    case "question_ttf":
      check(data.true1, NonEmptyString);
      check(data.true2, NonEmptyString);
      check(data.false1, NonEmptyString);
      break;
    case "question_video":
        check(data.video, NonEmptyString);
        check(data.audio, NonEmptyString);
        check(data.question, NonEmptyString);
        check(data.answer, NonEmptyString);
        break;
    case "question_mc":
        check(data.prequiz_response, NonEmptyString);
        check(data.choices, NonEmptyString);
        check(data.question, NonEmptyString);
        break;
    default:
      throw new Error("No question type defined");
    }
    check(data.userid, Match.Where(function(x){ return userId === x;}));
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

  // observeChanges only returns after the initial `added` callbacks
  // have run. Until then, we don't want to send a lot of
  // `self.changed()` messages - hence tracking the
  // `initializing` state.
  var handle = Questions.find({userid: userid}).observeChanges({
    added: function () {
      count++;
      console.log("num",count);
      if (!initializing)
        self.changed("QuestionCount", userid || -1, {count: count});
    },
    removed: function (id) {
      count--;
      self.changed("QuestionCount", userid || -1, {count: count});
    }
    // don't care about changed
  });

  // Instead, we'll send one `self.added()` message right after
  // observeChanges has returned, and mark the subscription as
  // ready.
  initializing = false;
  self.ready();
  self.added("QuestionCount", userid || -1, {count: count});

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
        self.changed("AnswerCount", userid || -1, {count: count});
    },
    removed: function (id) {
      count--;
      self.changed("AnswerCount", userid || -1, {count: count});
    }
    // don't care about changed
  });

  // Instead, we'll send one `self.added()` message right after
  // observeChanges has returned, and mark the subscription as
  // ready.
  initializing = false;
  self.added("AnswerCount", userid || -1, {count: count});
  self.ready();

  // Stop observing the cursor when client unsubs.
  // Stopping a subscription automatically takes
  // care of sending the client any removed messages.
  self.onStop(function () {
    handle.stop();
  });
});
