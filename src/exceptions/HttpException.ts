export default class HttpException extends Error {
  constructor(public statusCode: number, public message: string) {
    super()

    this.statusCode = statusCode
    this.message = message
  }
}
