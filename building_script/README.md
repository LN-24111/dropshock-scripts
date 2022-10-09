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
"""
{
	"Unit/mod/building name": quantity,
	...
}
"""

Common acronyms for common units are included.
The unit itself is not built. This is due to variant selection / oversight being a major concern.


Advanced:
* To add a new acronym, add to the script's ACRONYMS const

Version 3.0 planned features:
* Full GUI (no more typing... well, more convenient typing)
* View current build queue
* Support for one-click build mode (with the caveat that this feature is horrible for managing your inventory - not related to the build script - but it's an easy implement)
* Build units with var, oversight selection
