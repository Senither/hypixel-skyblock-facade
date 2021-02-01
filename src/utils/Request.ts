import axios from 'axios'
import { NextFunction, RequestHandler } from 'express'
import { Request, Response } from '../types/express'

/**
 * A list of headers that should be copied to the
 * response when preforming requests to the API.
 */
const headers = ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset']

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

/**
 * Creates a GET request using Axios, and shares some of the headers from
 * the request with the current request response object so the end-user
 * is notified about rate limits and other important details.
 *
 * @param response The original response object for the current request
 * @param url The URL that the GET request should be preformed on
 */
export async function preformGetRequest(response: Response, url: string) {
  const result = await axios.get(url)

  for (let header of headers) {
    if (result.headers.hasOwnProperty(header.toLowerCase())) {
      response.set(header, result.headers[header.toLowerCase()])
    }
  }

  return result
}
