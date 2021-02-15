import { Request, Response } from '../../types/express'
import { PlayerStats, SkyBlockProfileStats } from '../../types/hypixel'
import { asyncWrap, mergeSkyBlockProfileAndPlayer, parseHypixelPlayer, parseSkyBlockProfiles, preformGetRequest, validateUuid } from '../../utils'

export default asyncWrap(async (request: Request, response: Response) => {
  const uuid = validateUuid(request.params.uuid)

  const playerResponse = await preformGetRequest(response, `/player?key=${request.authToken}&uuid=${uuid}`)
  const player: PlayerStats = parseHypixelPlayer(playerResponse, uuid)

  const profilesResponse = await preformGetRequest(response, `/skyblock/profiles?key=${request.authToken}&uuid=${uuid}`)
  const profiles: SkyBlockProfileStats[] = parseSkyBlockProfiles(player, profilesResponse, uuid)

  return response.status(200).json({
    status: 200,
    data: profiles.map(profile => mergeSkyBlockProfileAndPlayer(profile, player)),
  })
})
