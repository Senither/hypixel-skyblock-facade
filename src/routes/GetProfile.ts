import axios from 'axios'
import HttpException from '../exceptions/HttpException'
import { Request, Response } from '../types/express'
import { asyncWrap, validateUuid } from '../utils'

export default asyncWrap(async (request: Request, response: Response) => {
  const uuid = validateUuid(request.params.uuid)

  const profiles = await axios.get(`/skyblock/profiles?key=${request.authToken}&uuid=${uuid}`)

  if (profiles.data.hasOwnProperty('profiles') && profiles.data.profiles == null) {
    throw new HttpException(404, `Found no SkyBlock profiles for a user with a UUID of '${uuid}'`)
  }

  return response.status(200).json(profiles.data)
})
