// default 
var dictionary = {"cat": "best animal that meows", 
                    "dog": "best animal that barks",
                    "giraffe": "very tall animal", 
                    "unicorn": "magical animal(?)"}
// get dictionary to use
var dictName = localStorage.getItem('CURRDICT')
if (dictName != null) {
    let strDict = localStorage.getItem(dictName)
    dictionary = JSON.parse(strDict)
}

// updates
let keys = Object.keys(dictionary)
let currKey = ""

var score = 0
var startTime = Math.floor(Object.keys(dictionary).length/2)*60 + (Object.keys(dictionary).length % 2) * 30

function randomKey() {
    // removes chosen random key from keys list
    let i = Math.floor(Math.random() * keys.length)
    currKey = keys[i]
    keys.splice(i, 1)
    document.getElementById('definition').innerText = dictionary[currKey]

    document.getElementById('word').placeholder = "·".repeat(currKey.length)

    var underscores = '';
    for (var j = 0; j < currKey.length; j++) {
        if ([' ', "'", '.', '-'].includes(currKey.charAt(j))) {
            underscores += "\u00A0\u00A0 "; // add spaces 
        } else {
            underscores += "_ ";
        }
    }
    document.getElementById('underscores').innerText = underscores

    // limit number of letters allowed to be typed
    // source: https://stackoverflow.com/questions/9841363/how-to-restrict-number-of-characters-that-can-be-entered-in-html5-number-input-f
    document.getElementById('word').onkeydown = function() {
        if(this.value.length > currKey.length) {
            this.value = this.value.substr(0, currKey.length);
        }
    }
    document.getElementById('word').onkeyup = function() {
        if(this.value.length > currKey.length) {
            this.value = this.value.substr(0, currKey.length);
        }
    }
}

function spellAttempt() {
    let input = document.getElementById('word').value
    if (input.toLowerCase() == currKey) {
        // if correct guess
        updateScore()
        document.getElementById('word').value = ""
        document.getElementById('word').placeholder = ''
        document.getElementById('word').placeholder = ''
        document.getElementById('underscores').style.color = 'white'
        if (keys.length == 0) {
            // if no more words to guess, user wins!
            currKey = -1
            document.getElementById('word').disabled = true
            document.getElementById('definition').innerText = ""
            document.getElementById('message').innerText = "You Win!\nScore: " + score + " pts"
            document.getElementById('spellAttempt').disabled = true
        } else {
            // show next word
            document.getElementById('message').innerText = ""
            randomKey()
            document.getElementById('word').focus()
        }
    } else {
        // incorrect guess
        document.getElementById('word').value = ""
        document.getElementById('word').placeholder = input
        document.getElementById('underscores').style.color = '#cc0035'
        document.getElementById('message').innerText = "Try Again!"
        document.getElementById('word').focus()
    }
}

// gets score based on total time used and total number of questions answered
function updateScore() {
    var currTimes = document.getElementById("countdown").innerText.split(":");
    var timeLeft = parseInt(currTimes[0])*60 + parseInt(currTimes[1]);
    timeUsed = startTime - timeLeft;
    if (timeUsed != 0) {
        score += Math.floor((30 / timeUsed) * 10); // based on 30s per word
    } else {
        score += 500; // can't divide by 0 but they got the word in 0s for bonus points
    }
    startTime = timeLeft;
    document.getElementById('score').innerText = score + " pts";
    document.getElementById('progressText').innerText = (Object.keys(dictionary).length-keys.length) + " / " + Object.keys(dictionary).length
    document.getElementById('progressBar').style.width = ((Object.keys(dictionary).length - keys.length) / Object.keys(dictionary).length *100) + "%"
}

// submit input by pressing enter
document.getElementById('word').addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
      // Cancel the default action, if needed
      event.preventDefault();
      // do same thing as clicking button
      document.getElementById("spellAttempt").click();
    }
  });

// call random key to start
document.getElementById('word').disabled = true;
document.getElementById('spellAttempt').disabled = true;
function startGame() {

    document.getElementById('word').disabled = false;
    document.getElementById('spellAttempt').disabled = false;
    document.getElementById('startGame').style.display = 'none';
    document.getElementById('score').innerText = '0 pts'

    document.getElementById('progressText').innerText = "0 / " + Object.keys(dictionary).length
    document.getElementById('progressBar').style.width = "1%"

    mins = Math.floor(Object.keys(dictionary).length/2);
    secs = (Object.keys(dictionary).length % 2) * 30;
    countdown("countdown", mins, secs);

    document.getElementById('word').focus()

    randomKey()
}