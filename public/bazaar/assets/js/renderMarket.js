var baseUrl = './images';
function loadMarket(params) {
    function buildMarket(params) {
        var market = params;
        console.log(market);
        var mainContainer = document.getElementById('wrapper');
        const output = [];
        for (var i = 0; i < market.length; i++) {
            const itemDiv = [];
            var align;
            if (i % 2 == 0) alt = "";
            else alt = "alt";
            itemDiv.push(
                `<section class="wrapper ${alt} spotlight style${i % 3 + 1}">
					<div class="inner">
                        <a href="${market[i].redirectUrl}"  target="_blank" class="image"><img src="./images/${market[i].imageName}.jpg" alt="" /></a>
                        <div class="content">
                            <h2 class="major">${market[i].itemName}</h2>
                            <p>${market[i].cost} <i class="fa fa-bitcoin fa-coins"></i></p>
                            <p>${market[i].description}</p>
                            <button class="special" onclick="onBuyItem('${market[i]._id}')">Buy here!</button>
                        </div>
                    </div>
                </section>`
            );

            output.push(`${itemDiv}`);
        }

        mainContainer.innerHTML = output.join("");
    }
    buildMarket(params);
}
