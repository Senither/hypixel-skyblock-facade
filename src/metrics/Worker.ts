import cluster from 'cluster'

class Worker {
    /**
     * The task ID that handles syncing the workers
     * requests with the master instance.
     */
    private task: NodeJS.Timeout | null = null

    /**
     * The request tracker, this is used to keep track of the
     * amount of requests the worker has handled since the
     * last sync with the master instance.
     */
    private requests: number = 0

    /**
     * The metrics object that should be displayed
     * when people hit the /stats route.
     */
    private metrics: object = {
        total: 0,
        last_minute: 0,
        last_hour: 0,
    }

    /**
     * Registers the sync task that keeps the worker in sync with the
     * other workers, and the worker event listener so it can
     * detect when changes are happening in other workers.
     *
     * @returns void
     */
    registerListener() {
        if (this.task) {
            return
        }

        // Registers the sync task to keep the other workers
        // in sync with the current worker requests.
        this.task = setInterval(() => {
            if (!this.requests) {
                return
            }

            cluster.worker.send({
                requests: this.requests,
            })

            this.requests = 0
        }, 1000)

        // Registers the message event on the worker to keep
        // the current worker in sync with other workers.
        cluster.worker.on('message', metrics => {
            this.metrics = metrics
        })

        cluster.worker.on('exit', () => this.unregisterListener())
    }

    /**
     * Unregisters the sync task that keeps the
     * worker in sync with other workers.
     */
    unregisterListener() {
        if (this.task) {
            clearInterval(this.task)

            this.task = null
        }
    }

    /**
     * Increments the request counter by one.
     */
    incrementRequest() {
        this.requests++
    }

    /**
     * Get the request metric object data.
     *
     * @returns object
     */
    getRequestMetrics() {
        return this.metrics
    }
}

export default new Worker
