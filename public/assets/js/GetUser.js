var curUser;

function GetUser() {
    $.ajax({
        url: config.baseUrl + "/users",
        type: "GET",
        success: function (response) {
            response = response.user
            document.getElementById("userData").innerHTML = `<i class="fa fa-bitcoin fa-coins"></i>&nbsp;${response.coins}&nbsp;&nbsp;&nbsp;<i class="fa fa-user" aria-hidden="true"></i>&nbsp;${response.firstname}`;
            document.getElementById("LoginButtons").style.display = "none"
            curUser = response;
        }, error: function (err) {
        }
    })
}