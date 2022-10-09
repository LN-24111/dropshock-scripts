// ==UserScript==
// @name         DS building script
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to take over the world!
// @author       You
// @updateURL    https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/building_script/building_script.meta.js
// @downloadURL  https://raw.githubusercontent.com/LN-24111/dropshock-scripts/main/building_script/building_script.js
// @match        *://command.drop-shock.com/construct.php*
// @match        *://command.drop-shock.com/index_build.html*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        null
// ==/UserScript==
const AUTO_BUILD_ON_QUEUE = true

// Delay before confirm. This takes advantage of how lax the server requirement is. And message delays.
// Lower value may break script until I implement a better version
// Higher value makes things slower
const CONFIRM_DELAY = 1500

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
	'Necromancer Meka': {'id': 83, 'requires': ['Steeltec Repair Droid', 'Mobile Uplink', 'Vampire Cannon', 'EMP Cannon']},
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
/*============================================== Parser ==============================================*/
function parseBuildQuery(query){
    try{
        var order = JSON.parse(query)
        var remainingItems = {}
        var buildList = {}

        //Parse the query
        for (var item in order){
            var itemList = getBuildList([item, order[item]])
            buildList = aggregate(buildList, itemList)
        }

        //Parse and aggregate old items to new items
        var convertedRemainingItems = JSON.parse(localStorage.getItem('buildList'))
        if (convertedRemainingItems == null)
            convertedRemainingItems = []
        for (item of convertedRemainingItems){
            remainingItems[item[0]] = item[1]
        }
        buildList = aggregate(buildList, remainingItems)

        var convertedBuildList = []
        for (item of PRIORITY){
            if (item in buildList)
                convertedBuildList.push([item, buildList[item]])
        }
        localStorage.setItem('buildList', JSON.stringify(convertedBuildList))
    }
    catch(err){console.log(err)}
}

/*
input: [mod_name/mech, quantity]
output: {mod_1_name: quantity, ...}
*/
function getBuildList(order){
    var buildList = {}
    var children = null

    if (order[0] in ACRONYMS)
        order[0] = ACRONYMS[order[0]]
    if (order[0] in MOD){
        buildList[order[0]] = order[1]
        children = MOD[order[0]]
    }
    else if (order[0] in MECH){
        children = MECH[order[0]]
    }
    else if (order[0] in BUILDING){
        buildList[order[0]] = order[1]
        children = BUILDING[order[0]]
    }
    else{
    }

    if (children == null){
        return buildList
    }
    else {
        for (var child of children["requires"]){
            //Get child list
            var childList = getBuildList([child, order[1]])
            //Append
            buildList = aggregate(buildList, childList)
        }
    }
    return buildList
}

function aggregate(target, content){
    for (var item in content){
        if (target[item] == null)
            target[item] = content[item]
        else
            target[item] += content[item]
    }
    return target
}

/*============================================== Automation ==============================================*/
var auto = false
var requestAuto = false
var buildLock = 0
var newRequest = null

class BuildQueue {
    constructor() {
        this.queue = []
    }

    _append(buildchoice, buildtype){
        this.queue.push([buildchoice, buildtype])
    }

    parseRequest(){
        this.queue = [] //Wipe the queue
        var remainingItems = JSON.parse(localStorage.getItem('buildList'))
        if (remainingItems == null)
            return

        for (var item of remainingItems){
            var matches = $(`a:contains(${item[0]})`)
            matches = matches.filter(function () {
                return $(this).text().trim() == item[0]
            });

            var href = matches.first().attr('href')
            var id = parseInt(href.match(/\d/g).join(""))
            var type = href.split('"')[1]

            if (type == "unit") {id = unitid[id]}
            if (type == "mod") {id = modid[id]}
            if (type == "building") {id = buildingid[id]}

            for (var i = 0; i < item[1]; i++){
                this._append(id, type)
            }
        }
    }

    process(){
        //We try and process only if we're in automode and the user didn't request to pause auto, and the user isn't adding new items
        if (auto && requestAuto && newRequest == null){
            if (this.queue.length > 0 && buildLock == 0){
                buildLock = buildslots
                var firstMod = this.queue[0][0]
                for (var i = 0; i < buildslots; i++){
                    if (this.queue.length == 0 || this.queue[0][0] != firstMod){
                        buildLock--
                        continue
                    }
                    var item = this.queue.shift()
                    $.get('process_build_start.php', {unit: item[0], type: item[1], sendvars:'', commandused: 0, cancel: 0}, function( data ) {
                        if (data.includes('startcon')){
                            var variables = data.split('startcon(')[1].split(')')[0].split(',')
                            var barid = parseInt(variables[0])
                            var myunitid = parseInt(variables[1])
                            var mytype = variables[2].split("'")[1]
                            startcon(barid, myunitid, mytype)
                        }
                        else
                            console.log('Error: Server reported build requirements not met!')
                    });
                }
                return true
            }
        }
        return false
    }

    clear(){
        this.queue = []
    }

    finished(){
        return this.queue.length == 0 && buildLock == 0
    }
}
var buildQueue = new BuildQueue()
$(this).ready(function(){
    buildQueue.parseRequest()
})

//Listener for items being built. Used to verify stuff
function itemBuilt(mod){
    if (auto){
        var remainingItems = JSON.parse(localStorage.getItem('buildList'))

        var found = false
        for (var i = 0; i < remainingItems.length; i++){
            if (remainingItems[i][0] == mod){
                if (remainingItems[i][1] == 1) {
                    remainingItems.splice(i, 1)
                }
                else {
                    remainingItems[i][1]--
                }

                found = true
                break
            }
        }
        if (found)
            localStorage.setItem('buildList', JSON.stringify(remainingItems))
        else
            console.log(`Item built not in list: ${mod}`)
    }
}

/*============================================== Reroute between programmic call and normal call ==============================================*/
function processcomplete_2(mybar) {
    if (nowbuilding_ConId[mybar] == 'empty'){
        console.log('Critical error, ConId not found')
        return
    }

    var item = $(`#progressbar${mybar}textDIV`).text().trim()
    $.get('process_build_commit.php', {id: nowbuilding_ConId[mybar], mybar: mybar})
    itemBuilt(item)
    clearcon(mybar)

    setTimeout(function(){
        if (auto)
            buildLock--
    }, 10)
}

function clearcon_2(mybar) {
    eval("progressbar" + mybar + ".clip(0, 0, 19, 0)")
    nowbuilding_ConId[mybar] = "empty"
    layerWrite("progressbar" + mybar + "popDIV", "", "container1DIV.document.confirm1DIV")
    layerWrite("progressbar" + mybar + "textDIV", "", "container1DIV.document.confirm1DIV")
    mybar = eval("progressbar" + mybar + "pop")
    mybar.style.left = 420
}

function confirm() {
    $.get('process_build_start.php', {unit: buildchoice, type: buildtype, sendvars:'', commandused: commandused, cancel: 0}, function( data ) {
        if (data.includes('startcon')){
            var variables = data.split('startcon(')[1].split(')')[0].split(',')
            var barid = parseInt(variables[0])
            var myunitid = parseInt(variables[1])
            var mytype = variables[2].split("'")[1]
            startcon(barid, myunitid, mytype)
        }
        else
            console.log('Error: Server denied request!')
    });
}

function progress_2(myprogress,mybar) {
    if (canceled[mybar] != 1) {
        eval("progressbar" + mybar + ".clip(0, 470, 19, 0)")
        setpop(mybar,'end')
    } else {
        clearcon(mybar)
        setTimeout("canceled[" + mybar + "]=0", 600)
    }
}

function playpop_2(barid){
    mybar = eval("progressbar" + barid + "pop")
    mybar.style.left = 481

}

function startcon_2(barid, myunitid, mytype){
    mybar = "empty"
    for (var i=0;i<buildslots;i++) { if (nowbuilding_ConId[i] == "empty") {mybar = i; break;} }

    if (mybar != "empty") {
        nowbuilding_ConId[mybar] = barid
        myname = findname(myunitid, mytype);
        layerWrite("progressbar" + mybar + "textDIV", myname, "container1DIV.document.confirm1DIV")

        progress(0,mybar)
        playpop(mybar)
        setRecent(myunitid, mytype, commandused, varAmountsText)

        if (buildchoice != -1) { myId = findId(buildchoice, buildtype); selectunit(myId, buildtype) }
    }
}

$(this).ready(function(){
    processcomplete = processcomplete_2
    clearcon = clearcon_2
    progress = progress_2
    playpop = playpop_2
    startcon = startcon_2
    finishedbuildstatus = function(){}
})

/*============================================== GUI stuff ==============================================*/
/* Toggle Button */
var toggleBtn = $($.parseHTML('<button id="toggle_con_mode" type="button" style="display: block; position: absolute;top: -20px;left: 40px;">Toggle</button>'))
var autoBtn = $($.parseHTML('<button id="toggle_auto_mode" type="button" style="display: block; position: absolute;top: -40px;left: 40px;">Manual</button>'))
var queryBtn = $($.parseHTML('<button id="insert_query" type="button" style="display: block; position: absolute;top: -60px;left: 40px;">Query</button>'))
var clearBtn = $($.parseHTML('<button id="clear" type="button" style="display: block; position: absolute;top: -80px;left: 40px;">Clear</button>'))
var iframe = $($.parseHTML('<iframe style="visibility: hidden;" src="account.php" height="0" width="0"></iframe>'))

toggleBtn.click(function(){
    $('input[name="excon"]', iframe.contents()).click()
    $('.buttontext', iframe.contents()).click()
})
autoBtn.click(function(){
    requestAuto = !requestAuto
    $(this).text('...')
})
queryBtn.click(function(){
    newRequest = prompt("Build Query?", "{}")
    if (newRequest != null)
        requestAuto = AUTO_BUILD_ON_QUEUE ? true : requestAuto
})

clearBtn.click(function(){
    localStorage.setItem('buildList', JSON.stringify([]))
    buildQueue.clear()
})

var loaded = false
iframe.on('load', function(){
    if (loaded)
        top.frames['content'].location = 'construct.php'
    else{
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

/*============================================== Master loop ==============================================*/

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var confirmLock = false
$(this).ready(function(){
    //wait for frizz stuff to finish running
    setTimeout(function(){
        setInterval(async function(){
            if (confirmLock)
                return
            if (buildQueue.process()){
                confirmLock = true
                await sleep(400)
            }
            //Automatically confirm
            var confirms = $("div[id*='popDIV']:contains(Confirm)").children('a')
            confirmLock = true
            await sleep(CONFIRM_DELAY)
            for (var i = 0; i < confirms.length; i++){
                await sleep(50)
                confirms[i].click()
            }
            confirmLock = false

            //await sleep(500)
            // Check if anything is being built
            var building = false
            for (i = 0; i < buildslots; i++){
                if (nowbuilding_ConId[i] != 'empty')
                    building = true
            }

            // All state changes are done when building is off
            if (building == false){
                // Handle any new build request
                if (newRequest != null){
                    parseBuildQuery(newRequest)
                    buildQueue.parseRequest()
                    newRequest = null
                }
                // If finished building, request auto off
                if (buildQueue.finished()){
                    requestAuto = false
                }

                // If we aren't building anything, sync auto mode
                auto = requestAuto
                $('#toggle_auto_mode').text(auto ? 'Auto' : 'Manual')
            }
        }, 50)
    }, 500)
})

