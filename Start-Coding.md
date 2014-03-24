# Purpose

This is a quick introduction to this project, and is hopefully enough to get you starting coding for it!
Note that not everything has been verified - if you decide to test it out and find a problem let rmtmckenzie
know or fix it yourself.

# Introduction to Meteor

Honestly, the best resource for learning Meteor is probably the documentation: http://docs.meteor.com/. But here's a few more:
- https://github.com/oortcloud/unofficial-meteor-faq
- http://sebastiandahlgren.se/2013/07/17/tutorial-writing-your-first-metor-application/
- http://www.danneu.com/posts/6-meteor-tutorial-for-fellow-noobs-adding-features-to-the-leaderboard-demo/
- http://www.smashingmagazine.com/2013/06/13/build-app-45-minutes-meteor/

In meteor, everything works with either Templates or Javascript. These are the basic building blocks of the webpage; the Templates define how it looks and the js how it works. 

The javascript also gives access to MongoDB collections, and provides easy ways to hook up these to the templates, thus providing the content.

## Templates
Uses the Handlebars syntax.

- https://github.com/meteor/meteor/wiki/Handlebars
- http://handlebarsjs.com/

In this particular project we are using Iron-Router to handle page changes. 
This works because of the code in 'app.js' which defines the different routes
that the browser can go to. Note that for this project 'layoutTemplate' should 
be 'layout' for any pages so that the login, chat, and people panes are shown.

# Intro - add new page

To add a new page there are two steps. First, create a template in the client
folder (in any html file), and give it a name.
```
<template name="helloworld">
Hello World!
</template>
```
Seconds, in app.js in the Router.map function, add 
```
  this.route('helloworld', {
    path: 'hello',
    template: 'hello-world',
    layoutTemplate: 'layout'
  });
```
Now, when you browse to <serverlocation>:<port>/hello you will see the text
'Hello World!' in top left pane, with chat below it and people on the right.

Let's bring in some javascript. We're goign to get the user's name if they're
logged in! First, the template:

```
<template name="helloworld">
{{#if currentUser}}
  Hi {{username}}!
{{else}}
  Hello stranger!
{{/if}}
```
Note that 'currentUser' is provided by Meteor and doesn't need to be changed.
It simply checks for a user, and if found returns the user object.

However, username is not defined so we need to do so, in a .js file in the
client directory:
```
Template.helloworld.username = function(){
  var user = Meteor.user(),
      name;
  if(user){
    if(user.username)
      name = user.username;
    else if(user.profile.firstName)
      name = user.profile.firstName
    else if user.emails
      name = user.emails[0].address
  } else {
    return;
  }
  
  return name;
}
```
This checks for a user. If a user is logged in, it first looks for a username,
and if found returns that. If not found, checks for a first name and returns that, 
and if first name is not found, uses the email. See http://docs.meteor.com/#meteor_users.

The important thing to remember with users is that they only have the information that
is provided (it is possible to ensure that certain information is provided though!).

# Collections
First, let's make a basic collection. You don't have to make the declaration of the 
collection in somewhere global (but this is the easiest) - you can make two separate
collections, one for the server and one for the client, as long as they have the same
name. Note that if you are using the collections in your code the collections actually
have to be declared before they can be used - so you need to know the load order
of your application. Anything in a 'lib' folder is loaded first - that's a good
place for this type of declaration.
```
Messages = new Meteor.Collection('messages');
```
To see all these messages, you want to set up a template.
```
<template name="messages">
  <div class="messages">
    {{#each messages}}
      {{time}} -- {{message}}<br>
    {{/each}}
  <div>
  <input type="text" id="chatmessage" class="form-control">
  <button class="btn btn-default" id="chatsend" type="button">Send</button>
</template>
```
The each is a loop that outputs whatever is within it for as many elements
are as found. Now, in our javascript file we need to define a few things:
```
Template.messages.messages = function () {
  return Messages.find({}, { sort: { time: -1 }}).fetch();
}
var submitmessage = function(template){
  var messagebox = template.find('#chatmessage');
  if(messagebox && messagebox.value != ''){
    Messages.insert({
      message: messagebox.value,
      time: Date.now()
    });
  }
}
Template.messages.events = {
  'keydown input#chatmessage' : function (event,template) {
    if (event.which == 13) { // 13 is the enter key event
      submitmessage(template);
    }
  },
  'click button#chatsend' : function(event,template) {
    submitmessage(template);
  }
}
```
This does no server-side validation at all, so you probably wouldn't want
to use it as-is. However, because of the way javascript objects are made and 
saved into collections it is fairly safe-ish. Note that as messages
are inserted the html will automatically be updated with the new data!

See the next section for server-side validation.

## Adding user information
Lets quickly look at the code for adding information for a user, as this shows basically 
how a collection works in Meteor. In the next section we'll create a new collection.

Let's assume that you already have a form with the information in it - a first and
last name for a user. E.g.:
```
<template name="names">
  <form role="form" class="form-inline">
    <div class="form-group">
      <label for="firstNameEntry">First Name: </label>
      <input type="text" class="form-control" id="firstNameEntry" placeholder="John/Jane">
    </div>
    <div class="form-group">
      <label for="lastNameEntry"> Last Name: </label>
      <input type="text" class="form-control" id="lastNameEntry" placeholder="Doe">
    </div>
    <button type="submit" class="btn btn-default" id="submitnames">Submit</button>
  </form>
</template>
```
Now, let's look at the client javascript. We'll also add in a bit of code to prevent the
form from submitting if the user has not entered anything:
```
Template.names.events = {
  'click button#submitnames': function (event, template) {
    event.preventDefault(); // stops form submission
    var firstNameBox = template.find('#firstNameEntry'),
        lastNameBox = template.find('#lastNameEntry');
    if(!firstNameBox.value){
      $(firstNameBox).parent().addClass('has-error').one('keydown',function (event) {
        $(this).removeClass('has-error');
      });
    }
    if(!lastNameBox.value){
      $(lastNameBox).parent().addClass('has-error').one('keydown',function (event) {
        $(this).removeClass('has-error');
      });
    }
  }
  if(firstNameBox.value && lastNameBox.value){
    Meteor.call('setUserNames',firstNameBox.value,lastNameBox.value,function(err,data){
      if(err){
        console.log("Error!");
      }
    });
  }
}
```
Note the $ - this is using jquery for simplicity in a few places. Also, in the function, 
'template' corresponds to the particular instance of the template that is running, and
is a good place to store data if needed!

The other thing you'll notice is the Meteor.call. This calls a server-side function - 
this could actually be done completely on the client side using the same code, but for
the sake of this example we'll make a server method. In a file in server/ add the following:
```
Meteor.methods({
  setUserNames: function(firstName, lastName){
    check(firstName, NonEmptyString);
    check(lastName, NonEmptyString);

    Meteor.users.update({_id:Meteor.user()._id}, {
      $set:{
        "profile.firstName":firstName,
        "profile.lastName":lastName
      }
    });
    return true;
  }
);
```
Note that 'check' ensure that the string being passed in is not empty and throws
an error which will be seen on the client side if it fails. Meteor.users.update 
calls update on the 'users' collection, setting the first and last names.

## Adding user information - other way
Use the same html as above, and most of the javascript. We're just going to change 
the if statement at the end:
```
  if(firstNameBox.value && lastNameBox.value){
    Meteor.users.update({_id:Meteor.user()._id}, {
      $set:{
        "profile.firstName":firstNameBox.value,
        "profile.lastName":lastNameBox.value
      }
    });
  }
```
Now, to have the same characteristics as above we need to ensure we check the
input on the server side.
```
Meteor.users.allow({
  check(firstName, NonEmptyString);
  check(lastName, NonEmptyString);
  return true;
}

```
This is called when the server tries inserting data - if it returns true then
the insertion is allowed, otherwise it is not.

Why would you use one method over the other? If you want the information to
update in the browser instantly, use the second method. However, if it is
rejected then there will be a slight period of time where it looks like the
submission didn't fail before the server replies to the client and the client
resets the data. With the first, nothing is updated until the server has
checked the data.


# Project Layout

```
Root
  ↳ client - anything in this folder only run on client
    ↳ compatibility - anything in this folder runs in root js context rather than a closure
      ↳ recordRTC.js - helper for recording webcam video
    ↳ client.css - all css for the project
    ↳ client.js - general code that doesn't correspond to a particular part such as quizzes
    ↳ client.html - templates for layout, messages, etc that doesn't have own part
    ↳ home.html - some templates for the information pane - telling them to sign in, saying done, etc.
    ↳ quizzes.html - templates for quizzes in general
    ↳ quizzes.js - javascript for quizzes in general
    ↳ ttfquiz.html - templates for TrueTrueFalse quizzes
    ↳ ttfquiz.js - logic for TrueTrueFalse quizzes
  ↳ lib - anything in this folder is loaded first!
    ↳ globals.js - define collections, functions, etc used everywhere    
  ↳ packages - don't touch, for meteorite
  ↳ server - anything in this folder only run on server (put security stuff here!)
    ↳ server.js - sets up path for uploads, publishes messages to chat, restricts access to db & filters data
                - defines some functions to be called by client and run on server
  ↳ public - this is where assets (images, etc) are stored.
           - accessible from web by just name in this folder, i.e. image.jpg would be "image.jpg"
    ↳ uploads - a folder for uploaded images/videos
  app.js - basic setup code which runs on server and client
         - routing for the project!
  smart.json - meteor's smart package install information
  smart.lock - more meteor smart package stuff
```

# 
