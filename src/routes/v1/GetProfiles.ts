import HttpException from '../../exceptions/HttpException'
import DungeonsGenerator from '../../generators/DungeonsGenerator'
import SkillsGenerator from '../../generators/SkillsGenerator'
import SlayersGenerator from '../../generators/SlayersGenerator'
import { Request, Response } from '../../types/express'
import { SkyBlockProfile, SkyBlockProfilesResponse } from '../../types/hypixel'
import { asyncWrap, preformGetRequest, validateUuid } from '../../utils'

export default asyncWrap(async (request: Request, response: Response) => {
  const uuid = validateUuid(request.params.uuid)

  const profiles = await preformGetRequest(response, `/skyblock/profiles?key=${request.authToken}&uuid=${uuid}`)

  if (profiles.data.hasOwnProperty('profiles') && profiles.data.profiles == null) {
    throw new HttpException(404, `Found no SkyBlock profiles for a user with a UUID of '${uuid}'`)
  }

  const result = []
  const minifiedUuid = uuid.replace(/-/g, '')

  for (let profileData of profiles.data.profiles) {
    if (!isValidProfile(profileData.members, minifiedUuid)) {
      continue
    }

    const profile: SkyBlockProfile = profileData.members[minifiedUuid]

    result.push({
      id: profileData.profile_id,
      name: profileData.cute_name,
      last_save_at: {
        time: profile.last_save,
        date: new Date(profile.last_save),
      },
      stats: {
        skills: SkillsGenerator.build(profile),
        slayers: SlayersGenerator.build(profile),
        dungeons: DungeonsGenerator.build(profile),
      },
    })
  }

  // Throws a 404 if the user doesn't have any SkyBlock profiles, this step can be
  // reached if the user is invited to a profile so it shows up as a SkyBlock
  // profile in the API, but they haven't accepted the invitation yet.
  if (result.length == 0) {
    throw new HttpException(404, `Found no SkyBlock profiles for a user with a UUID of '${uuid}'`)
  }

  return response.status(200).json({
    status: 200,
    data: result,
  })
})

/**
 * Checks if the profile is valid by ensuring the player is a member of
 * the profile, and that they have used the profile at least once.
 *
 * @param profileMembers The list of members for the current profile
 * @param minifiedUuid The minified UUID for the player
 */
function isValidProfile(profileMembers: SkyBlockProfilesResponse, minifiedUuid: string) {
  return profileMembers.hasOwnProperty(minifiedUuid) && profileMembers[minifiedUuid].last_save != undefined
}
