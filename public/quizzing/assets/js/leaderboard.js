const rankingsBody = document.querySelector("#rankings > tbody");

function loadRankings() {

    $.ajax({
        url: config.baseUrl + "/users/leaderboard",
        type: "GET",
        credentials: "same-origin",
        success: function (params) {
            console.log(params);
            document.getElementById("OutOf").innerHTML = 130 + params.count;
            // const json = JSON.parse(params);
            populateRankings(params.msg);
        }, error(err) {
            console.log("Error occured: ");
            console.log(err);
        }
    });
}

function populateRankings(leaders) {
    // Populate Leaderboard
    //json.forEach((row) => {
    for(var row of leaders){
        const tr = document.createElement("tr");
        //row.forEach((cell) => {
        for (var cell of row) {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        }//);

    rankingsBody.appendChild(tr);
}//);
}

document.addEventListener("DOMContentLoaded", () => { loadRankings(); });

// document.getElementById('search-leaderboard').onkeyup = function () {
//     var value = this.value;

//     $("table").find("tr").each(function (index) {
//         if (index === 0) return;

//         var if_td_has = false;
//         $(this).find('td').each(function () {
//             if_td_has = if_td_has || $(this).text().indexOf(value) !== -1; //Check if td's text matches key and then use OR to check it for all td's
//         });
//         $(this).toggle(if_td_has);
//     });
// };