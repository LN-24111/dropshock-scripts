// ==UserScript==
// @name         DS - Better Storage
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       XHunter
// @updateURL    https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/better_storage/better_storage.meta.js
// @downloadURL  https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/better_storage/better_storage.js
// @match        *://command.drop-shock.com/headquarters_units.php*
// @match        *://command.drop-shock.com/faction_storage.php*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==

$(document).attr('unselectable','on')
    .css({'-moz-user-select':'-moz-none',
          '-moz-user-select':'none',
          '-o-user-select':'none',
          '-khtml-user-select':'none',
          '-webkit-user-select':'none',
          '-ms-user-select':'none',
          'user-select':'none'
         }).bind('selectstart', function(){ return false; });

var div = document.getElementById('bottomInfo')
if (div != null){
    div.style.position = 'fixed'
    div.style.bottom = 0
    div.style.right = '500px'
}

var mouseDown = false
$(document).mousedown(function(event){mouseDown = true})
$(document).mouseup(function(event){mouseDown = false})


function addListeners(checkingGroup){
    var trs, cbs, radios, trs_radio
    if (checkingGroup != null){
        cbs = $(`#${checkingGroup}`).find('input.twCB[type=checkbox]')
        radios = $(`#${checkingGroup}`).find('input.twCB[type=radio]')
    }
    else{
        cbs = $('input.twCB[type=checkbox]')
        radios = $('input.twCB[type=radio]')
    }
    trs = cbs.parent().parent()
    trs_radio = radios.parent().parent()

    trs.mouseenter(function(event){
        event.stopPropagation()
        var cb = $(this).find('input.twCB[type=checkbox]')
        if (CBshown && cb.length == 1 && mouseDown){
            cb.click()
        }
    })

    trs.mousedown(function(event){
        var cb = $(this).find('input.twCB[type=checkbox]')
        if (CBshown && cb.length == 1){
            cb.click()
        }
    })

    trs_radio.click(function(event){
        var radio = $(this).find('input.twCB[type=radio]')
        if (radio.length == 1){
            radio.click()
        }
    })

    cbs.change(function(event){
        event.stopPropagation()
        var parent = $(this).parent().parent()
        parent.css('background',$(this).is(":checked") ? 'purple' : '')
    })

    radios.click(function(event){
        event.stopPropagation()
        for (var tr_radio of trs_radio){
            $(tr_radio).css('background', $(tr_radio).find('input.twCB[type=radio]').is(":checked") ? 'purple' : '')
        }
    })

    cbs.css('display', 'none')
}

var tr_plus = $('tr>td.endP>a').parent().parent()
tr_plus.click(function(event){
    $(this).find('td.endP>a')[0].click()
})
//Overwrite
function hideCB_2() {
    arrElements = getElementsByClassName("twCB", "input", document)
    for(var i=0; i<arrElements.length; i++){
        $(arrElements[i]).parent().parent().css('background', '')
        if ($(arrElements[i]).is(":checked"))
            $(arrElements[i]).click()
        arrElements[i].style.visibility = "hidden"
    }
    CBshown = false;
}
hideCB = hideCB_2

function processGetGroup_2() {
    if (webCheckGroup.readyState == 4) {
        if (webCheckGroup.status == 200) {
            document.getElementById(checkingGroup+"exp").style.visibility="hidden";
            document.getElementById(checkingGroup+"exp").style.display="none";
            document.getElementById(checkingGroup+"tr").style.visibility="visible";
            if (fx) { document.getElementById(checkingGroup+"tr").style.display="table-row"; }
            else { document.getElementById(checkingGroup+"tr").style.display="block"; }
            document.getElementById(checkingGroup).innerHTML = webCheckGroup.responseText;
            addListeners(checkingGroup)
            checkingGroup = "none";
            if (CBshown) { showCB(); }
        }
    }
}

processGetGroup = processGetGroup_2

addListeners()

function showgroup2(mygroup) {
    let xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4){
            if (this.status == 200) {
                document.getElementById(mygroup+"exp").style.visibility="hidden";
                document.getElementById(mygroup+"exp").style.display="none";
                document.getElementById(mygroup+"tr").style.visibility="visible";
                if (fx) { document.getElementById(mygroup+"tr").style.display="table-row"; }
                else { document.getElementById(mygroup+"tr").style.display="block"; }
                document.getElementById(mygroup).innerHTML = this.responseText;
                addListeners(mygroup)
                if (CBshown) { showCB(); }
                disableLowLevelCrews(window.document.giveFORM.action === "process_scrap.php");
            }
        }
    }
    xmlhttp.open('get', `/process_get_group.php?group=${mygroup}${window.location.pathname == '/faction_storage.php' ? 'x1':''}`)
    try{
        xmlhttp.send()
    }
    catch(err){}
}
function expandAll(){
    $('[id$=exp][id^=unitx]:visible').each(function(){
        showgroup2(this.id.substring(0, this.id.length-3))
    })
}
function clickDitUnits(){
    let units = $('font:contains(Mod Slot)').prev()
    for (let unit of units){
        if(unit.textContent.length == 0){
            var cb = $(unit).parent().parent().parent().parent().parent().parent().parent().find('input.twCB[type=checkbox]')
            if (CBshown && cb.length == 1){
                if(cb[0].checked == false)
                    cb.click()
            }
        }
    }
}

document.addEventListener('keyup', (event)=>{
    if (event.code == 'Digit1'){
        expandAll()
    }
    if (event.code == 'Digit2'){
        clickDitUnits()
    }
})
