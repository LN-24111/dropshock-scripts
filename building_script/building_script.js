// ==UserScript==
// @name         DS - Building Script
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  try to take over the world!
// @author       XHunter
// @updateURL    https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/building_script/building_script.meta.js
// @downloadURL  https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/building_script/building_script.js
// @match        *://command.drop-shock.com/construct.php*
// @match        *://command.drop-shock.com/index_build.html*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==

const CONFIRM_DELAY = 1200
const RETRY_DELAY = 200
const AUTO_BUILD_ON_QUEUE = true

const ACRONYMS = {
    //Mekas
    "Aegis": "Aegis Shield Meka",
    "BL": "Bright Lance Meka",
    "BA": "Battle Axe Meka",
    "BAII": "Battle Axe Meka II",
    "BAIII": "Battle Axe Meka III",
    "Clay": "Claymore Meka",
    "Clops": "Cyclops Meka",
    "DIM": "Dark Inquisitor Meka",
    "DH": "Darkhunter Stealthtank",
    "DWA": "Death Whisper Artillery",
    "DSM": "Deep Sensor Meka",
    "Dragoon": "Dragoon Meka",
    "DN": "Dreadnaught Meka",
    "Gat": "Gatlinger Meka",
    "HB": "Hellbore Meka",
    "Hellbore": "Hellbore Meka",
    "Failbores": "Hellbore Meka",                       //:madlol: ravnub :D
    "Hermes": "Hermes Meka",
    "Hermit": "Hermit Salvager",
    "HMM": "Hiveminder Meka",
    "Kat": "Katana Meka",
    "Leo": "Leopard Assault Tank",
    "LF": "Lightfoot Meka",
    "LE": "Lone-eye Probe",
    "LR": "Long-Rifle Meka",
    "Necro": "Necromancer Meka",
    "NS": "Nightstalker Meka",
    "Paladin": "Paladin Meka",
    "PS": "Palestar Meka",
    "PGM": "Phase Guardian Meka",
    "SSM": "Scout Sniper Meka",
    "SYM": "Scrapyard Meka",
    "Sentry": "Sentry Meka",
    "SAM": "Shadow Assassin Meka",
    "SE": "Shadow-eyes Probe",
    "SD": "Silentdeath Meka",
    "SJM": "Static Jammer Meka",
    "SN": "Super Nova Meka",
    "Tortoise": "Tortoise Scout Vehicle",
    "Wyv": "Wyvern Missile Platform",
    //Mods
    "AoA": "Advanced Optics Array",
    "ATL": "Advanced Targeting Laser",
    "BDII": "Ballistic Defense System II",
    "Burster": "Burster Heavy Turret",
    "Calypso": "Calypso Prism",
    "Carni": "Carnivore Gatling Cannon",
    "Cerb": "Cerberus Shield System",
    "Cluster Pod": "Cluster Missile Pod",
    "Cluster": "Cluster Missiles",
    "CAM": "Combat Analysis Module",
    "CAS": "Combat Analysis System",
    "CSG": "Command Shield Generator",
    "CNR": "Condensed Neutron Rounds",
    "Crusader": "Crusader Long-gun",
    "DL": "Death Lance",
    "DD": "Deathdealer Gatling Cannon",
    "EDII": "Energy Defense System II",
    "Exp Ammo": "Explosive Ammunition",
    "Exp Missiles": "Explosive Missiles",
    "FN": "Facenorth Gyro",
    "Gyro": "Gyrojet Rounds",
    "Hellburn": "Hellburn Overdrive",
    "HT": "Hightower Shield Generator",
    "Hyper": "Hyper-bat Capacitor",
    "IHA": "Improved Hydraulics Acti",
    "Inc": "Incursion Assault Launcher",
    "Incursion": "Incursion Assault Launcher",
    "Kite": "Kite Medium Shield Generator",
    "Mag": "Mag-Cannon",
    "MC": "Masscap Recharger",
    "MDII": "Missile Defense System II",
    "MotC": "Mark of the Commander",
    "Nep":"Neptune Seige Cannon",
    "Oblit": "Obliteration Cannon",
    "Onslaught": "Onslaught Heavy Launcher",
    "OC": "Overload Capacitor",
    "Plasma": "Plasma Adaptor",
    "PHA": "Powered Hydraulics Acti",
    "Pro-max": "Pro-max Armor",
    "Proton": "Proton Mass Generator",
    "Puni": "Punisher Assault Turret",
    "Punisher": "Punisher Assault Turret",
    "Reaper": "Reaper Assault Cannon",
    "SBG": "Sanctuary Barrier Generator",
    "SW": "Shadow Whisperer",
    "6th": "Sixth Sense Warning System",
    "Sonic": "Sonic Powerplant",
    "SGA": "Superior Grade Ammunition",
    "TC": "Thunder Clap Recharger",
    "Triad": "Triad Missile Launcher",
    "Vamp": "Vampire Cannon",
    "Zeus": "Zeus Missile System"
}
const MECH = {
	'Aegis Shield Meka': {'id': 106, 'requires': ['EMP Adaptor', 'Chimera Power Converter', 'Argus Energy Adaptor']},
	'Akimo Meka': {'id': 33, 'requires': ['Hellseeker Energy Turret']},
	'Ares Meka': {'id': 44, 'requires': ['Kite Medium Shield Generator', 'Evercell Recharger', 'Sonic Powerplant', 'Aerodynamic Armor']},
	'Asp Assault Hovertank': {'id': 54, 'requires': ['Death Lance', 'Masscap Recharger', 'Thunder Clap Recharger']},
	'Ballista Meka': {'id': 29, 'requires': ['Onslaught Heavy Launcher', 'Hailfire Missile Launcher', 'Missile Ammo', 'Eagle-eye Targeting Computer']},
	'Battle Axe Meka': {'id': 27, 'requires': ['Porcupine Reactive Armor', 'Wartech Gatling Repeater', 'Steelcore Armor', 'Steeltec Repair Bot']},
	'Battle Axe Meka II': {'id': 72, 'requires': ['Porcupine Reactive Armor', 'Advanced Repair Nanites Acti', 'Crusader Long-gun']},
	'Battle Axe Meka III': {'id': 111, 'requires': ['Ballistic Defense System II', 'Missile Defense System II', 'Energy Defense System II', 'Deathdealer Gatling Cannon', 'Gyrojet Rounds']},
	'Battle Axe Meka X': {'id': 79, 'requires': ['Porcupine Reactive Armor', 'Advanced Repair Nanites Acti', 'Crusader Long-gun', 'Mag-Cannon', 'Sanctuary Barrier Generator']},
	'Beast Meka': {'id': 31, 'requires': ['Hasty Construction', 'Hellseeker Energy Turret', 'Derringer Cannon']},
	'Behemoth Heavy Tank': {'id': 2, 'requires': ['Scatterfire Gatling Gun']},
	'Bobcat Missile Tank': {'id': 63, 'requires': ['Wraith Light Launcher']},
	'Bowman Meka': {'id': 36, 'requires': ['Hailfire Missile Launcher']},
	'Brawler Meka': {'id': 71, 'requires': ['Overload Capacitor', 'Improved Hydraulics Acti']},
	'Brightlance Meka': {'id': 46, 'requires': ['Burster Heavy Turret', 'Hellburn Overdrive', 'Level-head Gyro', 'Backflash Recharger']},
	'Calico Utility Vehicle': {'id': 40, 'requires': ['Bit-Chipper Mining Drill']},
	'Claymore Meka': {'id': 67, 'requires': ['Incursion Assault Launcher', 'Death Lance', 'Facenorth Gyro']},
	'Cobra Attack Hovertank': {'id': 43, 'requires': []},
	'Coluber Utility Vehicle': {'id': 41, 'requires': []},
	'Copperhead Hovertank': {'id': 24, 'requires': []},
	'Covert Meka': {'id': 30, 'requires': ['Earlybird Warning System', 'Patchwork Armor']},
	'Cyclops Meka': {'id': 66, 'requires': ['Overload Capacitor', 'Pallas Prism', 'Shield Rush Acti', 'Thunder Clap Recharger']},
	'Dark Inquisitor Meka': {'id': 100, 'requires': ['Armor Piercing Missiles', 'Incursion Assault Launcher', 'Sabot Launcher', 'Cerberus Shield System', 'Deep View Module', 'Illuminator Anti-Cloak']},
	'Darkhunter Stealthtank': {'id': 93, 'requires': ['Plasma Adaptor', 'Dark Shadow Cloak Generator']},
	'Death Whisper Artillery': {'id': 56, 'requires': ['Neptune Seige Cannon', 'Advanced Optics Array', 'Advanced Targeting Laser']},
	'Deep Sensor Meka': {'id': 96, 'requires': ['Deep View Module', 'Sixth Sense Warning System', 'Zeus Missile System', 'Energy Defense System II', 'Illuminator Anti-Cloak']},
	'Deterus Drone': {'id': 108, 'requires': ['Compressed Cobalt Plating', 'Proton Mass Generator']},
	'Diamondback Ore Transporter': {'id': 86, 'requires': ['Improved Mining Platform', 'Wartech Salvage Bot']},
	'Dragoon Meka': {'id': 105, 'requires': ['Gyrojet Long-gun', 'Rail Cannon', 'Mag-Cannon', 'Sabot Ammunition']},
	'Dreadnaught Meka': {'id': 75, 'requires': ['Holofield', 'Incursion Assault Launcher', 'Death Lance', 'Reaper Assault Cannon', 'Sixth Sense Warning System', 'Porcupine Reactive Armor']},
	'Farseer Meka': {'id': 99, 'requires': ['Deep View Module', 'Combat Analysis System']},
	'Ferdelance Hovertank': {'id': 50, 'requires': []},
	'Fiddler Salvager': {'id': 68, 'requires': ['Wartech Salvage Bot']},
	'Firestorm Meka': {'id': 64, 'requires': ['High Capacity Missiles', 'Triad Missile Launcher']},
	'Gatlinger Meka': {'id': 52, 'requires': ['Reaper Assault Cannon', 'High Capacity Ammunition', 'Pro-max Armor', 'Deathdealer Gatling Cannon']},
	'Gladiator Meka': {'id': 35, 'requires': ['Typhoon Supercharger', 'Plasteel Armor']},
	'Ground-Hog Light Scout': {'id': 8, 'requires': []},
	'Grunt Meka': {'id': 38, 'requires': ['Maxwatt Transformer', 'Hellseeker Energy Turret']},
	'Gunslinger Meka': {'id': 21, 'requires': ['Wartech Gatling Repeater', 'Plasteel Armor']},
	'Hawkeye Spotter': {'id': 74, 'requires': ['Earlybird Warning System']},
	'Hedgehog Utility Vehicle': {'id': 7, 'requires': []},
	'Hellbore Meka': {'id': 37, 'requires': ['Deathdealer Gatling Cannon', 'Burster Heavy Turret', 'Backflash Recharger', 'Sanctuary Dampening Shield']},
	'Hermes Meka': {'id': 49, 'requires': ['Bit-Chipper Mining Drill', 'Wartech Gatling Repeater']},
	'Hermit Salvager': {'id': 70, 'requires': ['Wartech Salvage Droid', 'Advanced Repair Nanites Acti']},
	'Hiveminder Meka': {'id': 102, 'requires': ['EMP Cannon', 'Obliteration Cannon', 'Tremor Sensors', 'Plasma Adaptor', 'Energy Defense System II', 'Chimera Power Converter']},
	'Howitzer Meka': {'id': 32, 'requires': ['Deathdealer Gatling Cannon']},
	'Howitzer Meka II': {'id': 57, 'requires': ['Carnivore Gatling Cannon']},
	'Indirus Drone': {'id': 109, 'requires': ['Energy Defense System I', 'Missile Defense System I', 'Ballistic Defense System I']},
	'Jabberwock Meka': {'id': 48, 'requires': ['Evercell Recharger', 'Hasty Construction', 'Maxwatt Transformer']},
	'Jaguar Medium Tank': {'id': 1, 'requires': []},
	'Juggernaught Meka': {'id': 28, 'requires': ['Sonic Powerplant', 'Steelcore Armor', 'Onslaught Heavy Launcher', 'Kite Medium Shield Generator', 'Wartech Gatling Repeater']},
	'Juggler Meka': {'id': 65, 'requires': ['Carnivore Gatling Cannon']},
	'Katana Meka': {'id': 17, 'requires': ['Hightower Shield Generator', 'Sonic Powerplant', 'Hyper-bat Recharger']},
	'Killfox Meka': {'id': 16, 'requires': ['Scatterfire Gatling Gun', 'Balanced Ammunition']},
	'Lasher Assault Vehicle': {'id': 10, 'requires': []},
	'Leopard Assault Tank': {'id': 61, 'requires': ['Crusader Long-gun', 'Hellburn Overdrive', 'Ballistic Defense System I']},
	'Lightfoot Meka': {'id': 60, 'requires': ['Neptune Seige Cannon', 'Facenorth Gyro']},
	'Lobber Assault Vehicle': {'id': 9, 'requires': []},
	'Loggerhead Meka': {'id': 87, 'requires': ['Advanced Mining Platform', 'Wartech Salvage Droid']},
	'Lone-eye Probe': {'id': 53, 'requires': ['Holoprojector']},
	'Long-Rifle Meka': {'id': 12, 'requires': ['Balanced Ammunition']},
	'Mammoth Combat Support Unit': {'id': 58, 'requires': ['Mobile Uplink', 'Pallas Prism', 'Repair Nanites Acti', 'High Capacity Ammunition', 'High Capacity Missiles']},
	'Mercat Scout Tank': {'id': 39, 'requires': []},
	'Mini-gun Meka': {'id': 22, 'requires': ['Derringer Cannon']},
	'Mite Meka': {'id': 55, 'requires': ['Shield Shunt']},
	'Necromancer Meka': {'id': 83, 'requires': ['Steeltec Repair Droid', 'Wartech Salvage Droid', 'Mobile Uplink', 'Vampire Cannon', 'EMP Cannon']},
	'Nightstalker Meka': {'id': 81, 'requires': ['Sanctuary Barrier Generator', 'Sixth Sense Warning System', 'Condensed Neutron Rounds', 'Rapidfeed Adaptor', 'Mag-Cannon']},
	'Olio Drone': {'id': 107, 'requires': ['Proton Mass Generator', 'Leech Laser']},
	'Paladin Meka': {'id': 26, 'requires': ['Wartech Gatling Repeater', 'Hailfire Missile Launcher', 'Vertigo Energy Turret']},
	'Palestar Meka': {'id': 82, 'requires': ['Incursion Assault Launcher', 'Shield Restore Acti', 'Advanced Repair Nanites Acti', 'Rail Cannon', 'Sabot Launcher']},
	'Panther Light Tank': {'id': 0, 'requires': []},
	'Phase Guardian Meka': {'id': 98, 'requires': ['Missile Defense System II', 'Energy Defense System II', 'Ballistic Defense System II', 'Sanctuary Dampening Shield', 'Zeus Missile System', 'Advanced Repair Nanites Acti']},
	'Pirata Meka': {'id': 45, 'requires': ['Kite Medium Shield Generator', 'Evercell Recharger', 'Sonic Powerplant', 'Patchwork Armor']},
	'Pitviper Hovertank': {'id': 25, 'requires': []},
	'Porcupine Assault Vehicle': {'id': 62, 'requires': ['Powered Hydraulics Acti', 'Triad Missile Launcher']},
	'Prowler': {'id': 73, 'requires': []},
	'Puma Light Scout': {'id': 6, 'requires': []},
	'Python Heavy Hovertank': {'id': 5, 'requires': ['Hellseeker Energy Turret']},
	'Sai Meka': {'id': 20, 'requires': ['Buckler Light Shield Generator']},
	'Savage Marauder Meka': {'id': 110, 'requires': ['Proton Mass Generator', 'Powerplant Restrictors']},
	'Scout Sniper Meka': {'id': 97, 'requires': ['Plasma Adaptor', 'Sixth Sense Warning System', 'Sabot Ammunition', 'Holofield', 'Neptune Seige Cannon', 'Combat Analysis System']},
	'Scrapyard Meka': {'id': 103, 'requires': ['Rail Cannon', 'Gyrojet Long-gun', 'Combat Analysis System', 'Cerberus Shield System', 'Ballistic Defense System II', 'Mag-Cannon']},
	'Sentry Meka': {'id': 13, 'requires': ['Eagle-eye Targeting Computer', 'Level-head Gyro', 'Balanced Ammunition', 'Derringer Cannon']},
	'Shadow Assassin Meka': {'id': 95, 'requires': ['Ballistic Defense System II', 'Dark Shadow Cloak Generator', 'EMP Cannon', 'Cerberus Shield System', 'Command Shield Generator']},
	'Shadow-eyes Probe': {'id': 92, 'requires': ['Nightshade Cloaking Device']},
	'Silentdeath Meka': {'id': 94, 'requires': ['Death Lance', 'Combat Analysis System', 'Dark Shadow Cloak Generator']},
	'Slider Ore Transporter': {'id': 85, 'requires': ['Improved Mining Platform', 'Wartech Salvage Bot']},
	'Snapper Ore Transporter': {'id': 84, 'requires': ['Improved Mining Platform', 'Wartech Salvage Bot']},
	'Spellbreaker Meka': {'id': 80, 'requires': ['Death Lance', 'Holofield', 'Shield Restore Acti', 'EMP Adaptor', 'Sanctuary Adaptor']},
	'Spider Salvager': {'id': 69, 'requires': ['Wartech Salvage Droid']},
	'Static Jammer Meka': {'id': 101, 'requires': ['Survivor Reinforced Cockpit', 'Command Shield Generator', 'Cerberus Shield System', 'Tremor Sensors', 'Chimera Power Converter', 'Argus Energy Adaptor']},
	'Striker Assault Vehicle': {'id': 3, 'requires': []},
	'Sunburst Meka': {'id': 59, 'requires': ['Vertigo Energy Turret', 'Compound Optics Array']},
	'Super Nova Meka': {'id': 14, 'requires': ['Kite Medium Shield Generator', 'Burster Heavy Turret', 'Maxwatt Transformer', 'Masscap Recharger']},
	'Takagi Meka': {'id': 23, 'requires': ['Hailfire Missile Launcher', 'Explosive Missiles']},
	'Tiger Attack Tank': {'id': 42, 'requires': []},
	'Titan Meka': {'id': 47, 'requires': ['Evercell Recharger', 'Hasty Construction', 'Patchwork Armor']},
	'Tornado Meka': {'id': 34, 'requires': ['Vertigo Energy Turret']},
	'Tortoise Scout Vehicle': {'id': 11, 'requires': ['High Tension Shocks']},
	'Viper Hovertank': {'id': 4, 'requires': []},
	'Whirlwind Meka': {'id': 19, 'requires': ['Hailfire Missile Launcher', 'Missile Ammo']},
	'Witman Meka': {'id': 18, 'requires': ['Wartech Gatling Repeater', 'Hailfire Missile Launcher', 'Hellseeker Energy Turret']},
	'Wolfhound Meka': {'id': 51, 'requires': ['Hellseeker Energy Turret', 'Aerodynamic Armor']},
	'Wolverine Meka': {'id': 15, 'requires': ['Venom Energy Turret', 'Aerodynamic Armor']},
	'Wyvern Missile Platform': {'id': 104, 'requires': ['Cluster Missile Pod', 'Sabot Launcher', 'Energy-Web Missiles', 'Sanctuary Barrier Generator']},
}
const ID2MECH = {
    0: 'Panther Light Tank',
    1: 'Jaguar Medium Tank',
    2: 'Behemoth Heavy Tank',
    3: 'Striker Assault Vehicle',
    4: 'Viper Hovertank',
    5: 'Python Heavy Hovertank',
    6: 'Puma Light Scout',
    7: 'Hedgehog Utility Vehicle',
    8: 'Ground-Hog Light Scout',
    9: 'Lobber Assault Vehicle',
    10: 'Lasher Assault Vehicle',
    11: 'Tortoise Scout Vehicle',
    12: 'Long-Rifle Meka',
    13: 'Sentry Meka',
    14: 'Super Nova Meka',
    15: 'Wolverine Meka',
    16: 'Killfox Meka',
    17: 'Katana Meka',
    18: 'Witman Meka',
    19: 'Whirlwind Meka',
    20: 'Sai Meka',
    21: 'Gunslinger Meka',
    22: 'Mini-gun Meka',
    23: 'Takagi Meka',
    24: 'Copperhead Hovertank',
    25: 'Pitviper Hovertank',
    26: 'Paladin Meka',
    27: 'Battle Axe Meka',
    28: 'Juggernaught Meka',
    29: 'Ballista Meka',
    30: 'Covert Meka',
    31: 'Beast Meka',
    32: 'Howitzer Meka',
    33: 'Akimo Meka',
    34: 'Tornado Meka',
    35: 'Gladiator Meka',
    36: 'Bowman Meka',
    37: 'Hellbore Meka',
    38: 'Grunt Meka',
    39: 'Mercat Scout Tank',
    40: 'Calico Utility Vehicle',
    41: 'Coluber Utility Vehicle',
    42: 'Tiger Attack Tank',
    43: 'Cobra Attack Hovertank',
    44: 'Ares Meka',
    45: 'Pirata Meka',
    46: 'Brightlance Meka',
    47: 'Titan Meka',
    48: 'Jabberwock Meka',
    49: 'Hermes Meka',
    50: 'Ferdelance Hovertank',
    51: 'Wolfhound Meka',
    52: 'Gatlinger Meka',
    53: 'Lone-eye Probe',
    54: 'Asp Assault Hovertank',
    55: 'Mite Meka',
    56: 'Death Whisper Artillery',
    57: 'Howitzer Meka II',
    58: 'Mammoth Combat Support Unit',
    59: 'Sunburst Meka',
    60: 'Lightfoot Meka',
    61: 'Leopard Assault Tank',
    62: 'Porcupine Assault Vehicle',
    63: 'Bobcat Missile Tank',
    64: 'Firestorm Meka',
    65: 'Juggler Meka',
    66: 'Cyclops Meka',
    67: 'Claymore Meka',
    68: 'Fiddler Salvager',
    69: 'Spider Salvager',
    70: 'Hermit Salvager',
    71: 'Brawler Meka',
    72: 'Battle Axe Meka II',
    73: 'Prowler',
    74: 'Hawkeye Spotter',
    75: 'Dreadnaught Meka',
    79: 'Battle Axe Meka X',
    80: 'Spellbreaker Meka',
    81: 'Nightstalker Meka',
    82: 'Palestar Meka',
    83: 'Necromancer Meka',
    84: 'Snapper Ore Transporter',
    85: 'Slider Ore Transporter',
    86: 'Diamondback Ore Transporter',
    87: 'Loggerhead Meka',
    92: 'Shadow-eyes Probe',
    93: 'Darkhunter Stealthtank',
    94: 'Silentdeath Meka',
    95: 'Shadow Assassin Meka',
    96: 'Deep Sensor Meka',
    97: 'Scout Sniper Meka',
    98: 'Phase Guardian Meka',
    99: 'Farseer Meka',
    100: 'Dark Inquisitor Meka',
    101: 'Static Jammer Meka',
    102: 'Hiveminder Meka',
    103: 'Scrapyard Meka',
    104: 'Wyvern Missile Platform',
    105: 'Dragoon Meka',
    106: 'Aegis Shield Meka',
    107: 'Olio Drone',
    108: 'Deterus Drone',
    109: 'Indirus Drone',
    110: 'Savage Marauder Meka',
    111: 'Battle Axe Meka III',
}
const MOD = {
	'Advanced Mining Platform': {'id': 75, 'requires': ['Mining Surveyor Acti', 'Improved Mining Platform']},
	'Advanced Optics Array': {'id': 65, 'requires': ['Compound Optics Array']},
	'Advanced Repair Nanites Acti': {'id': 72, 'requires': ['Repair Nanites Acti', 'Natural Armor Acti']},
	'Advanced Targeting Laser': {'id': 83, 'requires': ['Targeting Laser']},
	'Aerodynamic Armor': {'id': 46, 'requires': []},
	'Argus Energy Adaptor': {'id': 169, 'requires': ['Compressed Cobalt Plating', 'Dark Shadow Cloak Generator']},
	'Armadillo Reactive Armor': {'id': 14, 'requires': []},
	'Armor Piercing Missiles': {'id': 58, 'requires': ['Smart Warheads', 'High Capacity Missiles']},
	'Backflash Recharger': {'id': 45, 'requires': []},
	'Balanced Ammunition': {'id': 37, 'requires': ['Ballistic Ammo']},
	'Ballistic Ammo': {'id': 15, 'requires': []},
	'Ballistic Defense System I': {'id': 133, 'requires': []},
	'Ballistic Defense System II': {'id': 134, 'requires': ['Ballistic Defense System I']},
	'Basic Repair Nanites Acti': {'id': 70, 'requires': []},
	'Bit-Chipper Mining Drill': {'id': 9, 'requires': []},
	'Buckler Light Shield Generator': {'id': 0, 'requires': []},
	'Burster Heavy Turret': {'id': 17, 'requires': ['Vertigo Energy Turret', 'Venom Energy Turret']},
	'Calypso Prism': {'id': 41, 'requires': ['Evercell Capacitor']},
	'Carnivore Gatling Cannon': {'id': 93, 'requires': ['Scatterfire Gatling Gun', 'Wartech Gatling Repeater']},
	'Cerberus Shield System': {'id': 140, 'requires': ['Kite Medium Shield Generator', 'Masscap Recharger', 'Sonic Powerplant', 'Eagle-eye Targeting Computer']},
	'Chimera Power Converter': {'id': 168, 'requires': ['Proton Mass Generator', 'Illuminator Anti-Cloak']},
	'Cluster Missile Pod': {'id': 177, 'requires': ['Cluster Missiles', 'Missile Defense System I', 'Compressed Cobalt Plating']},
	'Cluster Missiles': {'id': 174, 'requires': ['Armor Piercing Missiles', 'Missile Defense System I']},
	'Combat Analysis Module': {'id': 129, 'requires': []},
	'Combat Analysis System': {'id': 132, 'requires': ['Combat Analysis Module']},
	'Command Shield Adaptor': {'id': 125, 'requires': []},
	'Command Shield Generator': {'id': 126, 'requires': ['Command Shield Adaptor']},
	'Compound Optics Array': {'id': 64, 'requires': []},
	'Compressed Cobalt Plating': {'id': 170, 'requires': ['Ballistic Defense System I']},
	'Condensed Neutron Rounds': {'id': 56, 'requires': ['High Capacity Ammunition', 'Superior Grade Ammunition']},
	'Crusader Long-gun': {'id': 94, 'requires': ['Targeting Laser', 'Carnivore Gatling Cannon']},
	'Dark Shadow Cloak Generator': {'id': 122, 'requires': ['Nightshade Cloaking Device']},
	'Death Lance': {'id': 19, 'requires': ['Burster Heavy Turret']},
	'Deathdealer Gatling Cannon': {'id': 1, 'requires': ['Wartech Gatling Repeater', 'Scatterfire Gatling Gun']},
	'Deep View Module': {'id': 138, 'requires': ['Targeting Laser', 'Compound Optics Array']},
	'Derringer Cannon': {'id': 48, 'requires': []},
	'Distant Thunder Recharger': {'id': 60, 'requires': []},
	'EMP Adaptor': {'id': 108, 'requires': ['Thunder Clap Recharger', 'Pallas Prism']},
	'EMP Ammunition': {'id': 173, 'requires': ['Sabot Ammunition', 'EMP Adaptor']},
	'EMP Missiles': {'id': 172, 'requires': ['Energy-Web Missiles', 'Proton Mass Generator']},
	'EMP Cannon': {'id': 109, 'requires': ['EMP Adaptor', 'Overload Capacitor', 'Pallas Prism']},
	'Eagle-eye Targeting Computer': {'id': 2, 'requires': []},
	'Earlybird Warning System': {'id': 18, 'requires': []},
	'Energy Defense System I': {'id': 130, 'requires': []},
	'Energy Defense System II': {'id': 131, 'requires': ['Energy Defense System I']},
	'Energy-Web Missiles': {'id': 116, 'requires': ['EMP Adaptor', 'Guided Warheads', 'High Capacity Missiles']},
	'Evercell Capacitor': {'id': 22, 'requires': []},
	'Evercell Recharger': {'id': 42, 'requires': []},
	'Explosive Ammunition': {'id': 26, 'requires': ['Ballistic Ammo']},
	'Explosive Missiles': {'id': 38, 'requires': ['Missile Ammo']},
	'Facenorth Gyro': {'id': 33, 'requires': ['Level-head Gyro']},
	'Gemini Assault Turret': {'id': 25, 'requires': ['Scatterfire Gatling Gun']},
	'Gladius Energy Weapon': {'id': 97, 'requires': []},
	'Guided Warheads': {'id': 53, 'requires': []},
	'Gyrojet Long-gun': {'id': 176, 'requires': ['Gyrojet Rounds', 'Chimera Power Converter']},
	'Gyrojet Rounds': {'id': 175, 'requires': ['Superior Grade Ammunition', 'Combat Analysis System']},
	'Hailfire Missile Launcher': {'id': 7, 'requires': []},
	'Hasty Construction': {'id': 52, 'requires': []},
	'Hellburn Overdrive': {'id': 3, 'requires': ['Typhoon Supercharger']},
	'Hellseeker Energy Turret': {'id': 8, 'requires': []},
	'High Capacity Ammunition': {'id': 57, 'requires': ['Ballistic Ammo']},
	'High Capacity Missiles': {'id': 59, 'requires': ['Missile Ammo']},
	'High Tension Shocks': {'id': 49, 'requires': []},
	'Hightower Shield Generator': {'id': 13, 'requires': ['Kite Medium Shield Generator']},
	'Holofield': {'id': 81, 'requires': ['Holoprojector']},
	'Holoprojector': {'id': 80, 'requires': []},
	'Hydra Powerplant': {'id': 36, 'requires': ['Sonic Powerplant']},
	'Hyper-bat Capacitor': {'id': 23, 'requires': ['Evercell Capacitor']},
	'Hyper-bat Recharger': {'id': 44, 'requires': ['Backflash Recharger']},
	'Illuminator Anti-Cloak': {'id': 137, 'requires': ['Revealer Anti-Cloak']},
	'Improved Hydraulics Acti': {'id': 76, 'requires': []},
	'Improved Mining Platform': {'id': 74, 'requires': []},
	'Incursion Assault Launcher': {'id': 90, 'requires': ['Onslaught Heavy Launcher', 'Triad Missile Launcher']},
	'Kite Medium Shield Generator': {'id': 24, 'requires': ['Buckler Light Shield Generator']},
	'Kypris Prism': {'id': 62, 'requires': []},
	'Leech Laser': {'id': 110, 'requires': ['Hellseeker Energy Turret', 'Evercell Capacitor', 'Kypris Prism']},
	'Level-head Gyro': {'id': 40, 'requires': []},
	'Mag-Cannon': {'id': 111, 'requires': ['Leech Laser', 'Crusader Long-gun']},
	'Mark of the Commander': {'id': 66, 'requires': []},
	'Masscap Recharger': {'id': 43, 'requires': ['Evercell Recharger']},
	'Maxwatt Transformer': {'id': 51, 'requires': []},
	'Mining Surveyor Acti': {'id': 78, 'requires': []},
	'Missile Ammo': {'id': 16, 'requires': []},
	'Missile Defense System I': {'id': 127, 'requires': []},
	'Missile Defense System II': {'id': 128, 'requires': ['Missile Defense System I']},
	'Mobile Uplink': {'id': 73, 'requires': ['Wartech Salvage Droid', 'Thunder Clap Recharger']},
	'Natural Armor Acti': {'id': 79, 'requires': ['Improved Mining Platform', 'Shield Boost Acti']},
	'Neptune Seige Cannon': {'id': 96, 'requires': ['Crusader Long-gun', 'Superior Grade Ammunition', 'Holofield']},
	'Nightshade Cloaking Device': {'id': 121, 'requires': []},
	'Obliteration Cannon': {'id': 167, 'requires': ['Vampire Cannon', 'EMP Cannon', 'Argus Energy Adaptor']},
	'Onslaught Heavy Launcher': {'id': 30, 'requires': ['Hailfire Missile Launcher']},
	'Overload Capacitor': {'id': 85, 'requires': ['Shield Shunt']},
	'Pallas Prism': {'id': 63, 'requires': ['Kypris Prism']},
	'Patchwork Armor': {'id': 47, 'requires': []},
	'Plasma Adaptor': {'id': 135, 'requires': ['Pallas Prism', 'Advanced Targeting Laser']},
	'Plasteel Armor': {'id': 10, 'requires': []},
	'Porcupine Reactive Armor': {'id': 6, 'requires': ['Armadillo Reactive Armor']},
	'Powered Hydraulics Acti': {'id': 77, 'requires': ['Improved Hydraulics Acti']},
	'Powerplant Restrictors': {'id': 124, 'requires': ['Typhoon Supercharger']},
	'Preserver Escape Pod': {'id': 99, 'requires': ['Sixth Sense Warning System', 'Overload Capacitor', 'Advanced Optics Array']},
	'Pro-max Armor': {'id': 12, 'requires': ['Steelcore Armor']},
	'Proton Mass Generator': {'id': 171, 'requires': ['Energy Defense System I']},
	'Punisher Assault Turret': {'id': 98, 'requires': ['Venom Energy Turret', 'Vertigo Energy Turret', 'Carnivore Gatling Cannon']},
	'Rail Cannon': {'id': 115, 'requires': ['Vampire Cannon', 'Hailfire Missile Launcher', 'Energy-Web Missiles']},
	'Rapidfeed Adaptor': {'id': 92, 'requires': ['High Capacity Ammunition', 'Superior Grade Ammunition']},
	'Reaper Assault Cannon': {'id': 95, 'requires': ['Advanced Targeting Laser', 'Crusader Long-gun', 'High Capacity Ammunition']},
	'Repair Nanites Acti': {'id': 71, 'requires': ['Basic Repair Nanites Acti']},
	'Revealer Anti-Cloak': {'id': 136, 'requires': []},
	'RoadRunner Turbine': {'id': 27, 'requires': ['Sonic Powerplant', 'Maxwatt Transformer']},
	'Sabot Ammunition': {'id': 139, 'requires': ['Superior Grade Ammunition', 'High Capacity Ammunition']},
	'Sabot Launcher': {'id': 105, 'requires': ['Incursion Assault Launcher', 'Sabot Missiles', 'Smart Warheads']},
	'Sabot Missiles': {'id': 106, 'requires': ['Armor Piercing Missiles', 'Smart Warheads']},
	'Sanctuary Adaptor': {'id': 112, 'requires': ['Distant Thunder Recharger', 'Shield Boost Acti']},
	'Sanctuary Barrier Generator': {'id': 113, 'requires': ['Thunder Clap Recharger', 'Shield Rush Acti', 'Sanctuary Adaptor']},
	'Sanctuary Dampening Shield': {'id': 34, 'requires': ['Eagle-eye Targeting Computer', 'Sonic Powerplant']},
	'Scatterfire Gatling Gun': {'id': 29, 'requires': []},
	'Shadow Whisperer': {'id': 180, 'requires': ['Dark Shadow Cloak Generator']},
	'Shield Boost Acti': {'id': 67, 'requires': []},
	'Shield Restore Acti': {'id': 69, 'requires': ['Shield Rush Acti', 'Pallas Prism', 'Wartech Salvage Droid']},
	'Shield Rush Acti': {'id': 68, 'requires': ['Shield Boost Acti']},
	'Shield Shunt': {'id': 84, 'requires': []},
	'Sixth Sense Warning System': {'id': 21, 'requires': ['Earlybird Warning System']},
	'Smart Warheads': {'id': 54, 'requires': ['Guided Warheads', 'Missile Ammo']},
	'Sonic Powerplant': {'id': 35, 'requires': ['Typhoon Supercharger']},
	'Steelcore Armor': {'id': 11, 'requires': ['Plasteel Armor']},
	'Steeltec Repair Bot': {'id': 50, 'requires': []},
	'Steeltec Repair Droid': {'id': 39, 'requires': ['Steeltec Repair Bot']},
	'Superior Grade Ammunition': {'id': 55, 'requires': ['Balanced Ammunition', 'Ballistic Ammo']},
	'Sure-shot Targeting Computer': {'id': 28, 'requires': ['Eagle-eye Targeting Computer']},
	'Survivor Reinforced Cockpit': {'id': 123, 'requires': ['Combat Analysis Module', 'Nightshade Cloaking Device']},
	'Targeting Laser': {'id': 82, 'requires': []},
	'Thunder Clap Recharger': {'id': 61, 'requires': ['Distant Thunder Recharger']},
	'Tremor Sensors': {'id': 178, 'requires': ['Chimera Power Converter', 'Argus Energy Adaptor', 'Deep View Module', 'Illuminator Anti-Cloak']},
	'Tri-gun': {'id': 20, 'requires': ['Wartech Gatling Repeater']},
	'Triad Missile Launcher': {'id': 89, 'requires': ['Hailfire Missile Launcher', 'Wraith Light Launcher']},
	'Typhoon Supercharger': {'id': 5, 'requires': []},
	'Vampire Cannon': {'id': 114, 'requires': ['Leech Laser', 'Mag-Cannon']},
	'Venom Energy Turret': {'id': 32, 'requires': ['Hellseeker Energy Turret']},
	'Vertigo Energy Turret': {'id': 31, 'requires': ['Hellseeker Energy Turret']},
	'Wartech Gatling Repeater': {'id': 4, 'requires': []},
	'Wartech Salvage Bot': {'id': 86, 'requires': []},
	'Wartech Salvage Droid': {'id': 87, 'requires': ['Wartech Salvage Bot']},
	'Wraith Light Launcher': {'id': 88, 'requires': []},
	'Zeus Missile System': {'id': 91, 'requires': ['Incursion Assault Launcher', 'Smart Warheads', 'Advanced Optics Array']},
}
const ID2MOD = {
    0: 'Buckler Light Shield Generator',
    1: 'Deathdealer Gatling Cannon',
    2: 'Eagle-eye Targeting Computer',
    3: 'Hellburn Overdrive',
    4: 'Wartech Gatling Repeater',
    5: 'Typhoon Supercharger',
    6: 'Porcupine Reactive Armor',
    7: 'Hailfire Missile Launcher',
    8: 'Hellseeker Energy Turret',
    9: 'Bit-Chipper Mining Drill',
    10: 'Plasteel Armor',
    11: 'Steelcore Armor',
    12: 'Pro-max Armor',
    13: 'Hightower Shield Generator',
    14: 'Armadillo Reactive Armor',
    15: 'Ballistic Ammo',
    16: 'Missile Ammo',
    17: 'Burster Heavy Turret',
    18: 'Earlybird Warning System',
    19: 'Death Lance',
    20: 'Tri-gun',
    21: 'Sixth Sense Warning System',
    22: 'Evercell Capacitor',
    23: 'Hyper-bat Capacitor',
    24: 'Kite Medium Shield Generator',
    25: 'Gemini Assault Turret',
    26: 'Explosive Ammunition',
    27: 'RoadRunner Turbine',
    28: 'Sure-shot Targeting Computer',
    29: 'Scatterfire Gatling Gun',
    30: 'Onslaught Heavy Launcher',
    31: 'Vertigo Energy Turret',
    32: 'Venom Energy Turret',
    33: 'Facenorth Gyro',
    34: 'Sanctuary Dampening Shield',
    35: 'Sonic Powerplant',
    36: 'Hydra Powerplant',
    37: 'Balanced Ammunition',
    38: 'Explosive Missiles',
    39: 'Steeltec Repair Droid',
    40: 'Level-head Gyro',
    41: 'Calypso Prism',
    42: 'Evercell Recharger',
    43: 'Masscap Recharger',
    44: 'Hyper-bat Recharger',
    45: 'Backflash Recharger',
    46: 'Aerodynamic Armor',
    47: 'Patchwork Armor',
    48: 'Derringer Cannon',
    49: 'High Tension Shocks',
    50: 'Steeltec Repair Bot',
    51: 'Maxwatt Transformer',
    52: 'Hasty Construction',
    53: 'Guided Warheads',
    54: 'Smart Warheads',
    55: 'Superior Grade Ammunition',
    56: 'Condensed Neutron Rounds',
    57: 'High Capacity Ammunition',
    58: 'Armor Piercing Missiles',
    59: 'High Capacity Missiles',
    60: 'Distant Thunder Recharger',
    61: 'Thunder Clap Recharger',
    62: 'Kypris Prism',
    63: 'Pallas Prism',
    64: 'Compound Optics Array',
    65: 'Advanced Optics Array',
    66: 'Mark of the Commander',
    67: 'Shield Boost Acti',
    68: 'Shield Rush Acti',
    69: 'Shield Restore Acti',
    70: 'Basic Repair Nanites Acti',
    71: 'Repair Nanites Acti',
    72: 'Advanced Repair Nanites Acti',
    73: 'Mobile Uplink',
    74: 'Improved Mining Platform',
    75: 'Advanced Mining Platform',
    76: 'Improved Hydraulics Acti',
    77: 'Powered Hydraulics Acti',
    78: 'Mining Surveyor Acti',
    79: 'Natural Armor Acti',
    80: 'Holoprojector',
    81: 'Holofield',
    82: 'Targeting Laser',
    83: 'Advanced Targeting Laser',
    84: 'Shield Shunt',
    85: 'Overload Capacitor',
    86: 'Wartech Salvage Bot',
    87: 'Wartech Salvage Droid',
    88: 'Wraith Light Launcher',
    89: 'Triad Missile Launcher',
    90: 'Incursion Assault Launcher',
    91: 'Zeus Missile System',
    92: 'Rapidfeed Adaptor',
    93: 'Carnivore Gatling Cannon',
    94: 'Crusader Long-gun',
    95: 'Reaper Assault Cannon',
    96: 'Neptune Seige Cannon',
    97: 'Gladius Energy Weapon',
    98: 'Punisher Assault Turret',
    99: 'Preserver Escape Pod',
    105: 'Sabot Launcher',
    106: 'Sabot Missiles',
    108: 'EMP Adaptor',
    109: 'EMP Cannon',
    110: 'Leech Laser',
    111: 'Mag-Cannon',
    112: 'Sanctuary Adaptor',
    113: 'Sanctuary Barrier Generator',
    114: 'Vampire Cannon',
    115: 'Rail Cannon',
    116: 'Energy-Web Missiles',
    121: 'Nightshade Cloaking Device',
    122: 'Dark Shadow Cloak Generator',
    123: 'Survivor Reinforced Cockpit',
    124: 'Powerplant Restrictors',
    125: 'Command Shield Adaptor',
    126: 'Command Shield Generator',
    127: 'Missile Defense System I',
    128: 'Missile Defense System II',
    129: 'Combat Analysis Module',
    130: 'Energy Defense System I',
    131: 'Energy Defense System II',
    132: 'Combat Analysis System',
    133: 'Ballistic Defense System I',
    134: 'Ballistic Defense System II',
    135: 'Plasma Adaptor',
    136: 'Revealer Anti-Cloak',
    137: 'Illuminator Anti-Cloak',
    138: 'Deep View Module',
    139: 'Sabot Ammunition',
    140: 'Cerberus Shield System',
    167: 'Obliteration Cannon',
    168: 'Chimera Power Converter',
    169: 'Argus Energy Adaptor',
    170: 'Compressed Cobalt Plating',
    171: 'Proton Mass Generator',
    172: 'EMP Missiles',
    173: 'EMP Ammunition',
    174: 'Cluster Missiles',
    175: 'Gyrojet Rounds',
    176: 'Gyrojet Long-gun',
    177: 'Cluster Missile Pod',
    178: 'Tremor Sensors',
    180: 'Shadow Whisperer',
}
const BUILDING = {
	'Acti Recharger - Medium': {'id': 54, 'requires': ['Acti Recharger - Small']},
	'Acti Recharger - Small': {'id': 53, 'requires': []},
	'Ballistic Ammo Refitter': {'id': 58, 'requires': ['Ballistic Damage Enhancer']},
	'Ballistic Damage Enhancer': {'id': 60, 'requires': []},
	'Command Tower': {'id': 36, 'requires': []},
	'Dropship Pad': {'id': 67, 'requires': ['Shield Generator Large', 'Sensor Array - Large', 'Medium Phase Shield Generator']},
	'EMP Generator': {'id': 38, 'requires': ['Resupply Compound']},
	'Energy Damage Enhancer': {'id': 61, 'requires': []},
	'Faction Flag': {'id': 26, 'requires': []},
	'Faction Headquarters': {'id': 20, 'requires': []},
	'Fusion Generator': {'id': 32, 'requires': []},
	'Fusion Plant': {'id': 33, 'requires': ['Fusion Generator']},
	'Fusion Reactor': {'id': 34, 'requires': ['Fusion Plant']},
	'Gravity Dynamo': {'id': 46, 'requires': []},
	'Gravity Generator': {'id': 47, 'requires': ['Gravity Dynamo']},
	'Heavy Phase Shield Generator': {'id': 52, 'requires': ['Medium Phase Shield Generator']},
	'Heavy Thumper': {'id': 29, 'requires': ['Medium Thumper']},
	'Light Phase Shield Generator': {'id': 50, 'requires': []},
	'Light Thumper': {'id': 27, 'requires': []},
	'Medium Phase Shield Generator': {'id': 51, 'requires': ['Light Phase Shield Generator']},
	'Medium Thumper': {'id': 28, 'requires': ['Light Thumper']},
	'Missile Ammo Refitter': {'id': 59, 'requires': ['Missile Damage Enhancer']},
	'Missile Damage Enhancer': {'id': 62, 'requires': []},
	'Observation Post': {'id': 30, 'requires': []},
	'Ore Processor - Large': {'id': 45, 'requires': ['Ore Processor - Medium']},
	'Ore Processor - Medium': {'id': 44, 'requires': ['Ore Processor - Small']},
	'Ore Processor - Small': {'id': 43, 'requires': []},
	'Point Defense System': {'id': 63, 'requires': ['Ballistic Damage Enhancer', 'Energy Damage Enhancer', 'Missile Damage Enhancer']},
	'Powerplant - Large': {'id': 2, 'requires': ['Powerplant - Medium']},
	'Powerplant - Medium': {'id': 1, 'requires': ['Powerplant - Small']},
	'Powerplant - Small': {'id': 0, 'requires': []},
	'Powerplant - Super': {'id': 19, 'requires': ['Powerplant - Large']},
	'Refinery - Large': {'id': 8, 'requires': ['Refinery - Medium']},
	'Refinery - Medium': {'id': 7, 'requires': ['Refinery - Small']},
	'Refinery - Small': {'id': 6, 'requires': []},
	'Repair Bay - Medium': {'id': 13, 'requires': ['Repair Bay - Small']},
	'Repair Bay - Small': {'id': 9, 'requires': []},
	'Resupply Compound': {'id': 37, 'requires': ['Command Tower']},
	'Sensor Array - Large': {'id': 57, 'requires': ['Sensor Array - Medium']},
	'Sensor Array - Medium': {'id': 56, 'requires': ['Sensor Array - Small']},
	'Sensor Array - Small': {'id': 55, 'requires': []},
	'Shield Generator Improved': {'id': 68, 'requires': ['Shield Generator Large']},
	'Shield Generator Large': {'id': 66, 'requires': ['Shield Generator Medium']},
	'Shield Generator Medium': {'id': 65, 'requires': ['Shield Generator Small']},
	'Shield Generator Small': {'id': 64, 'requires': []},
	'Shield Recharger': {'id': 35, 'requires': []},
	'Supply Depot': {'id': 18, 'requires': ['Supply Dump']},
	'Supply Dump': {'id': 17, 'requires': []},
	'Tracking Station': {'id': 31, 'requires': ['Observation Post']},
	'Turret - Basic Ballistic': {'id': 3, 'requires': []},
	'Turret - Basic Laser': {'id': 4, 'requires': []},
	'Turret - Basic Missile': {'id': 5, 'requires': []},
	'Turret - Heavy Ballistic': {'id': 14, 'requires': ['Turret - Medium Ballistic']},
	'Turret - Heavy Laser': {'id': 15, 'requires': ['Turret - Medium Laser']},
	'Turret - Heavy Missile': {'id': 16, 'requires': ['Turret - Medium Missile']},
	'Turret - Hybrid Ballistic': {'id': 49, 'requires': ['Turret - Heavy Ballistic', "Sha'Kahr Vanguard"]},
	'Turret - Hybrid Laser': {'id': 48, 'requires': ['Turret - Heavy Laser', "Sha'Kahr Protector"]},
	'Turret - Medium Ballistic': {'id': 10, 'requires': ['Turret - Basic Ballistic']},
	'Turret - Medium Laser': {'id': 11, 'requires': ['Turret - Basic Laser']},
	'Turret - Medium Missile': {'id': 12, 'requires': ['Turret - Basic Missile']},
}
const ID2BLD = {
    0: 'Powerplant - Small',
    1: 'Powerplant - Medium',
    2: 'Powerplant - Large',
    3: 'Turret - Basic Ballistic',
    4: 'Turret - Basic Laser',
    5: 'Turret - Basic Missile',
    6: 'Refinery - Small',
    7: 'Refinery - Medium',
    8: 'Refinery - Large',
    9: 'Repair Bay - Small',
    10: 'Turret - Medium Ballistic',
    11: 'Turret - Medium Laser',
    12: 'Turret - Medium Missile',
    13: 'Repair Bay - Medium',
    14: 'Turret - Heavy Ballistic',
    15: 'Turret - Heavy Laser',
    16: 'Turret - Heavy Missile',
    17: 'Supply Dump',
    18: 'Supply Depot',
    19: 'Powerplant - Super',
    20: 'Faction Headquarters',
    26: 'Faction Flag',
    27: 'Light Thumper',
    28: 'Medium Thumper',
    29: 'Heavy Thumper',
    30: 'Observation Post',
    31: 'Tracking Station',
    32: 'Fusion Generator',
    33: 'Fusion Plant',
    34: 'Fusion Reactor',
    35: 'Shield Recharger',
    36: 'Command Tower',
    37: 'Resupply Compound',
    38: 'EMP Generator',
    43: 'Ore Processor - Small',
    44: 'Ore Processor - Medium',
    45: 'Ore Processor - Large',
    46: 'Gravity Dynamo',
    47: 'Gravity Generator',
    48: 'Turret - Hybrid Laser',
    49: 'Turret - Hybrid Ballistic',
    50: 'Light Phase Shield Generator',
    51: 'Medium Phase Shield Generator',
    52: 'Heavy Phase Shield Generator',
    53: 'Acti Recharger - Small',
    54: 'Acti Recharger - Medium',
    55: 'Sensor Array - Small',
    56: 'Sensor Array - Medium',
    57: 'Sensor Array - Large',
    58: 'Ballistic Ammo Refitter',
    59: 'Missile Ammo Refitter',
    60: 'Ballistic Damage Enhancer',
    61: 'Energy Damage Enhancer',
    62: 'Missile Damage Enhancer',
    63: 'Point Defense System',
    64: 'Shield Generator Small',
    65: 'Shield Generator Medium',
    66: 'Shield Generator Large',
    67: 'Dropship Pad',
    68: 'Shield Generator Improved',
}
const PRIORITY = [
    "Aerodynamic Armor",
    "Armadillo Reactive Armor",
    "Backflash Recharger",
    "Ballistic Ammo",
    "Ballistic Defense System I",
    "Basic Repair Nanites Acti",
    "Bit-Chipper Mining Drill",
    "Buckler Light Shield Generator",
    "Combat Analysis Module",
    "Command Shield Adaptor",
    "Compound Optics Array",
    "Derringer Cannon",
    "Distant Thunder Recharger",
    "Eagle-eye Targeting Computer",
    "Earlybird Warning System",
    "Energy Defense System I",
    "Evercell Capacitor",
    "Evercell Recharger",
    "Gladius Energy Weapon",
    "Guided Warheads",
    "Hailfire Missile Launcher",
    "Hasty Construction",
    "Hellseeker Energy Turret",
    "High Tension Shocks",
    "Holoprojector",
    "Improved Hydraulics Acti",
    "Improved Mining Platform",
    "Kypris Prism",
    "Level-head Gyro",
    "Mark of the Commander",
    "Maxwatt Transformer",
    "Mining Surveyor Acti",
    "Missile Ammo",
    "Missile Defense System I",
    "Nightshade Cloaking Device",
    "Patchwork Armor",
    "Plasteel Armor",
    "Revealer Anti-Cloak",
    "Scatterfire Gatling Gun",
    "Shield Boost Acti",
    "Shield Shunt",
    "Steeltec Repair Bot",
    "Targeting Laser",
    "Typhoon Supercharger",
    "Wartech Gatling Repeater",
    "Wartech Salvage Bot",
    "Wraith Light Launcher",
    "Acti Recharger - Small",
    "Ballistic Damage Enhancer",
    "Command Tower",
    "Energy Damage Enhancer",
    "Faction Flag",
    "Faction Headquarters",
    "Fusion Generator",
    "Gravity Dynamo",
    "Light Phase Shield",
    "Light Thumper",
    "Missile Damage Enhancer",
    "Observation Post",
    "Ore Processor - Small",
    "Powerplant - Small",
    "Refinery - Small",
    "Repair Bay - Small",
    "Sensor Array - Small",
    "Shield Generator Small",
    "Shield Recharger",
    "Supply Dump",
    "Turret - Basic Ballistic",
    "Turret - Basic Laser",
    "Turret - Basic Missile",
    "Advanced Mining Platform",
    "Advanced Optics Array",
    "Advanced Targeting Laser",
    "Balanced Ammunition",
    "Ballistic Defense System II",
    "Calypso Prism",
    "Carnivore Gatling Cannon",
    "Combat Analysis System",
    "Command Shield Generator",
    "Compressed Cobalt Plating",
    "Dark Shadow Cloak Generator",
    "Deathdealer Gatling Cannon",
    "Deep View Module",
    "Energy Defense System II",
    "Explosive Ammunition",
    "Explosive Missiles",
    "Facenorth Gyro",
    "Gemini Assault Turret",
    "Hellburn Overdrive",
    "High Capacity Ammunition",
    "High Capacity Missiles",
    "Holofield",
    "Hyper-bat Capacitor",
    "Hyper-bat Recharger",
    "Illuminator Anti-Cloak",
    "Kite Medium Shield Generator",
    "Leech Laser",
    "Masscap Recharger",
    "Missile Defense System II",
    "Natural Armor Acti",
    "Onslaught Heavy Launcher",
    "Overload Capacitor",
    "Pallas Prism",
    "Porcupine Reactive Armor",
    "Powered Hydraulics Acti",
    "Powerplant Restrictors",
    "Proton Mass Generator",
    "Repair Nanites Acti",
    "Sanctuary Adaptor",
    "Shield Rush Acti",
    "Sixth Sense Warning System",
    "Smart Warheads",
    "Sonic Powerplant",
    "Steelcore Armor",
    "Steeltec Repair Droid",
    "Sure-shot Targeting Computer",
    "Survivor Reinforced Cockpit",
    "Thunder Clap Recharger",
    "Tri-gun",
    "Triad Missile Launcher",
    "Venom Energy Turret",
    "Vertigo Energy Turret",
    "Wartech Salvage Droid",
    "Acti Recharger - Medium",
    "Ballistic Ammo Refitter",
    "Fusion Plant",
    "Gravity Generator",
    "Medium Phase Shield",
    "Medium Thumper",
    "Missile Ammo Refitter",
    "Ore Processor - Medium",
    "Point Defense System",
    "Powerplant - Medium",
    "Refinery - Medium",
    "Repair Bay - Medium",
    "Resupply Compound",
    "Sensor Array - Medium",
    "Shield Generator Medium",
    "Supply Depot",
    "Tracking Station",
    "Turret - Medium Ballistic",
    "Turret - Medium Laser",
    "Turret - Medium Missile",
    "Advanced Repair Nanites Acti",
    "Argus Energy Adaptor",
    "Armor Piercing Missiles",
    "Burster Heavy Turret",
    "Cerberus Shield System",
    "Chimera Power Converter",
    "Crusader Long-gun",
    "EMP Adaptor",
    "Hightower Shield Generator",
    "Hydra Powerplant",
    "Incursion Assault Launcher",
    "Mobile Uplink",
    "Plasma Adaptor",
    "Preserver Escape Pod",
    "Pro-max Armor",
    "Punisher Assault Turret",
    "RoadRunner Turbine",
    "Sanctuary Barrier Generator",
    "Sanctuary Dampening Shield",
    "Shadow Whisperer",
    "Shield Restore Acti",
    "Superior Grade Ammunition",
    "EMP Generator",
    "Fusion Reactor",
    "Heavy Phase Shield",
    "Heavy Thumper",
    "Ore Processor - Large",
    "Powerplant - Large",
    "Refinery - Large",
    "Sensor Array - Large",
    "Shield Generator Large",
    "Turret - Heavy Ballistic",
    "Turret - Heavy Laser",
    "Turret - Heavy Missile",
    "Cluster Missiles",
    "Condensed Neutron Rounds",
    "Death Lance",
    "EMP Cannon",
    "Energy-Web Missiles",
    "Gyrojet Rounds",
    "Mag-Cannon",
    "Neptune Seige Cannon",
    "Rapidfeed Adaptor",
    "Reaper Assault Cannon",
    "Sabot Ammunition",
    "Sabot Missiles",
    "Tremor Sensors",
    "Zeus Missile System",
    "Dropship Pad",
    "Powerplant - Super",
    "Shield Generator Improved",
    "Turret - Hybrid Ballistic",
    "Turret - Hybrid Laser",
    "Cluster Missile Pod",
    "EMP Ammunition",
    "EMP Missiles",
    "Gyrojet Long-gun",
    "Sabot Launcher",
    "Vampire Cannon",
    "Obliteration Cannon",
    "Rail Cannon",
]

/*============================================== Utility ==============================================*/
function lsget(varname, def){
    let rv = localStorage.getItem(varname)
    if (rv == undefined){
        localStorage.setItem(varname, JSON.stringify(def))
        return def
    }
    else{
        return JSON.parse(rv)
    }
}

function lsput(varname, obj){
    localStorage.setItem(varname, JSON.stringify(obj))
}

function match(obj1, obj2){
    for (const [k, value] of Object.entries(obj2)) {
        if (value != obj1[k]){
            return false
        }
    }
    return true
}

function formatParams( params ){
    return "?" + Object
        .keys(params)
        .map(function(key){
        return key+"="+encodeURIComponent(params[key])
    })
        .join("&")
}

function getBarPosition(barid){
	for (let i=0; i<buildslots; i++) {
        if (nowbuilding_ConId[i] == barid){
            return i
        }
    }
    alert('Critical error, barid not found. Please report to XHunter (ID=1)')
    return 0
}

function checkBarsEmpty(){
    if (ongoing)
        return false
    for (let i=0; i<buildslots; i++) {
        if (nowbuilding_ConId[i] != 'empty'){
            return false
        }
    }
    return true
}

async function waitForBars(){
    let promise = new Promise((resolve)=>{
        let check = ()=>{
            if (checkBarsEmpty())
                resolve()
            else
                setTimeout(check, RETRY_DELAY)
        }
        check()
    })
    await promise
}

/*============================================== XMLHTTP ==============================================*/
var ongoing = 0
function sendBuildRequest(params, callback=userCallback){
    let xmlhttp = new XMLHttpRequest()
    xmlhttp.open("GET", `process_build_start.php${formatParams(params)}`, true)
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4) ongoing -= 1
        if ( (this.readyState === 4) && (this.status === 200) ) {
            if (/startcon\((\d+),(\d+),('\w+')\)/.test(this.responseText)){
                let matches = this.responseText.match(/startcon\((\d+)/)
                let barid = parseInt(matches[1])
                startcon(barid, params.unit, params.type)
                callback(params, true, barid)
            }
            else {
                callback(params, false, NaN)
            }
        }
    }
    try{
        xmlhttp.send()
        ongoing += 1
    }
    catch(err){
        setTimeout(()=>{sendBuildRequest(params, callback)}, 1000)
    }
}

function autoCallbackWrapper(params, success, barid, delay=CONFIRM_DELAY){
    if (success)
        autoRegisterStart(params, barid)
    autoCallback(params, success, barid, delay=CONFIRM_DELAY)
}

function autoCallback(params, success, barid, delay=CONFIRM_DELAY){
    if (success){
        setTimeout(()=>{
            let xmlhttp = new XMLHttpRequest()
            let confirmParams = {
                id: barid
            }
            xmlhttp.open("GET", `process_build_commit.php${formatParams(confirmParams)}`, true)
            xmlhttp.onreadystatechange = function() {
                if ( (this.readyState === 4) && (this.status === 200) ) {
                    if (/finishedbuildstatus/.test(this.responseText)){
                        // Normal expectation
                        let barpos = getBarPosition(barid)
                        clearcon(barpos)
                        autoRegisterComplete(barid)
                    }
                    else if(/buildfailed/.test(this.responseText)){
                        // Happens when the user run out of resources
                        alert('Err - Please check that you have enough ores or commands. Otherwise report bug to XHunter (ID=2)')
                        autoRegisterFailed(barid)
                    }
                    else{
                        // Multiple scenarios here - premod "gone" or user did multi-session - or we tried to confirm too early
                        // Assume the last.
                        autoCallback(params, success, barid, RETRY_DELAY)
                    }
                }
            }
            try{
                xmlhttp.send()
            }
            catch(err){
                alert(err)
                setTimeout(()=>{autoCallback(params, success, barid, delay)}, 1000)
            }
        }, delay)
    }
    else {
        // Auto action. Must be no resource or bug.
        alert('Err - Please check that you have enough ores or commands. Otherwise report bug to XHunter (ID=3)')
        disableAuto()
    }
}

function userCallback(params, success, barid, delay=CONFIRM_DELAY){
    if (success){
        setTimeout(()=>{
            let xmlhttp = new XMLHttpRequest()
            let confirmParams = {
                id: barid
            }
            xmlhttp.open("GET", `process_build_commit.php${formatParams(confirmParams)}`, true)
            xmlhttp.onreadystatechange = function() {
                if ( (this.readyState === 4) && (this.status === 200) ) {
                    if (/finishedbuildstatus/.test(this.responseText)){
                        // Normal expectation
                        let barpos = getBarPosition(barid)
                        clearcon(barpos)
                    }
                    else if(/buildfailed/.test(this.responseText)){
                        // Happens when the user run out of resources
                        alert('Err - Please check that you have enough ores or commands. Otherwise report bug to XHunter (ID=4)')
                    }
                    else{
                        // Multiple scenarios here - premod "gone" or user did multi-session - or we tried to confirm too early
                        // Assume the last.
                        userCallback(params, success, barid, RETRY_DELAY)
                    }
                }
            }
            try{
                xmlhttp.send()
            }
            catch(err){
                setTimeout(()=>{userCallback(params, success, barid, delay)}, 1000)
            }
        }, delay)
    }
    else {
        // User action. This is either no ore, command or slots.
    }
}

function cluelessComplete(barid, delay=CONFIRM_DELAY){
    setTimeout(()=>{
        let xmlhttp = new XMLHttpRequest()
        let confirmParams = {
            id: barid
        }
        xmlhttp.open("GET", `process_build_commit.php${formatParams(confirmParams)}`, true)
        xmlhttp.onreadystatechange = function() {
            if ( (this.readyState === 4) && (this.status === 200) ) {
                if (/finishedbuildstatus/.test(this.responseText)){
                    // Normal expectation
                    let barpos = getBarPosition(barid)
                    clearcon(barpos)
                    autoRegisterComplete(barid, false)
                }
                else if(/buildfailed/.test(this.responseText)){
                    alert('Err - Please check that you have enough ores or commands. Otherwise report bug to XHunter (ID=2)')
                    autoRegisterFailed(barid, false)
                }
                else{
                    cluelessComplete(barid, RETRY_DELAY)
                }
            }
        }
        try{
            xmlhttp.send()
        }
        catch(err){
            setTimeout(()=>{autoCallback(params, success, barid, delay)}, 1000)
        }
    }, delay)
}

/*============================================== Rewrites ==============================================*/
confirm = function() {
    if (auto == false){
        layerWrite('buildtext1DIV','')
        orderpending = 1
        sendBuildRequest({
            unit: buildchoice,
            type: buildtype,
            sendvars: varAmountsText != undefined ? varAmountsText.join(',') : '',
            commandused: commandused,
            cancel: 0
        })
    }
}

confirmRecent = function(myIndex) {
    if (auto == false){
        sendBuildRequest({
            unit: recentId[myIndex],
            type: recentType[myIndex],
            sendvars: recentVars[myIndex],
            commandused: recentCommand[myIndex],
            cancel: 0
        })
    }
}

buildFromReq = function(myType,myId){
    if (auto == false){
        sendBuildRequest({
            unit: myId,
            type: myType,
            commandused: 0,
            cancel: 0
        })
    }
}

selectunit = function(myunit, mytype) {
    if (expressBuild=="N") {
        layerWrite("selecttext1DIV", "<b><a href='javascript:showselect();' onfocus='this.blur();'>Select Item to Build</a></b>", "container1DIV.document.confirm1DIV")

        if (mytype=="unit") {buildchoice=unitid[myunit]}
        if (mytype=="mod") {buildchoice=modid[myunit]}
        if (mytype=="building") {buildchoice=buildingid[myunit]}

        varAmountsText = Array();
        buildtype = mytype;
        resizeit()

        mytext="<table cellpadding=0 cellspacing=0 border=0 width='100%' height='70%'><tr><td bgcolor='#01436f'>"
        mytext+="<table cellpadding=1 cellspacing=1 border=0 width='100%' height='100%'><tr>"

        if (mytype=="unit") {
            mytext+="<td bgcolor='#000000' class='helptext' width='150'><DIV STYLE='width:150; height:150;'><img src='" + imgPath + "3d_full/r_"+unittype[myunit]+".gif' border=0></DIV></td>"
            show('usecommandbar1DIV');
        }
        else if (mytype=="building") {
            mytext+="<td bgcolor='#000000' class='helptext' width='150'><DIV STYLE='width:150; height:150;'><img src='" + imgPath + "3d_full/"+buildingtype[myunit]+".gif' border=0></DIV></td>"
        }
        else if (mytype=="mod") {
            //	mytext+="<td bgcolor='#000000' class='helptext' width='20%'><center><img src=" + imgPath + "mods/"+modimglrg[myunit]+" border=0></DIV><br><b>"+modname[myunit]+"</b></center></td>"
        }

        mytext+="<td bgcolor='#000000'><iframe frameborder='no' width='100%' height='100%' scrolling='auto' src='construct_unit_info.php?unit="+buildchoice+"&type="+mytype+"'></iframe></td>"
        mytext+="</tr></table></td></tr></table>"
        mytext+="<table cellpadding=1 cellspacing=0 border=0 width='100%' height='73'>"
        mytext+="<tr><td bgcolor='#000000' align=center id='reqFrame'>"
        mytext+="<iframe name='req' id='req' frameborder='no' width='100%' height='73' scrolling='no' src='construct_unit_req.php?unit="+buildchoice+"&type="+mytype+"&nowbuilding="+nowbuilding+"&oversight="+commandused+"'></iframe>"
        mytext+="</td></tr></table>"

        layerWrite("buildunitbar1DIV", mytext, "container1DIV.document.buildunitbar1")

        show('buildunitbar1DIV');
        hide('selectunitbar1DIV');
    } else {
        if (mytype=="unit") {buildchoice=unitid[myunit]}
        if (mytype=="mod") {buildchoice=modid[myunit]}
        if (mytype=="building") {buildchoice=buildingid[myunit]}

        buildtype = mytype;
        confirm();
    }
}

startcon = function(barid, myunitid, mytype){
    mybar = "empty"
    for (var i=0;i<buildslots;i++) { if (nowbuilding_ConId[i] == "empty") {mybar = i; break;} }

    if (mybar != "empty") {
        nowbuilding_ConId[mybar] = barid
        myname = findname(myunitid, mytype)
        layerWrite("progressbar" + mybar + "textDIV", myname, "container1DIV.document.confirm1DIV")

        progress(1,mybar)
        // playpop(mybar)
        setRecent(myunitid, mytype, commandused, varAmountsText)
    }
}

processComplete = function(mybar){
    layerWrite("progressbar" + mybar + "popDIV", "...", "container1DIV.document.confirm1DIV")
}

/*============================================== Parser ==============================================*/
var ONE_CLICK = lsget('buildscript_oneclick', false)
function parseBuildQuery(query){
    try{
        var order = JSON.parse(query)
    }
    catch(err){
        alert('ERR: Bad query')
        return
    }
    var remainingItems = {}
    var buildList = {}

    //Parse the query
    for (let item of order){
        var itemList = expandItem(item)
        buildList = aggregate(buildList, itemList)
    }

    //Parse and aggregate old items to new items
    var convertedCurrent = {}

    for (let item of currentQuery){
        let name
        if (item.type == 'unit'){
            name = ID2MECH[item.unit]
            if (name in convertedCurrent){
                convertedCurrent[name].push(item)
            }
            else{
                convertedCurrent[name] = [item]
            }
        }
        else if (item.type == 'mod'){
            name = ID2MOD[item.unit]
            convertedCurrent[name] = item
        }
        else{
            name = ID2BLD[item.unit]
            convertedCurrent[name] = item
        }
    }
    buildList = aggregate(buildList, convertedCurrent)

    let newList = []
    for (let item of PRIORITY){
        if (item in buildList)
            newList.push(buildList[item])
    }
    if (ONE_CLICK)
        newList.reverse()

    for (let item in MECH){
        if (item in buildList)
            newList.push(...buildList[item])
    }
    currentQuery = newList
    lsput('buildscript_list', currentQuery)
}

/*
input: [mod_name/mech, quantity]
output: {mod_1_name: quantity, ...}
*/
function expandItem(item){
    var buildList = {}
    var children = null

    if (typeof item[1] != 'number'){
        alert(`Err - Unknown request ${item}, skipping`)
        return {}
    }
    let iname
    if (item[0] in ACRONYMS)
        iname = ACRONYMS[item[0]]
    else
        iname = item[0]


    if (iname in MOD){
        buildList[iname] = {
            unit: MOD[iname].id,
            type: 'mod',
            count: item[1],
        }
        children = MOD[iname].requires
    }
    else if (iname in MECH){
        children = MECH[iname].requires
        // Unknown var
        if (typeof item[3] != 'number' || /^[ADEMRS]*$/.test(item[2]) == false){
            alert(`Err - Unknown request ${item}, skipping`)
            return {}
        }
        else if ( children.length < item[2].length ){
            alert(`Err - Too many var select for ${iname}: ${item[2]} - max is ${children.length}, skipping`)
            return {}
        }
        let sendvar = []
        for (let i = 0; i < item[2].length; i++){
            sendvar.push(`${item[2][i]}o${MOD[children[i]].id}`)
        }
        buildList[iname] = [{
            unit: MECH[iname].id,
            type: 'unit',
            sendvars: sendvar.join(','),
            commandused: item[3],
            count: item[1],
        }]
    }
    else if (iname in BUILDING){
        buildList[iname] = {
            unit: BUILDING[iname].id,
            type: 'building',
            count: item[1],
        }
        children = BUILDING[iname].requires
    }
    else if (iname in BUILDING){
        children = BUILDING[iname].requires
    }
    else{
        alert(`Err - Unknown request ${item}, skipping`)
        return {}
    }

    if (children == null){
        return buildList
    }

    else {
        if (iname in MECH || ONE_CLICK == false){
            for (var child of children){
                var childList = expandItem([child, item[1]])
                buildList = aggregate(buildList, childList)
            }
        }
    }
    return buildList
}

function aggregate(target, content){
    for (var item in content){
        if (item in target){
            if (Array.isArray(content[item])){
                // Mechs
                for (let mech of content[item])
                    target[item].push(mech) // This works too and I can't be assed to check, match and add...
            }
            else{
                target[item].count += content[item].count
            }
        }
        else{
            target[item] = content[item]
        }
    }
    return target
}

/*============================================== Automation ==============================================*/
// Disable user inputs
var auto = true
// Alarms the script of user intents
var autoRequest = false
var currentQuery = lsget('buildscript_list',[])
var activeQuery = lsget('buildscript_active',[])

// Test data:
// var activeQuery = [
//     {
//         params:{
//             unit: 53,
//             type: 'unit',
//             sendvars: 'Ao0',
//             commandused: 20,
//             cancel: 0
//         }
//     },
//     {
//         params:{
//             unit: 98,
//             type: 'mod',
//             commandused: 100,
//             cancel: 0
//         }
//     }
// ]

// var currentQuery = [
//     {
//         unit: 53,
//         type: 'unit',
//         sendvars: 'Ao0',
//         commandused: 20,
//         count: 4
//     },
//     {
//         unit: 98,
//         type: 'mod',
//         count: 4
//     }
// ]

function autoStart(){
    auto = true
    autoRequest = true
    waitForBars()
    setTimeout(()=>{
        if (activeQuery.length > 0)
            autoBuildActives()
        else
            autoBatchNewActives()
    },0)
}

function autoStop(){
    autoRequest = false
    waitForBars()
    auto = false
}

function autoBootstrap(){
    for (let i=0; i<buildslots; i++) {
        if (nowbuilding_ConId[i] != 'empty'){
            cluelessComplete(nowbuilding_ConId[i])
        }
    }
    // Finished processing untracked constructions
    auto = autoRequest
}

// Calls upon page load
setTimeout(autoBootstrap, 1500)

function autoBatchNewActives(){
    if (autoRequest){
        waitForBars()
        if (currentQuery.length == 0){
            disableAuto()
            return
        }
        if (activeQuery.length){
            alert('Err - Queuing units before finishing existing batch. Please report to XHunter (ID=8)')
            return
        }
        for (let i = 0; i < Math.min(buildslots, currentQuery[0].count); i++){
            let newItem = {}
            let itemParams = {
                unit: currentQuery[0].unit,
                type: currentQuery[0].type,
                commandused: 100,
                cancel: 0
            }
            if (currentQuery[0].type == 'unit'){
                itemParams.sendvars = currentQuery[0].sendvars
                itemParams.commandused = currentQuery[0].commandused
            }
            newItem.params = itemParams
            activeQuery.push(newItem)
        }
        if (currentQuery[0].count <= buildslots){
            currentQuery.shift()
        }
        else{
            currentQuery[0].count -= buildslots
        }

        lsput('buildscript_list', currentQuery)
        lsput('buildscript_active', activeQuery)
        autoBuildActives()
    }
}

function autoBuildActives(){
    if (autoRequest){
        for (let item of activeQuery){
            if (item.barid != undefined){
                alert('Err - Orphaned item detected. Did you run multiple sessions or refreshed mid-confirm? Please report to XHunter (ID=9)')
                continue
            }
            sendBuildRequest(item.params, autoCallbackWrapper)
        }
    }
    else{
        alert('Err - Script attempted to run while disabled. Please report to XHunter (ID=7)')
    }
}

function autoRegisterStart(params, barid){
    for (let item of activeQuery){
        if (match(item.params, params)){
            if (item.barid == undefined){
                item.barid = barid
                lsput('buildscript_active', activeQuery)
                return
            }
        }
    }
    alert('Err - Auto registered foul item. Please report to XHunter (ID=5)')
}

function autoRegisterComplete(barid, reportNotFound=true){
    for (let item of activeQuery){
        if (item.barid == barid){
            activeQuery.splice(activeQuery.indexOf(item), 1)
            lsput('buildscript_active', activeQuery)
            if (activeQuery.length == 0)
                autoBatchNewActives()
            return
        }
    }
    if (reportNotFound)
        alert('Err - Auto item built not in checklist. Please report to XHunter (ID=6)')
}

function autoRegisterFailed(barid, reportNotFound=true){
    for (let item of activeQuery){
        if (item.barid == barid){
            item.barid = undefined
            disableAuto()
            lsput('buildscript_active', activeQuery)
            return
        }
    }
    if (reportNotFound)
        alert('Err - Auto registered foul item. Please report to XHunter (ID=10)')
}
/*============================================== GUI ==============================================*/
function toggleAuto(){
    // Toggle = Inversed
    if (autoRequest){
        disableAuto()
    }
    else{
        enableAuto()
    }
}

function disableAuto(){
    if (!autoRequest)
        return
    autoBtn.text('...')
    autoStop()
    autoBtn.text('Start Auto')
}

function enableAuto(){
    if (autoRequest)
        return
    autoBtn.text('...')
    autoStart()
    autoBtn.text('Stop Auto')
}

/* Toggle Button */
var toggleBtn = $($.parseHTML('<button id="toggle_con_mode" type="button" style="display: block; width: 110px; position: absolute;top: -20px;left: 20px;">Toggle</button>'))
var autoBtn = $($.parseHTML('<button id="toggle_auto_mode" type="button" style="display: block; width: 110px; position: absolute;top: -40px;left: 20px;">Manual</button>'))
var queryBtn = $($.parseHTML('<button id="insert_query" type="button" style="display: block; width: 110px; position: absolute;top: -60px;left: 20px;">Query</button>'))
var clearBtn = $($.parseHTML('<button id="clear" type="button" style="display: block; width: 110px; position: absolute;top: -80px;left: 20px;">Clear</button>'))
var ocToggleBtn = $($.parseHTML(`<button id="toggle_build_mode" type="button" style="display: block; width: 110px; position: absolute;top: -100px;left: 20px;">${ONE_CLICK?'One-click mode':'Classic mode'}</button>`))
var iframe = $($.parseHTML('<iframe style="visibility: hidden;" src="account.php" height="0" width="0"></iframe>'))

toggleBtn.click(function(){
    $('input[name="excon"]', iframe.contents()).click()
    $('.buttontext', iframe.contents()).click()
})

autoBtn.click(toggleAuto)

queryBtn.click(function(){
    let newRequest = prompt("Build Query?", '[["unit", qty, "vars", OS],["mod_or_bld", qty]]')
    if (newRequest != null)
        parseBuildQuery(newRequest)

    if (AUTO_BUILD_ON_QUEUE){
        enableAuto()
    }
})

clearBtn.click(function(){
    currentQuery = []
    lsput('buildscript_list', currentQuery)
})

ocToggleBtn.click(function(){
    ONE_CLICK = !ONE_CLICK
    $(this).text(ONE_CLICK?'One-click mode':'Classic mode')
    lsput('buildscript_oneclick', ONE_CLICK)
})

var loaded = false
iframe.on('load', function(){
    if (loaded)
        top.frames['content'].location = 'construct.php'
    else{
        $('#container3bgDIV').prepend(ocToggleBtn)
        $('#container3bgDIV').prepend(clearBtn)
        $('#container3bgDIV').prepend(queryBtn)
        $('#container3bgDIV').prepend(autoBtn)
        $('#container3bgDIV').prepend(toggleBtn)
        loaded = true
    }
})

$(this).ready(function(){
    $('body').append(iframe)
})
