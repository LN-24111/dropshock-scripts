// ==UserScript==
// @name         DS - Doubleclick to learn Order/Ability
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       XHunter
// @updateURL    https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/doubleclick_learn/doubleclick_learn.meta.js
// @downloadURL  https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/doubleclick_learn/doubleclick_learn.js
// @match        *://command.drop-shock.com/headquarters_ac.php*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==

function drawcommands_2(){
	mytext = "<table cellpadding=0 cellspacing=0 border=0 height='100%'><tr>"
	for (var pi=0;pi<prereq.length;pi++) {
		if (prereq[pi] != "X") {
			mytext += "<td valign='top'>"
			mytext += "<table cellpadding=0 cellspacing=3 border=0 width='140'>"
				HasItems = 0;
				for (var i=0;i<allcommandsname.length;i++) {
					if (prereq[pi] == allcommandspre[i]) {
						HasItems = 1;
						if (userownedcommands[i] == 1) {
							mytext +=`<tr><td width='22'><a href='#' ondblclick="purchase('command', ${i})" onClick="pickitem('command',` + allcommandsid[i] + "," + pi + ");showinfo('command'," + i + ",0);\"><img src='images/icons/" + allcommandsimg[i] + `' border='0'></a></td><td class='unittext'><a href='#' ondblclick="purchase('command', ${i})" onClick=\"pickitem('command',` + allcommandsid[i] + "," + pi + ");showinfo('command'," + i + ",0);\"><font color='white'>" + allcommandsname[i] + "</font></a></td></tr>";
						} else {
							mytext +=`<tr><td width='22'><a href='#' ondblclick="purchase('command', ${i})" onClick="pickitem('command',` + allcommandsid[i] + "," + pi + ");showinfo('command'," + i + ",1);\"><img src='images/icons/" + allcommandsimg[i] + `' border='0'></a></td><td class='unittext'><a href='#' ondblclick="purchase('command', ${i})" onClick=\"pickitem('command',` + allcommandsid[i] + "," + pi + ");showinfo('command'," + i + ",1);\"><b>" + allcommandsname[i] + "</b></a></td></tr>";
						}
					}
				}

			mytext += "</table>"
			mytext += "</td>"
			if (HasItems == 1) {
				mytext += "<td align='left' width='1' height='100%' bgcolor='#3B8524'><img src='images/pixel.gif'></td>"
			}
		}
	}

	mytext += "</tr></table>"
	layerWrite('chooseDIV',mytext)
}
drawcommands = drawcommands_2

function drawabilities_2(){
	mytext = "<table cellpadding=0 cellspacing=0 border=0 height='100%'><tr>"
	for (var pi=0;pi<prereq.length;pi++) {
		if (prereq[pi] != "X") {
			mytext += "<td valign='top'>"
			mytext += "<table cellpadding=3 cellspacing=0 border=0 width='140'>"
				HasItems = 0;
				for (var i=0;i<allabilitiesname.length;i++) {
					if (prereq[pi] == allabilitiespre[i]) {
						HasItems = 1;
						if (userownedabilities[i] == 1) {
							mytext += `<tr><td width='22'><a href='#' ondblclick="purchase('ability', ${i})" onClick=\"pickitem('ability',` + allabilitiesid[i] + "," + pi + ");showinfo('ability'," + i + ",0);\"><img src='images/icons/" + allabilitiesimg[i] + `' border='0'></a></td><td class='unittext'><a href='#' ondblclick="purchase('ability', ${i})" onClick=\"pickitem('ability',` + allabilitiesid[i] + "," + pi + ");showinfo('ability'," + i + ",0);\"><font color='white'>" + allabilitiesname[i] + "</font></a></td></tr>";
						} else {
							mytext += `<tr><td width='22'><a href='#' ondblclick="purchase('ability', ${i})" onClick=\"pickitem('ability',` + allabilitiesid[i] + "," + pi + ");showinfo('ability'," + i + ",1);\"><img src='images/icons/" + allabilitiesimg[i] + `' border='0'></a></td><td class='unittext'><a href='#' ondblclick="purchase('ability', ${i})" onClick=\"pickitem('ability',` + allabilitiesid[i] + "," + pi + ");showinfo('ability'," + i + ",1);\">";
							if (allabilitiesremoves[i] != "*") {
								mytext +="<font class='bantextb'>" + allabilitiesname[i] + "</font>";
							} else {
								mytext +="<b>" + allabilitiesname[i] + "</b>";
							}
							mytext +="</a></td></tr>";
						}
					}
				}
			mytext += "</table>"
			mytext += "</td>"
			if (HasItems == 1) {
				mytext += "<td align='left' width='1' height='100%' bgcolor='#3B8524'><img src='images/pixel.gif'></td>"
			}
		}
	}

	mytext += "</tr></table>"
	layerWrite('chooseDIV',mytext)
}
drawabilities = drawabilities_2

function pickitem_2(myytpe,myint, mypi){

	mypi += 1;
	prereq[mypi] = myint;
	for (var pi=(mypi+1);pi<prereq.length;pi++) { prereq[pi] = "X"; }

	if (myytpe == "command"){ setTimeout(drawcommands, 200)}
	if (myytpe == "ability"){ setTimeout(drawabilities, 200)}

}
pickitem = pickitem_2

var p_o = purchase
function p_2(a, b){
    console.log(a,b)
    p_o(a,b)
}
purchase = p_2