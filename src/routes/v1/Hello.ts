import { Request, Response } from '../../types/express'

export default (_: Request, response: Response) => {
  return response.status(200).json({
    message: 'Hello, World',
  })
}
