import { NextFunction, RequestHandler } from 'express'
import { Request, Response } from '../types/express'

/**
 * Runs an async function and catches the errors thrown in it
 * and returns them to the Express error handler.
 *
 * @param fn The function that should be handled asynchronously
 */
export function asyncWrap(fn: RequestHandler) {
  return (request: Request, response: Response, next: NextFunction) => {
    return Promise.resolve(fn(request, response, next)).catch(next)
  }
}
