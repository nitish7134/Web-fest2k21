var supposedCurrentTime = new Array(4).fill(0);

var companies = ['sbi', 'oxfam', 'cei'];

for (let i = 0; i < companies.length; i++) {
    var thisVideo = document.getElementById(`video${i + 1}`);
    console.log("Adding event Listener to " + thisVideo);
    thisVideo.addEventListener('timeupdate', (event) => {
        // console.log("Time Updated in: " + i + " supTime: " + supposedCurrentTime[i]);
        if (!event.target.seeking) {
            supposedCurrentTime[i] = event.target.currentTime;
        }
    });
    thisVideo.addEventListener('seeking', (event) => {
        var delta = event.target.currentTime - supposedCurrentTime[i];
        console.log(delta);
        if (Math.abs(delta) > 0.01) {
            console.log("Seeking is disabled");
            event.target.currentTime = supposedCurrentTime[i];
        }
    });
    thisVideo.addEventListener("ended", (event) => {
        supposedCurrentTime[i] = 0;
        $.ajax({
            url: config.baseUrl + "/users/sponser/coins",
            type: "PUT",
            dataType: "json",
            credentials: "same-origin",
            data: {
                "brandName": companies[i]
            },
            success: function(response) {
                if (response.err == 208) {
                    console.log(response.err);
                } else {
                    console.log(response);
                }
            },
            error(err) {
                console.log("We have reached error block\n");
                console.log(err);
            }
        })
    });
}

// delete the following event handler if rewind is not required

/*
var timeStarted = -1;
var timePlayed = 0;
var duration = 0;

// If video metadata is loaded get duration
if (video.readyState > 0)
    getDuration.call(video);
//If metadata not loaded, use event to get it
else {
    video.addEventListener('loadedmetadata', getDuration);
}

var supposedCurrentTime = 0;
video.addEventListener('timeupdate', function () {
    if (!video.seeking) {
        supposedCurrentTime = video.currentTime;
    }
});
// prevent user from seeking
video.addEventListener('seeking', function () {
    // guard agains infinite recursion:
    // user seeks, seeking is fired, currentTime is modified, seeking is fired, current time is modified, ....
    var delta = video.currentTime - supposedCurrentTime;
    if (Math.abs(delta) > 0.01) {
        console.log("Seeking is disabled");
        video.currentTime = supposedCurrentTime;
    }
});

video.addEventListener('ended', function () {
    // reset state in order to allow for rewind
    supposedCurrentTime = 0;
});

// remember time user started the video
var companyName;
function videoStartedPlaying() {

    timeStarted = new Date().getTime() / 1000;
    companyName = video.value;

}

function getDuration() {
    duration = video.duration;
    document.getElementById("duration").appendChild(new Text(Math.round(duration) + ""));
    console.log("Duration: ", duration);
    return duration;
}

video.addEventListener("play", videoStartedPlaying);
video.addEventListener("playing", videoStartedPlaying);

// video.addEventListener("ended", videoStoppedPlaying);
video.addEventListener("pause", videoStoppedPlaying); */