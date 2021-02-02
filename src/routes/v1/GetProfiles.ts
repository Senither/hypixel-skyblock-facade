import { Request, Response } from '../../types/express'
import { asyncWrap, parseSkyBlockProfiles, preformGetRequest, validateUuid } from '../../utils'

export default asyncWrap(async (request: Request, response: Response) => {
  const uuid = validateUuid(request.params.uuid)

  const profiles = await preformGetRequest(response, `/skyblock/profiles?key=${request.authToken}&uuid=${uuid}`)

  return response.status(200).json({
    status: 200,
    data: parseSkyBlockProfiles(profiles, uuid),
  })
})
