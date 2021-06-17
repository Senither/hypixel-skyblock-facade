import os from 'os'
import path from 'path'
import cors from 'cors'
import axios from 'axios'
import express from 'express'
import cluster from 'cluster'
import NotFound from './middleware/NotFound'
import ErrorHandler from './middleware/ErrorHandler'
import AuthIsPresent from './middleware/AuthIsPresent'
import RegisterMetrics from './middleware/RegisterMetrics'
import HelloRoute from './routes/v1/Hello'
import GetStatsRoute from './routes/v1/GetStats'
import GetProfiles from './routes/v1/GetProfiles'
import GetProfileWithStrategy from './routes/v1/GetProfileWithStrategy'
import { MetricsManager, MetricsWorker } from './metrics'

export default class Application {
  /**
   * The Express server instance.
   */
  public server: any = express()

  /**
   * Checks if the current instance is the master of the cluster.
   */
  isMaster() {
    return cluster.isMaster
  }

  /**
   * Creates a cluster of equal size to the amount of cores the CPU has,
   * or the size defined in the CLUSTER_SIZE environment variable.
   */
  async createCluster() {
    const cupCores = process.env.CLUSTER_SIZE || os.cpus().length

    console.log(`Booting "Hypixel SkyBlock Facade" cluster with ${cupCores} instances!`)
    console.log('')

    for (let i = 0; i < cupCores; i++) {
      cluster.fork()
    }

    cluster.on('exit', worker => {
      console.log(`Worker ${worker.id} died'`)
      console.log(`Staring a new one...`)

      cluster.fork()
    })

    MetricsManager.bootstrapMetrics()
  }

  /**
   * Bootstraps the Express server by setting up some
   * middlewares and all of the routes.
   */
  async bootstrap(): Promise<void> {
    axios.defaults.baseURL = 'https://api.hypixel.net/'
    axios.defaults.timeout = 10000
    axios.defaults.headers.common = {
      'User-Agent': `Hypixel-Skyblock-Facade/${process.env.npm_package_version} (https://github.com/Senither/hypixel-skyblock-facade)`,
    }

    this.server.use(express.static(path.join(__dirname, 'public')))

    this.server.use(cors())
    this.server.use(RegisterMetrics)
    this.server.use(AuthIsPresent)
    this.server.use(express.json())

    this.server.get('/v1/hello', HelloRoute)
    this.server.get('/v1/stats', GetStatsRoute)
    this.server.get('/v1/profiles/:uuid', GetProfiles)
    this.server.get('/v1/profiles/:uuid/:strategy', GetProfileWithStrategy)

    this.server.use(NotFound)
    this.server.use(ErrorHandler)

    MetricsWorker.registerListener()
  }

  /**
   * Serves the Express webserver on the specified port.
   */
  async serve(): Promise<void> {
    const port = process.env.PORT || 9281

    this.server.listen(port, () => {
      console.log(`Hypixel SkyBlock Facade worker ${cluster.worker.id} with PID ${process.pid} is now listening on port ${port}`)
    })
  }
}
