import cluster from 'cluster'

class Manager {

    /**
     * The total amount of requests the application
     * have handled since it was last started.
     */
    private totalRequests = 0

    /**
     * The list of requests handled in the last minute, where
     * the key is the uptime, and the value is the amount
     * of requests that was handled at that moment in
     * the applications life-cycle.
     */
    private latestMinuteRequests: any = {}

    /**
     * The list of requests handled in the last hour, where
     * the key is the uptime, and the value is the amount
     * of requests that was handled at that moment in
     * the applications life-cycle.
     */
    private latestHourRequests: any = {}

    /**
     * Registers the message event lister to handle workers receiving
     * requests, and sets up the sync and cleanup tasks so that data
     * is shared correctly between all the workers, and expired
     * data is removed correctly.
     */
    bootstrapMetrics() {
        cluster.on('message', (_, message) => {
            this.totalRequests += message.requests

            let time = process.uptime().toFixed()

            this.latestMinuteRequests[time] = message.requests + (this.latestMinuteRequests[time] ?? 0)
            this.latestHourRequests[time] = message.requests + (this.latestHourRequests[time] ?? 0)
        })

        // Registers the sync task, this will broadcast the current
        // metrics to all the workers so they're all kept in sync.
        setInterval(() => {
            let metrics = {
                total: this.totalRequests,
                last_minute: Object.values(this.latestMinuteRequests)
                    .reduce((sum: any, current: any) => sum + current, 0),
                last_hour: Object.values(this.latestHourRequests)
                    .reduce((sum: any, current: any) => sum + current, 0),
            }

            for (let workerId in cluster.workers) {
                cluster.workers[workerId]?.send(metrics)
            }
        }, 1500)

        // Registers the cleanup task, deleting any key from the
        // minute and hour request trackers that has expired.
        setInterval(() => {
            let time = process.uptime()

            Object.keys(this.latestMinuteRequests)
                .filter((value: any) => value <= time - 60)
                .forEach(key => delete this.latestMinuteRequests[key])

            Object.keys(this.latestHourRequests)
                .filter((value: any) => value <= time - 3600)
                .forEach(key => delete this.latestHourRequests[key])
        }, 1000)
    }
}

export default new Manager
