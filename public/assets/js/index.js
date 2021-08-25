
setInterval(checkDeadlines, 2400000);

//Hints Code
var j = 0;
var i = 0;
var Hints = [
    "Try WASD to Move",
    "Press Shift to Sprint",
    "Roam Around With your Ghost Through the buildings",
    "Go To the Buildings",
    "And press and hold Space To Enter",
    "Try WASD to Move",
    "Press Shift to Sprint",
    "Go To the Buildings",
    "And press and hold Space To Enter",
    "Try WASD to Move",
    "Press Shift to Sprint",
    "Go To the Buildings",
    "And press and hold Space To Enter",
    "Try WASD to Move",
    "Press Shift to Sprint",
    "Go To the Buildings",
    "And press and hold Space To Enter",
    "Incase Stuck Somewhere Try Refreshing the page"
]
var txt = 'Lorem ipsum typing effect!'; /* The text */
var speed = 50; /* The speed/duration of the effect in milliseconds */


function ChooseHint() {
    j++;
    if (j >= Hints.length)
        j = 0
    // console.log("j", j)
    i = 0;
    document.getElementById("HINTS").innerHTML = "";
    RenderHint();
    setTimeout(ChooseHint, 5000);

}
function RenderHint() {
    if (i < Hints[j].length) {
        document.getElementById("HINTS").innerHTML += Hints[j].charAt(i);
        i++;
        setTimeout(RenderHint, speed);
    }
}

