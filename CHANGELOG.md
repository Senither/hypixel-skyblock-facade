# Changelog

All notable changes to `hypixel-skyblock-facade` will be documented in this file.

## v0.2.0

- All requests now return the players username within the requests.

## v0.1.0

This is the first "working" version of the API, the API contains two routes:

- `/v1/profiles/:uuid`
  - Loads every single profile a user has and formats it using the skill, slayer, and dungeon format generators.
- `/v1/profiles/:uuid/:strategy`
  - Selects a single profile for a user using the given strategy, this could be selecting a profile by weight, skills, slayers, catacombs, last saved date, or profile name, all profiles are also formatted in formatted using the skill, slayer, and dungeon format generators.

Along with the two routes the API also return CORS headers to allow requests from anywhere, and it will forward RateLimit headers provided by Hypixels API back to the end-user.
