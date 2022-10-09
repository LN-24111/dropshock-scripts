// ==UserScript==
// @name         DS - Salvage to CSV
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       XHunter
// @updateURL    https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/salvage_to_csv/salvage_to_csv.meta.js
// @downloadURL  https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/salvage_to_csv/salvage_to_csv.js
// @match        *://command.drop-shock.com/faction_admin_salvage.php*
// @match        *://command.drop-shock.com/report.php*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==

const KEY_R = 114
const REPORT_HOTKEY = KEY_R
//Supporting class structure for logging quantity
class Player{
    constructor(name){
        this.name = name
        this.modList = new ModList()
        this.unitList = new UnitList()
    }

    appendMod(mod){
        this.modList.append(mod)
    }

    appendUnit(unit){
        this.unitList.append(unit)
    }

    toString(){
        var retVal = ''
        for (var unit of this.unitList.list){
            retVal += `${this.name},${unit.quantity},${unit.unit}\r\n`
        }

        for (var mod of this.modList.list){
            retVal += `${this.name},${mod.quantity},${mod.name}\r\n`
        }
        return retVal
    }
}

class PlayerSet{
    constructor(){
        this.list = []
    }

    _append(playerName){
        var player = new Player(playerName)
        if (this.list.some(i => i.name == player.name))
            return
        else
            this.list.push(player)
    }

    appendMod(mod, playerName){
        this._append(playerName) //insert if not exist
        var player = this.list.find(i => i.name == playerName)
        player.appendMod(mod)
    }

    appendUnit(unit, playerName){
        this._append(playerName)
        var player = this.list.find(i => i.name == playerName)
        player.appendUnit(unit)
    }

    toString(){
        var retVal = ''

        for (var player of this.list){
            retVal += player.toString()
        }
        return retVal
    }
}

class ModList{
    constructor(){
        this.list = []
    }

    append(mod){
        var entry = this.list.find(i => i.name == mod)
        if (entry != null){
            entry.quantity ++
        }
        else
            this.list.push({name: mod, quantity: 1})
    }
}

class UnitList{
    constructor(){
        this.list = []
    }

    append(unit){
        var entry = this.list.find(i => i.unit == unit)
        if (entry != null){
            entry.quantity ++
        }
        else
            this.list.push({unit: unit, quantity: 1})
    }
}

function getSalvageReport(lowerBound, upperBound, salvager, filterMode){
    var playerSet = new PlayerSet()
    var logs = $('td.datetext').parent()
    var unclaimedMods = []

    for (var log of logs){
        var turn = $(log).children('td.helptextb').text()
        var time = $(log).children('td.datetext').text().split(/[: -]/)
        time = ((time[1].includes('a') ? 0 : 12 )+ parseInt(time[0])) * 60 + parseInt(time[1]) + parseInt(time[2]) * 60 * 24 + parseInt(time[3]) * 60 * 24 * 31 + parseInt(time[4]) * 60 * 24 * 31 * 12
        var filter = filterMode == 'turn' ? turn : time
        turn = parseInt(turn)
        if (filter < lowerBound || filter > upperBound)
            continue

        var salvager_log = $(log).children('td.comtextb').text()
        if (salvager != null && salvager != salvager_log)
            continue

        var units = $(log).find('.turnP')
        if (units.length == 1){
            //There are two units image, one is if the salvager, one is of the salvaged unit. If there's just 1, it's a mod
            var mod = $(log).find('.unitDivLR>font.helptextb').text()
            if (mod != '')
                unclaimedMods.push(mod)
            continue
        }
        else {
            var player
            var notShak = true //not shak unit, buildings still count
            if ($(log).find('.unitDivLR:contains(could not salvage)').length > 0){
                notShak = false
                player = $(log).find('.unitDivLR:contains(from)').children().first().text()
            }
            else
                player = $(log).find('.unitDivLR>font.alerttextb').text()
            var unit = $(units[1]).children('img').attr('src')
            unit = unit.split('/')[2]
            var offset = unit.substr(0,2) == 'l_' ? 2 : 0
            unit = unit.substr(offset, unit.length - 4 - offset).split('_').join(' ')
            var failed = $(log).find('.unitDivLR:contains(ore)').length > 0

            if (failed == false && notShak){
                var meta = $(log).find('.unitDivLR>font.helptextb')
                if (meta.length == 3)
                    meta = `${$(meta[2]).text()},${$(meta[1]).text()}`
                else
                     meta = $(meta[1]).text()
                playerSet.appendUnit(`${unit},${meta}`, player)
            }
            for (mod of unclaimedMods){
                playerSet.appendMod(mod, player)
                unclaimedMods = []
            }
        }
    }
    let csvContent = "data:text/csv;charset=utf-8,"
    csvContent += playerSet.toString()
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${salvager}.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
}



$(document).keypress(function(event){
	var keycode = (event.keyCode ? event.keyCode : event.which)
        if (keycode == REPORT_HOTKEY){
            var newRequest = prompt("Query?")
            if (newRequest != null){
                try{
                    var mode = 'turn'
                    var params = newRequest.split(',')
                    var lowerBound = params[0]
                    var upperBound = params[1]
                    if (lowerBound.includes(':')){
                        mode = 'time'
                        var lowerTimes = lowerBound.split(':')
                        var upperTimes = upperBound.split(':')
                        lowerBound = parseInt(lowerTimes[0]) * 60 + parseInt(lowerTimes[1]) + parseInt(lowerTimes[2]) * 60 * 24 + parseInt(lowerTimes[3]) * 60 * 24 * 31 + parseInt(lowerTimes[4]) * 60 * 24 * 31 * 12
                        upperBound = parseInt(upperTimes[0]) * 60 + parseInt(upperTimes[1]) + parseInt(upperTimes[2]) * 60 * 24 + parseInt(upperTimes[3]) * 60 * 24 * 31 + parseInt(upperTimes[4]) * 60 * 24 * 31 * 12
                    }
                    else {
                        lowerBound = parseInt(lowerBound)
                        upperBound = parseInt(upperBound)
                    }
                    var player = params.length == 3 ? params[2].trim() : null
                    getSalvageReport(lowerBound,upperBound, player, mode)
                }catch(err){console.log(err)}
            }
        }
});
