var marketJson;
function GetMarket() {
    $.ajax({
        type: "GET",
        url: config.baseUrl + '/market',
        credentials: 'same-origin',
        success: function (response) {
            marketJson = response;
            if (!response.length) {
                var output = '<div style="text-align: center;"><h1> SOLD OUT! Visit us again soon for<br/> new product lineups...</h1></div>'
                document.getElementById("wrapper").innerHTML = output;
            }
            else {
                loadMarket(marketJson);
            }
        },
        error: function (e) {
            console.log("Errors: ", e);
        }
    });
}


function onBuyItem(itemId) {
    console.log("Trying to buy: " + itemId);
    $.ajax({
        type: 'POST',
        url: config.baseUrl + "/market/buy",
        headers: { contentType: "application/json" },
        //dataType: "json",
        data: {
            "itemId": itemId
        },
        credentials: 'same-origin',
        success: (response) => {
        
            alert(response.msg + "\nTotal purchased Quantity : " + response.quantity);
            console.log(response);
        },
        error: (err) => {
            console.log(err);
            if (err.status == 401)
                window.location.replace('../error/index.html?index=2');
            else {
                err = err.responseJSON;
                window.location.replace('../error/index.html?index=' + err.index);
            }
        }
    })
}
