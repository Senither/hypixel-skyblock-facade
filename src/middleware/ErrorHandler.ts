import { Request, Response } from 'express'
import { isProduction } from '../utils'
import HttpException from '../exceptions/HttpException'

/**
 * Handles errors thrown within the routes and returns
 * more sane error responses back to the user.
 */
export default (error: any, _: Request, response: Response, __: any) => {
  if (error instanceof HttpException) {
    return response.status(error.statusCode).json({
      status: error.statusCode,
      reason: error.message,
    })
  } else if (error.hasOwnProperty('response')) {
    switch (error.response.status) {
      case 403:
        return createJsonResponse(response, 403, 'Invalid Hypixel API token provided')

      case 404:
        return createJsonResponse(response, 404, 'The requested resource does not exist')

      case 429:
        return createJsonResponse(response, 429, 'You have hit the rate-limit, please slow down your requests')

      case 502:
        return createJsonResponse(response, 502, 'Hypixels API is currently experiencing some technical issues, try again later')

      case 503:
      case 521:
        return createJsonResponse(response, 503, 'Hypixels API is currently in maintenance mode, try again later')
    }
  }

  const jsonResponse: any = {
    status: 500,
    reason: error.message,
  }

  if (!isProduction()) {
    jsonResponse.stack = error.stack?.split('\n')
  }

  return response.status(500).json(jsonResponse)
}

/**
 * Creates a JSON response with the given status code and reason.
 *
 * @param response The Express response for the current request
 * @param statusCode The status code for the response
 * @param reason The reason describing what went wrong
 */
function createJsonResponse(response: Response, statusCode: number, reason: string) {
  return response.status(statusCode).json({
    status: statusCode,
    reason: reason,
  })
}
