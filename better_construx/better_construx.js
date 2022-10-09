// ==UserScript==
// @name         DS - Better Construx
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       XHunter
// @updateURL    https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/better_construx/better_construx.meta.js
// @downloadURL  https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/better_construx/better_construx.js
// @match        *://command.drop-shock.com/headquarters_construx.php?*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==

//Sticky the damn thing
$('table').last().css('position','fixed')
$('table').last().css('bottom','0px')
$('table').last().css('height','auto')

$(document).attr('unselectable','on')
    .css({'-moz-user-select':'-moz-none',
          '-moz-user-select':'none',
          '-o-user-select':'none',
          '-khtml-user-select':'none',
          '-webkit-user-select':'none',
          '-ms-user-select':'none',
          'user-select':'none'
         }).bind('selectstart', function(){ return false; });

//Stackoverflow... why tf is this not built in?
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
        return null;
    }
    return decodeURI(results[1]) || 0;
}

//Make construx easier to manage
var trs = $('form[name="giveFORM"]>table').last().children().children()
if ($.urlParam('action') == 'give'){
    trs.find(">:first-child").css('display', 'none')
}


var cbs = $($('table')[1]).children('input[type="checkbox"]')
var mouseDown = false
$(document).mousedown(function(event){mouseDown = true})
$(document).mouseup(function(event){mouseDown = false})

trs.find(">:nth-child(3)").mouseenter(function(event){
    event.stopPropagation()
    var cb = $(this).parent().find('input[type="checkbox"]')
    if (cb.length == 1 && mouseDown){
        cb.prop("checked", !cb.prop("checked"))
        $(this).css('background',cb.is(":checked") ? '#005600' : '')
    }
})

trs.find(">:nth-child(3)").mousedown(function(event){
    var cb = $(this).parent().find('input[type="checkbox"]')
    if (cb.length == 1){
        cb.prop("checked", !cb.prop("checked"))
        $(this).css('background',cb.is(":checked") ? '#005600' : '')
    }
})