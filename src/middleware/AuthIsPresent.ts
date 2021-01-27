import { Request, Response } from '../types/express'

/**
 * A middleware to ensure all requests passing through it all has a valid
 * UUID token passed in either its header, or as a query param.
 */
export default (request: Request, response: Response, next: any) => {
  // Checks for an authorization header first to
  // see if the token was passed using headers.
  if (request.headers.hasOwnProperty('authorization') && isUUID(request.headers.authorization)) {
    request.authToken = request.headers.authorization

    return next()
  }

  // Checks for the Hypixel key query parameter to see
  // if the token was provided using that instead.
  if (request.query.hasOwnProperty('key') && isUUID(request.query.key?.toString())) {
    request.authToken = request.query.key?.toString()

    return next()
  }

  // Fail gracefully with an informative error message.
  return response.status(400).json({
    status: 400,
    reason: 'Missing "key" query parameter, or an "authorization" header with a valid Hypixel API token',
  })
}

/**
 * Checks the given string if it is a valid UUID.
 *
 * @param uuid The string that should be checked if it's an UUID
 */
function isUUID(uuid: string | undefined) {
  if (uuid == undefined) {
    return false
  }

  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid)
}
