'use strict';
var Alexa = require("alexa-sdk");
var AWS = require('aws-sdk');


// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build


exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = process.env.APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('AskIntent');
    },
    'AskIntent': function () {
        console.log(this.event.request.intent);
    
        var s3 = new AWS.S3();
        var params = {
            Bucket: process.env.AUDIO_BUCKET
        }

        var index = (Math.floor(Math.random() * Math.floor(process.env.AUDIO_FILE_COUNT))) + 1; 
        var path = "https://s3.amazonaws.com/" + process.env.AUDIO_BUCKET + "/" + index + ".mp3";
        var audioOut = '<audio src="' + path + '" />';
        //console.log(audioOut);
        this.emit(':tell',audioOut);
        
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('have a great day');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("You can try: 'alexa, ask better day for a thought' or " +
                            "'alexa, ask better day for a suggestion'");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak("Sorry, I didn't get that. You can try: 'alexa, better day'" +
            " or 'alexa, ask better day for a suggestion'");
    }
};
