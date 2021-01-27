import { Request as ExpressRequest } from 'express'

export default interface Request extends ExpressRequest {
  authToken?: string
}
