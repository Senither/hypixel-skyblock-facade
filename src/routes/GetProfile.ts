import axios from 'axios'
import HttpException from '../exceptions/HttpException'
import SkillsGenerator from '../generators/SkillsGenerator'
import SlayersGenerator from '../generators/SlayersGenerator'
import { Request, Response } from '../types/express'
import { asyncWrap, validateUuid } from '../utils'

export default asyncWrap(async (request: Request, response: Response) => {
  const uuid = validateUuid(request.params.uuid)

  const profiles = await axios.get(`/skyblock/profiles?key=${request.authToken}&uuid=${uuid}`)

  if (profiles.data.hasOwnProperty('profiles') && profiles.data.profiles == null) {
    throw new HttpException(404, `Found no SkyBlock profiles for a user with a UUID of '${uuid}'`)
  }

  const result = []
  const minifiedUuid = uuid.replace(/-/g, '')

  for (let profile of profiles.data.profiles) {
    if (!profile.members.hasOwnProperty(minifiedUuid)) {
      continue
    }

    result.push({
      id: profile.profile_id,
      name: profile.cute_name,
      stats: {
        skills: SkillsGenerator.build(minifiedUuid, profile.members),
        slayers: SlayersGenerator.build(minifiedUuid, profile.members),
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
