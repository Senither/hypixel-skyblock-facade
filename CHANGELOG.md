# Changelog

All notable changes to `hypixel-skyblock-facade` will be documented in this file.

## v0.11.0

* Added support for master mode in catacombs responses.
* Added 521 error code handler.
* Added missing LICENSE file.

## v0.10.0

* Created /v1/stats route
  + The route displays the application uptime, and the amount of request it has handled in the last minute, hour, and since it was last rebooted, it should help give a bit of insight into how much the API is actually being used, and when the API is being used the most.
* Added fairy souls, provided by [@Calvahar](https://github.com/Calvahar)
* Added used pet candy, provided by [@Calvahar](https://github.com/Calvahar)

## v0.9.0

* Added enderman slayer with weight support.
* Added response examples to the documentation.

## v0.8.0

* Add support for getting pets via the API
  + The pets will have their level calculated, and their held item will be resolved from [SkyCrypt's pet item list](https://github.com/SkyCryptWebsite/SkyCrypt/blob/master/src/constants/pets.js).
* Fixed dungeon and slayers groups being undefined if they don't exists

## v0.7.0

* Rewrite slayer overflow weight calculations
  + All slayer overflow weight now reduces on a curve, on top of that rev and tara overflow has been nerfed by quite a bit, and sven got a slight buff until 50~ish mil XP where it falls below the weight prior to this change.

## v0.6.0

* Added support for Tier 5 slayer bosses.
* Added support for non-dashed UUIDs
* Added coins and banking info to API responses
* Fixed player achievements being null safe
  + If a player didn't have any achievements the API would failed to preform the request and return a 500 error code, this is fixed now and instead just returns a 404 since the player has no SkyBlock data.
* Updated the changelog(finally) so it matches the changes made to the project thus far.

## v0.5.0

* Added node cluster support
  + This allows you to boot up multiple instances of the facade API all listening on the same port, so the API can handle more requests on servers with more CPU resources available.
* Added dungeon secrets found to API responses.
* Raised combat level cap to 60.
* Fixed some API documentation grammar and spelling errors.

## v0.4.0

* Added support for loading skills using achievements if the player skills API is disabled.
* Added some API references and feature messages to the API documentation.

## v0.3.0

* Rewrote the dungeon weight calculations.
  + The rewrite changes the dungeon weight calculator to reward players at higher levels a lot more, and reduces points given to players at the lower levels, this change is also made so it matches the logic used in the https://github.com/senither/hypixel-skyblock-assistant project.

## v0.2.0

* All requests now return the players username within the requests.

## v0.1.0

This is the first "working" version of the API, the API contains two routes:

* `/v1/profiles/:uuid`
  + Loads every single profile a user has and formats it using the skill, slayer, and dungeon format generators.
* `/v1/profiles/:uuid/:strategy`
  + Selects a single profile for a user using the given strategy, this could be selecting a profile by weight, skills, slayers, catacombs, last saved date, or profile name, all profiles are also formatted in formatted using the skill, slayer, and dungeon format generators.

Along with the two routes the API also return CORS headers to allow requests from anywhere, and it will forward RateLimit headers provided by Hypixels API back to the end-user.
