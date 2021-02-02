import path from 'path'
import axios from 'axios'
import express from 'express'
import NotFound from './middleware/NotFound'
import ErrorHandler from './middleware/ErrorHandler'
import AuthIsPresent from './middleware/AuthIsPresent'
import HelloRoute from './routes/v1/Hello'
import GetProfiles from './routes/v1/GetProfiles'
import GetProfileWithStrategy from './routes/v1/GetProfileWithStrategy'

export default class Application {
  /**
   * The Express server instance.
   */
  public server: any = express()

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

    this.server.use(AuthIsPresent)
    this.server.use(express.json())

    this.server.get('/v1/hello', HelloRoute)
    this.server.get('/v1/profiles/:uuid', GetProfiles)
    this.server.get('/v1/profiles/:uuid/:strategy', GetProfileWithStrategy)

    this.server.use(NotFound)
    this.server.use(ErrorHandler)
  }

  /**
   * Serves the Express webserver on the specified port.
   */
  async serve(): Promise<void> {
    const port = process.env.PORT || 9281

    this.server.listen(port, () => {
      console.log(`Hypixel SkyBlock Facade is now listening on port ${port}`)
    })
  }
}
