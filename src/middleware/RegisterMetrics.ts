import { MetricsWorker } from '../metrics'
import { Request, Response } from '../types/express'

/**
 * Increment metrics request counter by one and passes
 * the request onto the next middleware in the stack.
 */
export default (_: Request, __: Response, next: any) => {
    MetricsWorker.incrementRequest()

    return next()
}
