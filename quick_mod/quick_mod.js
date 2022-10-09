// ==UserScript==
// @name         DS - Quick Mod
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       XHunter
// @updateURL    https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/quick_mod/quick_mod.meta.js
// @downloadURL  https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/quick_mod/quick_mod.js
// @match        *://command.drop-shock.com/modify_units.php
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==


function execute(query){
    var order = JSON.parse(query)
    var unit = order[0]
    var variant = order[1]
    var slot = order[2]*2
    var amount = order[3]

    var slotsToClick  = $(`td.unittext:contains(${unit}):contains(${variant})`).find('td.modBoxtd')
    if (amount == null || slotsToClick.length < amount)
        amount = slotsToClick.length

    for (var i = 0; i < amount; i++){
        setTimeout(function (j){
            slotsToClick[j].childNodes[slot].click()
        }, 10 * i, i)
    }
}
function queueCommand_2(myActor,myAction,myTarget) {
	myCommand = myActor + "," + myAction + "," + myTarget;
    commandQueue[(commandQueue.length)] = myCommand
    drawQueue();
}

queueCommand = queueCommand_2

var hiddenCrews = []
var display = $('[id^="crewDIV"]:not([style*="visibility:hidden"])')
if (display.length > 0) display = display[0].style.display

function hideCrews(){
    var crews = $('[id^="crewDIV"]:not([style*="visibility:hidden"])')
    for (var crew of crews){
        if ($(crew).find('img').length == 8){
            hiddenCrews.push(crew)
            crew.style.display = 'none'
        }
    }
}

function showCrews(){
    while (hiddenCrews.length > 0)
        hiddenCrews.pop().style.display = display
}

$(document).keypress(function(event){
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == '113'){
		var request = prompt("Query?", '["", "", 0, null]');
        if (request == null)
            return
        execute(request)
	}
    else if (keycode == '122')
        showCrews()
    else if (keycode == '120')
        hideCrews()
    else
        console.log(keycode)
});

