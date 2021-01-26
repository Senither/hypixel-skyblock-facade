import { Request, Response } from 'express'

export default (_: Request, response: Response) => {
  return response.status(404).json({
    status: 404,
    reason: 'Route not found',
  })
}
