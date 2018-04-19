'use strict';
var Alexa = require("alexa-sdk");
//var AWS = require('aws-sdk');
var CONFIG = require('request');


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
        this.response.speak('bong');
        this.emit('AskIntent');
    },
    'AskIntent': function () {

        //console.log(this.event.request.intent);

        var configFile = "https://s3.amazonaws.com/" + process.env.AUDIO_BUCKET + "/config.json";
        var imgFile = "https://s3.amazonaws.com/" + process.env.AUDIO_BUCKET + "/yinyang.png";
        //console.log(configFile);

        var AlexaObj = this;
        CONFIG.get(configFile, function (error, resp, body) {
            if (!error) {

                //console.log(body);

                var configObj = JSON.parse(body);

                //console.log(configObj);
                
                var noteIndex = Math.floor(Math.random() * Math.floor(process.env.AUDIO_FILE_COUNT)); 

                //console.log(configObj[noteIndex]);

                var cardText = configObj[noteIndex].note;
                console.log(cardText);
    
                //var s3 = new AWS.S3();
                //var params = {
                //    Bucket: process.env.AUDIO_BUCKET
                // }
                var audioIndex = noteIndex + 1; 

                var path = "https://s3.amazonaws.com/" + process.env.AUDIO_BUCKET + "/" + audioIndex + ".mp3";

                var audioOut = "Have a better day. Contemplate this: " +
                    '<audio src="' + path + '" />';

                console.log(audioOut);

                AlexaObj.emit(':tellWithCard', audioOut, "Have a Better Day", cardText, imgFile);

            } else {
                AlexaObj.emit(':tellWithCard',"Generate Kindness","Have a Better Day","Contemplate",null);

            }
 
        });
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
