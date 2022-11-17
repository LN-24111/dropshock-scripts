// ==UserScript==
// @name         DS - Log Damage
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       XHunter
// @updateURL    https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/log_damage/log_damage.meta.js
// @downloadURL  https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/log_damage/log_damage.js
// @match        *://command.drop-shock.com/report.php*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==

const REPORT_HOTKEY = 't'



const UNIT_REGEX = /.*?[lr]_(.*?)\.png/
const WEAPON_REGEX = /.*?weapon_(\w+)\..*/
function make_report(){
    let logs = $('tbody>tr')
    let data = "data:text/txt;charset=utf-8,"
    for (var log of logs){
        let damage_log = $(log).children("td:contains(damage)")
        if (damage_log.length > 0){
            try{
                let imgs = damage_log.find("div>img")
                let attacker = imgs[0].src
                attacker = attacker.match(UNIT_REGEX)[1]
                attacker = attacker.replaceAll('_','-')
                let weapon = imgs[1].src
                weapon = weapon.match(WEAPON_REGEX)[1]
                let target = imgs[2].src
                target = target.match(UNIT_REGEX)[1]
                target = target.replaceAll('_','-')

                let damage = damage_log.find("div>font")[2].textContent
                let range = damage_log.find("div>span")[0].textContent

                data += `${attacker},${weapon},${target},${damage},${range}\n`
            }
            catch(err){}
        }
    }
    var encodedUri = encodeURI(data);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    let report_name = prompt("Report name?")
    if (report_name == null)
        report_name = "report"
    link.setAttribute("download", `${report_name}.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
}



$(document).keypress(function(event){
    if (event.key == REPORT_HOTKEY){
        make_report()
    }
});
