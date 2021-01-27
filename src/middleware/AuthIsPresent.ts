import { Request, Response } from '../types/express'
import { isUuid } from '../utils'

/**
 * A middleware to ensure all requests passing through it all has a valid
 * UUID token passed in either its header, or as a query param.
 */
export default (request: Request, response: Response, next: any) => {
  // Checks for an authorization header first to
  // see if the token was passed using headers.
  if (request.headers.hasOwnProperty('authorization') && isUuid(request.headers.authorization)) {
    request.authToken = request.headers.authorization

    return next()
  }

  // Checks for the Hypixel key query parameter to see
  // if the token was provided using that instead.
  if (request.query.hasOwnProperty('key') && isUuid(request.query.key?.toString())) {
    request.authToken = request.query.key?.toString()

    return next()
  }

  // Fail gracefully with an informative error message.
  return response.status(400).json({
    status: 400,
    reason: 'Missing "key" query parameter, or an "authorization" header with a valid Hypixel API token',
  })
}
