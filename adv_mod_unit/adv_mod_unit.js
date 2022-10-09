// ==UserScript==
// @name         DS - Advanced Modify Unit
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       XHunter
// @updateURL    https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/adv_mod_unit/adv_mod_unit.meta.js
// @downloadURL  https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/adv_mod_unit/adv_mod_unit.js
// @match        *://command.drop-shock.com/modify_units.php
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==

fix_gui()

function fix_current_layout(){
    //Remove ALL background divs
    $('[id$="bgDIV"]').remove()
    $('#unitsidebar2DIV').remove()
    $('#crewsidebar2DIV').remove()
    $('#modsidebar2DIV').remove()
    $('#line2DIV').remove()
    $('#line1DIV').remove()
    $('#infotext1DIV').remove()

    //Reposition stuff
    $('body').append($('<div id="wrapper"></div>').append($('#container1DIV')))
    $('#wrapper').css('margin-left', '0.7%')

    $('#unitsidebar1DIV').append($('<div style="height: 100%; width: 18px;"></div>').append($('#unitsidebar1DIV').children('img')))
    $('#unitsidebar1DIV').append($('<div style="border-left: 1px solid rgb(0, 153, 255); height: 100%; width: calc(100% - 18px);"></div>').append($('#unitbar1DIV')))
    $('#crewsidebar1DIV').append($('<div style="height: 100%; width: 18px;"></div>').append($('#crewsidebar1DIV').children('img')))
    $('#crewsidebar1DIV').append($('<div style="border-left: 1px solid rgb(0, 153, 255); height: 100%; width: calc(100% - 18px);"></div>').append($('#crewbar1DIV')))
    $('#modsidebar1DIV').append($('<div style="height: 100%; width: 18px;"></div>').append($('#modsidebar1DIV').children('img')))
    $('#modsidebar1DIV').append($('<div style="border-left: 1px solid rgb(0, 153, 255); height: 100%; width: calc(100% - 18px);"></div>').append($('#modbar1DIV')))

    $('#container1DIV').css('width', '99%')
    $('#container1DIV').css('display', 'block')
    $('#container1DIV').css('position', 'relative')
    $('#container1DIV').css('top', '0')
    $('#container1DIV').css('left', '0')
    $('#container1DIV').children().css('position', 'relative')
    $('#container1DIV').children().css('outline', '1px solid #0099ff')
    $('#container1DIV').children().css('margin', '0 auto')
    $('#container1DIV').children().css('top', '0')
    $('#container1DIV').children().css('left', '0')
    $('#container1DIV').children().css('width', '100%')
    $('#container1DIV').children().css('height', 'auto')

    //Filter
    $('#filter1holderDIV').css('background','#2b2b2b')
    $('#filter1holderDIV').css('top','15px')
    $('#filter1holderDIV').css('left','0.7%')
    //Top bar
    $('#text1DIV').css('display', 'flex')
    $('#text1DIV').css('flex-direction', 'row')
    $('#text1DIV').css('justify-content', 'right')
    $('#text1DIV').css('align-items', 'center')
    $('#text1DIV').css('height', '20px')
    $('#text1DIV').css('overflow', 'hidden')

    $('#text1DIV').children().css('position', 'relative')
    $('#text1DIV').children().css('top', '')
    $('#text1DIV').children().css('left', '')
    $('#text1DIV').children().css('width', 'auto')
    $('#text1DIV').children().css('height', 'parent')
    $('#text1DIV').children().css('margin-right', '10px')

    $('#helptext1DIV').css('margin-right', 'auto')
    $('#helptext1DIV').css('order', 0)
    $('#queuetext1DIV').css('order', 1)
    $('#filter1DIV').css('order', 2)
    $('#multimod1DIV').css('order', 3)
    $('#armyCE1DIV').css('order', 4)
    $('#armyCE1DIV').css('padding-right', '20px')

    //Unit bar
    $('#unitsidebar1DIV').css('display', 'flex')
    $('#unitsidebar1DIV').css('flex-direction', 'row')
    $('#unitsidebar1DIV').css('justify-content', 'left')
    $('#unitsidebar1DIV').css('align-items', 'center')

    $('#unitbar1DIV').css('position', 'relative')
    $('#unitbar1DIV').css('width', '100%')
    $('#unitbar1DIV').css('top', '0')
    $('#unitbar1DIV').css('left', '0')
    $('#unitbar1DIV').css('overflow', 'auto')

    //Crew bar
    $('#crewsidebar1DIV').css('display', 'flex')
    $('#crewsidebar1DIV').css('flex-direction', 'row')
    $('#crewsidebar1DIV').css('justify-content', 'left')
    $('#crewsidebar1DIV').css('align-items', 'center')

    $('#crewbar1DIV').css('position', 'relative')
    $('#crewbar1DIV').css('width', '100%')
    $('#crewbar1DIV').css('top', '0')
    $('#crewbar1DIV').css('left', '0')
    $('#crewbar1DIV').css('overflow', 'auto')
    $('#crewbar1DIV').find('table').attr('background', 'images/mod_mod_bg.gif')

    //Mod bar
    $('#modsidebar1DIV').css('display', 'flex')
    $('#modsidebar1DIV').css('flex-direction', 'row')
    $('#modsidebar1DIV').css('justify-content', 'left')
    $('#modsidebar1DIV').css('align-items', 'center')
    $('#modsidebar1DIV').css('height', 'auto')

    $('#modbar1DIV').css('height', '100%')
    $('#modbar1DIV').css('position', 'relative')
    $('#modbar1DIV').css('width', '100%')
    $('#modbar1DIV').css('top', '0')
    $('#modbar1DIV').css('left', '0')
    $('#modbar1DIV').css('overflow', 'auto')
}

function draw_advanced_table(){
    $('#wrapper').append($('<div id="adv_table" style="height: 240px; width: 99%; display: flex; outline: rgb(0, 153, 255) solid 1px;"></div>'))

    $('#adv_table').append($('<div id="unit_filter_container" style="width: 33%; border-right: 1px solid rgb(0, 153, 255);"></div>'))
    $('#adv_table').append($('<div id="crew_filter_container" style="width: 33%; border-right: 1px solid rgb(0, 153, 255);"></div>'))
    $('#adv_table').append($('<div id="mod_filter_container" style="width: 33%;"></div>'))

    $('#adv_table').children().css('display','inline-flex')
    $('#adv_table').children().css('flex-direction', 'column')
    $('#adv_table').children().css('align-items', 'center')
    $('#adv_table').children().css('height', '100%')

    $('#unit_filter_container').append($('<div style="width: 100%; text-align: center; border-bottom: 1px solid rgb(0, 153, 255);"><b>Unit Filter</b></div>'))
    $('#crew_filter_container').append($('<div style="width: 100%; text-align: center; border-bottom: 1px solid rgb(0, 153, 255);"><b>Crew Filter</b></div>'))
    $('#mod_filter_container').append($('<div style="width: 100%; text-align: center; border-bottom: 1px solid rgb(0, 153, 255);"><b>Mod Filter</b></div>'))

    $('#unit_filter_container').append($('<div id="unit_filter" style="flex-grow: 1;"></div>'))
    $('#crew_filter_container').append($('<div id="crew_filter" style="flex-grow: 1;"></div>'))
    $('#mod_filter_container').append($('<div id="mod_filter" style="flex-grow: 1;"></div>'))

    $('#unit_filter_container').append($('<div style="width: 100%; display: flex; flex-direction: row; border-top: 1px solid rgb(0, 153, 255);"></div>'))
    $('#crew_filter_container').append($('<div style="width: 100%; display: flex; flex-direction: row; border-top: 1px solid rgb(0, 153, 255);"></div>'))
    $('#mod_filter_container').append($('<div style="width: 100%; display: flex; flex-direction: row; border-top: 1px solid rgb(0, 153, 255);"></div>'))
    $('#mod_filter_container').append($('<div style="width: 100%; display: flex; flex-direction: row; border-top: 1px solid rgb(0, 153, 255);"></div>'))
}

function draw_panel(){
    let panel = $('<div style="height: 240px; width: 360px; display: flex; outline: rgb(0, 153, 255) solid 1px; position: absolute; top: 60px; left: calc(50%-180px)"></div>')
    $('body').append(panel)
}

function fix_gui(){
    fix_current_layout()
    draw_advanced_table()
    draw_panel()
}

function filter_mods(whitelist){
    $('[id^="modTD"]').each(function(){
        let name = $(this).find('td.modtext').text()
        let quantity = $(this).find('font.helptextb').text()
        console.log(name, quantity)
        if (whitelist.includes(name) && quantity != '0'){
            $(this).show()
        } else {
            $(this).hide()
        }
    })
}

function filter_units(whitelist){
    $('#unitTable>tbody>tr>td').each(function(){
        let name = $(this).find('font.unittextb').text()
        console.log(name)
        if (whitelist.includes(name)){
            $(this).show()
        } else {
            $(this).hide()
        }
    })
}

function filter_crews(filter){
    //TODO
}

window.onresize = null