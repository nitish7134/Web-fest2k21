var quizJson;
function getQuiz() {
    // var auth = 'bearer ' + localStorage.getItem('token');
    $.ajax({
        type: "GET",
        url: config.baseUrl + '/quiz',
        credentials: 'same-origin',
        success: function (params) {
            quizJson = params;
            console.log(quizJson);
            if (quizJson.status) {
                loadQuiz(quizJson);
            } else {

                var output = `<p style="color:#00000;font-weight:bold;font-family:Lato">${params.err}</p>`;
                document.getElementById("quiz").innerHTML = output;

                document.getElementById("previous").style.display = "none";
                document.getElementById("next").style.display = "none";
                document.getElementById("submit").style.display = "none";
            }
        },
        error: function (e) {
            // console.log("Error:" + e);
            window.location.replace('../error/?index=2');
        }
    });
}
function showError(err) {
    console.log(err);
}

function onQuizSubmit(params) {

    $.ajax({
        type: 'POST',
        url: config.baseUrl + "/quiz/" + quizJson.quiz._id,
        headers: { contentType: "application/json" },
        //dataType: "json",
        data: {
            MarkedResponse: params
        },
        credentials: 'same-origin'
    })
        .then(response => {
            if (response.status) {
                var output = `<p style="color:#00000;font-weight:bold;font-family:Lato">Your Score: ${response.score}!</p><p>Successfully recorded.</p>`;
                document.getElementById("quiz").innerHTML = output;
                document.getElementById("previous").style.display = "none";
                document.getElementById("next").style.display = "none";
                document.getElementById("submit").style.display = "none";
            } else {
                if (response.msg == "Quiz Already Given") {
                    var output = `<p style="color:#00000;font-weight:bold;font-family:Lato">You have already given this quiz!</p>`;
                    document.getElementById("quiz").innerHTML = output;

                    document.getElementById("previous").style.display = "none";
                    document.getElementById("next").style.display = "none";
                    document.getElementById("submit").style.display = "none";
                }
                else
                    document.getElementById("results").innerHTML = response.err;
            }
        }).catch((err) => {
            if (err.msg == "User Not Found") {
                window.location.replace('../error/index.html?index=2')
            }
        })
}
