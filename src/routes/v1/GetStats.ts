import { MetricsWorker } from '../../metrics'
import { Request, Response } from '../../types/express'
import { humanizeTime } from '../../utils'

export default (_: Request, response: Response) => {
    return response.status(200).json({
        status: 200,
        data: {
            uptime: {
                total: process.uptime(),
                human: humanizeTime(process.uptime()),
            },
            requests: MetricsWorker.getRequestMetrics()
        },
    })
}
