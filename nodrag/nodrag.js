// ==UserScript==
// @name         DS - NoDrag
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       XHunter
// @updateURL    https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/nodrag/nodrag.meta.js
// @downloadURL  https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/nodrag/nodrag.js
// @match        *://command.drop-shock.com/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==

$('img').attr("draggable","false")
$('a').attr("draggable","false")
$('.Atextam').attr("pointer-events","none")