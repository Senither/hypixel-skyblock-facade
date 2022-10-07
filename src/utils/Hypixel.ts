import { AxiosResponse } from 'axios'
import HttpException from '../exceptions/HttpException'
import DungeonsGenerator from '../generators/DungeonsGenerator'
import SkillsGenerator from '../generators/SkillsGenerator'
import SlayersGenerator from '../generators/SlayersGenerator'
import PetsGenerator from '../generators/PetsGenerator'
import { PlayerStats, SkyBlockProfile, SkyBlockProfileMembersResponse, SkyBlockProfilePlayerStats, SkyBlockProfileStats } from '../types/hypixel'

/**
 * Merges a SkyBlock profile, and a player profile together into a single object.
 *
 * @param profile The SkyBlock profile that should be merged
 * @param player The player profile that should be merged
 */
export function mergeSkyBlockProfileAndPlayer(profile: SkyBlockProfileStats, player: PlayerStats): SkyBlockProfilePlayerStats {
  return {
    id: profile.id,
    name: profile.name,
    username: player.username,
    selected: profile.selected,
    weight: profile.weight,
    weight_overflow: profile.weight_overflow,
    fairy_souls: profile.fairy_souls,
    skills: profile.skills,
    slayers: profile.slayers,
    dungeons: profile.dungeons,
    pets: profile.pets,
    coins: {
      total: (profile.coins?.bank || 0) + (profile.coins?.purse || 0),
      bank: profile.coins?.bank,
      purse: profile.coins?.purse,
    },
  }
}

/**
 * Parses and formats the Player data into a more user-friend
 * format with only the data we're actually interested in.
 *
 * @param player The player response object
 * @param uuid The UUID of the player the player data were loaded for
 */
export function parseHypixelPlayer(player: AxiosResponse, uuid: string): PlayerStats {
  if (player.data.hasOwnProperty('player') && player.data.player == null) {
    throw new HttpException(404, `Found no Player data for a user with a UUID of '${uuid}'`)
  }

  const data: any = player.data.player
  const achievements: any = data.achievements

  return {
    username: data.displayname,
    firstLogin: data.firstLogin,
    lastLogin: data.lastLogin,
    socialMedia: data.socialMedia,
    skyblockSkills: {
      mining: achievements?.skyblock_excavator || 0,
      foraging: achievements?.skyblock_gatherer || 0,
      enchanting: achievements?.skyblock_augmentation || 0,
      farming: achievements?.skyblock_harvester || 0,
      combat: achievements?.skyblock_combat || 0,
      fishing: achievements?.skyblock_angler || 0,
      alchemy: achievements?.skyblock_concoctor || 0,
      taming: achievements?.skyblock_domesticator || 0,
    },
    dungeons: {
      secrets_found: achievements?.skyblock_treasure_hunter || 0,
    },
  }
}

/**
 * Parses and formats the SkyBlock profiles into a more user-friendly format
 * with only the skills, slayers, dungeon, pets, and weight information.
 *
 * @param player The general Hypixel player stats
 * @param profiles A SkyBlock profiles response object
 * @param uuid The UUID of the player the profiles were loaded for
 */
export function parseSkyBlockProfiles(player: PlayerStats, profiles: AxiosResponse, uuid: string): SkyBlockProfileStats[] {
  if (profiles.data.hasOwnProperty('profiles') && profiles.data.profiles == null) {
    throw new HttpException(404, `Found no SkyBlock profiles for a user with a UUID of '${uuid}'`)
  }

  const result: SkyBlockProfileStats[] = []
  const minifiedUuid = uuid.replace(/-/g, '')

  for (let profileData of profiles.data.profiles) {
    if (!isValidProfile(profileData.members, minifiedUuid)) {
      continue
    }

    const profile: SkyBlockProfile = profileData.members[minifiedUuid]

    result.push({
      id: profileData.profile_id,
      name: profileData.cute_name,
      selected: profileData.selected,
      weight: 0,
      weight_overflow: 0,
      fairy_souls: profile.fairy_souls_collected,
      skills: SkillsGenerator.build(player, profile),
      slayers: SlayersGenerator.build(player, profile),
      dungeons: DungeonsGenerator.build(player, profile),
      pets: PetsGenerator.build(player, profile),
      coins: {
        bank: profileData.hasOwnProperty('banking') ? profileData.banking.balance : null,
        purse: profile.coin_purse || null,
      },
    })
  }

  // Throws a 404 if the user doesn't have any SkyBlock profiles, this step can be
  // reached if the user is invited to a profile so it shows up as a SkyBlock
  // profile in the API, but they haven't accepted the invitation yet.
  if (result.length == 0) {
    throw new HttpException(404, `Found no SkyBlock profiles for a user with a UUID of '${uuid}'`)
  }

  for (let stats of result) {
    stats.weight = sumWeight(stats, 'weight')
    stats.weight_overflow = sumWeight(stats, 'weight_overflow')
  }

  return result
}

/**
 * Checks if the profile is valid by ensuring the player is a member of
 * the profile, and that they have used the profile at least once.
 *
 * @param profileMembers The list of members for the current profile
 * @param minifiedUuid The minified UUID for the player
 */
function isValidProfile(profileMembers: SkyBlockProfileMembersResponse, minifiedUuid: string) {
  return profileMembers.hasOwnProperty(minifiedUuid) && profileMembers[minifiedUuid].pets != undefined
}

/**
 * Sums up the given stats with the given weight type.
 *
 * @param stats The stats that the weight should be calculated with
 * @param type The weight type that should be summed up
 */
function sumWeight(stats: any, type: string) {
  let weight = 0

  if (stats.skills != null) {
    weight += stats.skills[type]
  }

  if (stats.slayers != null) {
    weight += stats.slayers[type]
  }

  if (stats.dungeons != null) {
    weight += stats.dungeons[type]
  }

  return weight
}
