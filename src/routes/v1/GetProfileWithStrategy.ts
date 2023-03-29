import { Request, Response } from '../../types/express'
import { PlayerStats, SkyBlockProfileStats } from '../../types/hypixel'
import { asyncWrap, mergeSkyBlockProfileAndPlayer, parseHypixelPlayer, parseSkyBlockProfiles, preformGetRequest, validateUuid } from '../../utils'

export default asyncWrap(async (request: Request, response: Response) => {
  const uuid = validateUuid(request.params.uuid)

  const playerResponse = await preformGetRequest(response, `/player?key=${request.authToken}&uuid=${uuid}`)
  const player: PlayerStats = parseHypixelPlayer(playerResponse, uuid)

  const profilesResponse = await preformGetRequest(response, `/skyblock/profiles?key=${request.authToken}&uuid=${uuid}`)
  const profiles: SkyBlockProfileStats[] = parseSkyBlockProfiles(player, profilesResponse, uuid)

  let profile: SkyBlockProfileStats | undefined
  switch (request.params.strategy) {
    case 'we':
    case 'weight':
    case 'weights':
      profile = selectProfile(profiles, (profile: SkyBlockProfileStats) => {
        return profile.weight + profile.weight_overflow
      })
      break

    case 'save':
    case 'saved':
    case 'latest':
    case 'last_save':
    case 'last_saved':
    case 'last_save_at':
      profile = selectProfile(profiles, (profile: SkyBlockProfileStats) => {
        return profile.selected
      })
      break

    case 'skill':
    case 'skills':
      profile = selectProfile(profiles, (profile: SkyBlockProfileStats) => {
        return profile.skills?.average_skills || 0
      })
      break

    case 'slayer':
    case 'slayers':
      profile = selectProfile(profiles, (profile: SkyBlockProfileStats) => {
        return profile.slayers?.total_experience || 0
      })
      break

    case 'cata':
    case 'dungeon':
    case 'dungeons':
    case 'catacomb':
    case 'catacombs':
      profile = selectProfile(profiles, (profile: SkyBlockProfileStats) => {
        return profile.dungeons?.types.catacombs.experience || 0
      })
      break

    default:
      profile = profiles.find(profile => {
        return profile.name.toLowerCase() == request.params.strategy.toLowerCase()
      })
      break
  }

  if (profile == undefined) {
    return response.status(404).json({
      status: 404,
      reason: `Failed to find a profile using the given strategy`,
    })
  }

  return response.status(200).json({
    status: 200,
    data: mergeSkyBlockProfileAndPlayer(profile, player),
  })
})

/**
 * Selects a single profile using the given list of profiles and the given method
 * to select the profiles by, the method should be a function that extracts a
 * single value from the profile stats objects, which is then used as
 * a comparison with each other to select the profile with the
 * highest stat among them.
 *
 * @param profiles The list of profiles that the profile should be selected from
 * @param method The method the profiles should be selected by
 */
function selectProfile(profiles: SkyBlockProfileStats[], method: any): SkyBlockProfileStats {
  return profiles.sort((a, b) => {
    if (method(a) > method(b)) {
      return -1
    }

    if (method(a) < method(b)) {
      return 1
    }

    return 0
  })[0]
}
