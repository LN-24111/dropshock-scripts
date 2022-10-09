// ==UserScript==
// @name         DS - Reorder Merits
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       XHunter
// @updateURL    https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/reorder_merit/reorder_merit.meta.js
// @downloadURL  https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/reorder_merit/reorder_merit.js
// @match        *://command.drop-shock.com/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==

const MERIT_ORDER = [
    'Speed Demon',
    'Steady Hand',
    'War Hero',
    'Marksmanship',
    'Rockhound',
    'Quick Reflexes',
    'Berserker',
    'Packrat',
    'Energy Specialist',
    'Eagle Eye',
    'Engineer',
    'Armorer',
    'Battlefield Promotion',
    'Acti Master',
]

const MERIT_LINK = {
    'Speed Demon' : 'merit_0.gif',
    'Steady Hand' : 'merit_1.gif',
    'War Hero' : 'merit_2.gif',
    'Marksmanship' : 'merit_3.gif',
    'Rockhound' : 'merit_4.gif',
    'Quick Reflexes' : 'merit_5.gif',
    'Berserker' : 'merit_6.gif',
    'Packrat' : 'merit_7.gif',
    'Energy Specialist' : 'merit_8.gif',
    'Eagle Eye' : 'merit_9.gif',
    'Engineer' : 'merit_10.gif',
    'Armorer' : 'merit_11.gif',
    'Battlefield Promotion' : 'merit_12.gif',
    'Acti Master' : 'merit_13.gif'
}

var showgroup_1 = typeof(showgroup) == 'undefined' ? null : showgroup;
function showgroup_2(mygroup){
    if (showgroup_1 != null)
        showgroup_1(mygroup)
    sortMerits()
}
showgroup = showgroup_2

var processGetGroup_1 = typeof(processGetGroup) == 'undefined' ? null : processGetGroup;
function processGetGroup_2(){
    if (processGetGroup_1 != null)
        processGetGroup_1()
    sortMerits()
}
processGetGroup = processGetGroup_2

var setcrewConfirmed_1 = typeof(setcrewConfirmed) == 'undefined' ? null : setcrewConfirmed;
function setcrewConfirmed_2(a,b){
    if (setcrewConfirmed_1 != null)
        setcrewConfirmed_1(a,b)
    sortMerits()
}
setcrewConfirmed = setcrewConfirmed_2

function hasMerit(td, merit_order_id){
    var imgs = td.childNodes
    for (var i = 0; i < imgs.length; i++){
        if ($(imgs[i]).filter(`[src*="${MERIT_LINK[MERIT_ORDER[merit_order_id]]}"]`).length > 0){
            return i
        }
    }

    return -1
}

function sortMerits(){
    var merits = $('img[src^="images/merits/"]:not(.dsPointer)')
    var tds = merits.parent()
    for (var td of tds){
        for (var i = 0; i < MERIT_ORDER.length; i++){
            var pos = hasMerit(td, i)
            if (pos != -1){
                td.appendChild(td.childNodes[pos])
            }
        }
    }
}

sortMerits()