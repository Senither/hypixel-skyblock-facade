import { Request, Response } from 'express'
import { isProduction } from '../utils'
import HttpException from '../exceptions/HttpException'

/**
 * Handles errors thrown within the routes and returns
 * more sane error responses back to the user.
 */
export default (error: Error, _: Request, response: Response, __: any) => {
  if (error instanceof HttpException) {
    return response.status(error.statusCode).json({
      status: error.statusCode,
      reason: error.message,
    })
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
