CHANGELOG:

* 3.0:
	* Released - Total overhaul of the underlying system. Now more robust and reliable
		* Can still be brittle if you reload the page mid build
		* Much more crash resistant
		* Still can't handle if you decided to send/use mods midbuild... or if you open another session and mess things up, etc. That's impossible/infeasible
	* Much better speed & smoother manual building
	* Oversight and variant selection now supported
		* Query is now more complex as a result. GUI would fix it, but takes time.

* 2.2: 
	* One-click support added as a toggle (WARN: FUNDAMENTALLY BUGGY DUE TO HOW FRIZZ CODED THE FEATURE)
	* Increased confirm delay (less buggy, slower construction speed)

Quick guide:

Feature:
* Auto confirm - For manual build
* Auto build - With memory tracker. Close the page, resume later, as long as you use the same browser, it'd remember (data stored in localstorage). Semi-functional (some edge cases I'd still need to resolve)
* Auto parse the pre-reqs (no need to build 1 buckler, 1 kite, 1 HT, just tell it to build 1 HT)


List of buttons:
* Clear - Clears current build order
* Query - Create a new build order. New order will be added on top of the old one
* Auto/Manual - Toggle autobuild. Used to pause and resume build orders.
* Toggle - Toggles one-click build mode (DS settings) without needing to go to settings

Query format:
[
	["Unit", qty, "Vars", Oversight"],
	["Mod/building", qty],
	...
]


Common acronyms for common units are included.

Example:
[["Wyvern Missile Platform", 40, "ADMM", 100]]

OUTDATED:
Example gif (query: {"Kat": 8} ):

![Alt Text](https://github.com/LN-24111/dropshock-scripts/blob/main/building_script/tutorial.gif)

Advanced:
* To add a new acronym, add to the script's ACRONYMS const

Version 3.0 planned features:
* Full GUI (no more typing... well, more convenient typing)
* View current build queue
* ~~Support for one-click build mode (with the caveat that this feature is horrible for managing your inventory - not related to the build script - but it's an easy implement)~~
* ~~ Build units with var, oversight selection ~~
