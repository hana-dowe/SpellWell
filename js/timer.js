// source: https://codepen.io/rxsharp/pen/jPZgpX

function countdown( elementName, minutes, seconds )
{
    var element, endTime, mins, msLeft, time;

    function twoDigits( n )
    {
        return (n <= 9 ? "0" + n : n);
    }

    function updateTimer()
    {
        if (document.getElementById('word').disabled) {
            // if game is over (user won)
            return
        }

        msLeft = endTime - (+new Date);
        if ( msLeft < 1000 ) {
            element.innerHTML = "0:00";
            document.getElementById('word').value = ""
            document.getElementById('word').disabled = true
            document.getElementById('definition').innerText = "-"
            document.getElementById('message').innerText = "Time is up!" 
            document.getElementById('spellAttempt').disabled = true
        } else {
            time = new Date( msLeft );
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            element.innerHTML = mins + ':' + twoDigits(time.getUTCSeconds());
            setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
        }
    }

    element = document.getElementById( elementName );
    endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
    updateTimer();
}
