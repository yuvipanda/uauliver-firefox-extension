/*
Very simple Firefox extension that continuously resets your
User Agent to a randomly generated string of emojis of random
length. That may or may not contain a tab character.
*/

var prefs = require("sdk/preferences/service");
var timers = require('sdk/timers');
var unload = require("sdk/system/unload");

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomEmoji() {
    // if we hit an invalid codepoint, just try again :)
    try {
        return String.fromCodePoint(getRandom(0x1F300, 0x1F64F));
    } catch (err) {
        // JS does tail call optimization, right?!
        // This is tail call optimizable, right?
        return getRandomEmoji();
    }
}

function generateUA() {
    var ua = '';
    var length = getRandom(7, 64);
    while (ua.length < length) {
        ua += getRandomEmoji();
    }
    return ua;
}

var timerID = timers.setInterval(function(tab) {
    prefs.set('general.useragent.override', generateUA());
}, 5 * 1000);

unload.when(function() {
    timers.clearInterval(timerID);
    prefs.reset('general.useragent.override');
});
