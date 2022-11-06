// ==UserScript==
// @name         DS - Better Refit
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  try to take over the world!
// @author       XHunter
// @updateURL    https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/quick_mod/quick_mod.meta.js
// @downloadURL  https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/quick_mod/quick_mod.js
// @match        *://command.drop-shock.com/modify_units.php
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==

const UNSORTED =[
	4,		// Wartech Gatling Repeater
	2,		// Eagle-eye Targeting Computer
	5,		// Typhoon Supercharger
	7,		// Hailfire Missile Launcher
	8,		// Hellseeker Energy Turret
	9,		// Bit-Chipper Mining Drill
	14,		// Armadillo Reactive Armor
	15,		// Ballistic Ammo
	16,		// Missile Ammo
	18,		// Earlybird Warning System
	22,		// Evercell Capacitor
	25,		// Gemini Assault Turret
	29,		// Scatterfire Gatling Gun
	40,		// Level-head Gyro
	42,		// Evercell Recharger
	43,		// Masscap Recharger
	45,		// Backflash Recharger
	47,		// Patchwork Armor
	48,		// Derringer Cannon
	49,		// High Tension Shocks
	51,		// Maxwatt Transformer
	60,		// Distant Thunder Recharger
	64,		// Compound Optics Array
	67,		// Shield Boost Acti
	68,		// Shield Rush Acti
	70,		// Basic Repair Nanites Acti
	71,		// Repair Nanites Acti
	79,		// Natural Armor Acti
	80,		// Holoprojector
	82,		// Targeting Laser
	88,		// Wraith Light Launcher
	93,		// Carnivore Gatling Cannon
	97,		// Gladius Energy Weapon
	100,	// Bandit Shield Generator
	101,	// Bandit Armor
	102,	// Bandit Energy Turret
	103,	// Bandit Ballistic Turret
	110,	// Leech Laser
	112,	// Sanctuary Adaptor
	125,	// Command Shield Adaptor
	141,	// Hellfire Energy Turret
	142,	// Avenger Assault Cannon
	121,	// Nightshade Cloaking Device
	136,	// Revealer Anti-Cloak
]

const BALLISTIC_COMMON = [
	1,		// Deathdealer Gatling Cannon
	95,		// Reaper Assault Cannon
	96,		// Neptune Seige Cannon
	176,	// Gyrojet Long-gun
	94,		// Crusader Long-gun
	20,		// Tri-gun
	111,	// Mag-Cannon
	55,		// Superior Grade Ammunition
	57,		// High Capacity Ammunition
	37,		// Balanced Ammunition
	26,		// Explosive Ammunition
	92,		// Rapidfeed Adaptor
	175,	// Gyrojet Rounds
	173,	// EMP Ammunition
	139,	// Sabot Ammunition
	56,		// Condensed Neutron Ammunition
]

const ENERGY_COMMON = [
	19,		// Death Lance
	17,		// Burster Heavy Turret
	98,		// Punisher Assault Turret
	114,	// Vampire Cannon
	167,	// Obliteration Cannon
	31,		// Vertigo Energy Turret
	32,		// Venom Energy Turret
	23,		// Hyper-bat Capacitor
	169,	// Argus Energy Adaptor
	62,		// Kypris Prism
	63,		// Pallas Prism
	168,	// Chimera Power Converter
	85,		// Overload Capacitor
	41,		// Calypso Prism
	108,	// EMP Adaptor
	135,	// Plasma Adaptor
]

const MISSILE_COMMON = [
	90,		// Incursion Assault Launcher
	177,	// Cluster Missile Pod
	89,		// Triad Missile Launcher
	91,		// Zeus Missile System
	30,		// Onslaught Heavy Launcher
	38,		// Explosive Missiles
	53,		// Guided Warheads
	54,		// Smart Warheads
	59,		// High Capacity Missiles
	58,		// Armor Piercing Missiles
	106,	// Sabot Missiles
	172,	// EMP Missiles
	174,	// Cluster Missiles
	116,	// Energy-Web Missiles
]

const TANK_COMMON = [
	171,	// Proton Mass Generator
	0,		// Buckler Light Shield Generator
	24,		// Kite Medium Shield Generator
	13,		// Hightower Shield Generator
	140,	// Cerberus Shield System
	44,		// Hyper-bat Recharger
	61,		// Thunder Clap Recharger
	69,		// Shield Restore Acti
	34,		// Sanctuary Dampening Shield
	113,	// Sanctuary Barrier Generator
	170,	// Compressed Cobalt Plating
	10,		// Plasteel Armor
	11,		// Steelcore Armor
	12,		// Pro-max Armor
	143,	// Triage Battle Armor
	39,		// Steeltec Repair Droid
	50,		// Steeltec Repair Bot
	72,		// Advanced Repair Nanites Acti
	6,		// Porcupine Reactive Armor
	127,	// Missile Defense System I
	128,	// Missile Defense System II
	130,	// Energy Defense System I
	131,	// Energy Defense System II
	133,	// Ballistic Defense System I
	134,	// Ballistic Defense System II
]

const UTILITY_COMMON = [
	66,		// Mark of the Commander
	124,	// Powerplant Restrictors
	52,		// Hasty Construction
	129,	// Combat Analysis Module
	132,	// Combat Analysis System
	107,	// Commander's Seal
	86,		// Wartech Salvage Bot
	87,		// Wartech Salvage Droid
	21,		// Sixth Sense Warning System
	81,		// Holofield
	28,		// Sure-shot Targeting Computer
	83,		// Advanced Targeting Laser
	65,		// Advanced Optics Array
	99,		// Preserver Escape Pod
	123,	// Survivor Escape Pod
	126,	// Command Shield Generator
	122,	// Dark Shadow Cloak Generator
	137,	// Illuminator Anti-Cloak
	178,	// Tremor Sensors
	74,		// Improved Mining Platform
	75,		// Advanced Mining Platform
	78,		// Mining Surveyor Acti
]
const SPEED_COMMON = [
	36,		// Hydra Powerplant
	35,		// Sonic Powerplant
	3,		// Hellburn Overdrive
	84,		// Shield Shunt
	27,		// RoadRunner Turbine
	46,		// Aerodynamic Armor
	33,		// Facenorth Gyro
	76,		// Improved Hydraulics Acti
	77,		// Powered Hydraulics Acti
	180,	// Shadow Whisperer
]
const UNIQUE = [
	120,	// Tears of the Sha'Kahr
	104,	// Bandit's Eye
	73,		// Mobile Uplink
	138,	// Deep View Module
	105,	// Sabot Launcher
	109,	// EMP Cannon
	115,	// Rail Cannon
	117,	// Sha'Kahr Darkvengeance
	118,	// Sha'Kahr Wraithunter
	119,	// Sha'Kahr Shadowraith
]

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

var currOffset=341+121
var container = document.getElementById('container1DIV')
function makeNewModBar(mods, name=undefined){
    let header = `
    <div style="position: absolute;left: 1;top: ${currOffset};width: 18;height: 140;z-index: 4;layer-background-color: #000000;background-color: #000000;"></div>
    <div style="position: absolute;left: 0;top: ${currOffset-1};width: 20;height: 142;z-index: 3;layer-background-color: #0099ff;background-color: #0099ff;">&nbsp;</div>
    `
    let modContainer = `
    <div style="width: 1283px;position: absolute;left: 20;top: ${currOffset};height: 140;z-index: 4;background-color: #000000;overflow-x: auto;">
      <table height="100%" cellspacing="0" cellpadding="0" background="images/mod_mod_bg.gif">
        <tbody>
          <tr height="103"></tr>
        </tbody>
      </table>
    </div>
    `
    currOffset += 141
    let template = document.createElement('template')
    template.innerHTML = header.trim()
    container.appendChild(template.content.firstChild)
    container.appendChild(template.content.lastChild)
    template.innerHTML = modContainer.trim()
    let tr = template.content.firstChild.querySelector('tr')
    for (let i of mods){
        let mod = document.getElementById(`modTD${i}`)
        tr.appendChild(mod)
    }
    container.appendChild(template.content.firstChild)
}
makeNewModBar(TANK_COMMON)
makeNewModBar(BALLISTIC_COMMON)
makeNewModBar(MISSILE_COMMON)
makeNewModBar(ENERGY_COMMON)
makeNewModBar(UTILITY_COMMON)
makeNewModBar(SPEED_COMMON)
makeNewModBar(UNIQUE)
