import axios from 'axios'
import HttpException from '../exceptions/HttpException'
import { Request, Response } from '../types/express'
import { validateUuid } from '../utils'

export default async (request: Request, response: Response, next: any) => {
  const { uuid } = request.params
  validateUuid(uuid)

  const profiles = await axios.get(`/skyblock/profiles?key=${request.authToken}&uuid=${uuid}`)

  if (profiles.data.hasOwnProperty('profiles') && profiles.data.profiles == null) {
    return next(new HttpException(404, `Found no SkyBlock profiles for a user with a UUID of '${uuid}'`))
  }

  return response.status(200).json(profiles.data)
}
