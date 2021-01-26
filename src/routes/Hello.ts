import { Request, Response } from 'express'

export default (_: Request, response: Response) => {
  return response.status(200).json({
    message: 'Hello, World',
  })
}
