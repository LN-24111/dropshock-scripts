// ==UserScript==
// @name         DS - Extra Grids
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       XHunter
// @updateURL    https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/extra_grid/extra_grid.meta.js
// @downloadURL  https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/extra_grid/extra_grid.js
// @match        *://command.drop-shock.com/map_viewer.php*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==

/*Prevent context menu for misclicks*/
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);



/* Getting map dimensions */
let [baseX, baseY] = HtmlToGame(0, 0, true)
baseX /= 10
baseY /= 10

var gridSize = gameVar.scale * 100
/* Can't find the var, so have to do it the hard way */
var width, height
for (width = 0; ; width++){
    if ($(`#map${width}x0DIV`).length == 0){
        width--
        break
    }
}

for (height = 0; ; height++){
    if ($(`#map0x${height}DIV`).length == 0){
        height--
        break
    }
}

var screenWidth = (width + 1) * gridSize
var screenHeight = (height + 1) * gridSize
for (var i = 1; i <= width; i++){
    if ((i + baseX) % 6 == 0){
        if (i + baseX != 0)
            drawLine('vertical', i * gridSize,'#3399ff')
    }
    else if ((i + baseX) % 6 == 3)
        drawLine('vertical', i * gridSize,'#00ff00')
}

for (i = 1; i <= height; i++){
    if ((i + baseY) % 6 == 0){
        if (i + baseY != 0)
            drawLine('horizontal', i * gridSize, '#3399ff')
    }
    else if ((i + baseY) % 6 == 3)
        drawLine('horizontal', i * gridSize, '#00ff00')
}

function drawLine(direction, offset, color){
    var node
    if (direction == 'vertical'){
        node = $.parseHTML(`<div style="font-size:0px; height:${screenHeight}px; width:1px; background-color:${color};position:absolute;left:${offset}px;top:0px"></div>`)
        $('#map0x0DIV').parent().append(node)
    }
    else if (direction == 'horizontal'){
        node = $.parseHTML(`<div style="font-size:0px; height:1px; width:${screenWidth}px; background-color:${color};position:absolute;top:${offset}px;left:0px"></div>`)
        $('#map0x0DIV').parent().append(node)
    }
}

/* More grids! */
$(document).ready(function(){
    var fogOfWar = $('[id^="map"][id$="DIV"]:not(:has(img))')
    fogOfWar.css("background-color", "#333333")
    fogOfWar.append($($.parseHTML((`<img src="images/background_grid_${gameVar.scale}0.gif" width="${100*gameVar.scale}" height="${100*gameVar.scale}" ondrag='return false;' onmousedown='return false;'>`))))
})