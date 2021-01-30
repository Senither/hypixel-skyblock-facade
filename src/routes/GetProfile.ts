import axios from 'axios'
import HttpException from '../exceptions/HttpException'
import SkillsGenerator from '../generators/SkillsGenerator'
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
    result.push({
      id: profile.profile_id,
      name: profile.cute_name,
      data: {
        skills: SkillsGenerator.build(minifiedUuid, profile.members),
      },
    })
  }

  return response.status(200).json({
    status: 200,
    data: result,
  })
})
