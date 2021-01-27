import path from 'path'
import Axios, { AxiosInstance } from 'axios'
import express from 'express'
import NotFound from './middleware/NotFound'
import AuthIsPresent from './middleware/AuthIsPresent'
import HelloRoute from './routes/Hello'

export default class Application {
  /**
   * The Axios HTTP client used to talk with the Hypixel API.
   */
  public http: AxiosInstance = Axios.create({
    baseURL: 'https://api.hypixel.net/',
    timeout: 10000,
  })

  /**
   * The Express server instance.
   */
  public server: any = express()

  /**
   * Bootstraps the Express server by setting up some
   * middlewares and all of the routes.
   */
  async bootstrap(): Promise<void> {
    this.server.use(express.static(path.join(__dirname, 'public')))

    this.server.use(AuthIsPresent)
    this.server.use(express.json())

    this.server.get('/hello', HelloRoute)

    this.server.use(NotFound)
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
