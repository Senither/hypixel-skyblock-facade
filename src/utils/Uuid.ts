import HttpException from '../exceptions/HttpException'

/**
 * Checks the given string if it is a valid UUID.
 *
 * @param uuid The string that should be checked if it's a UUID
 */
export function isUuid(uuid: string | undefined): boolean {
  if (uuid == undefined) {
    return false
  }

  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid)
}

/**
 * Checks the given string if it is a valid UUID, if it is not a valid
 * UUID it will throw a HTTP exception, stopping the request.
 *
 * @param uuid The string that should be checked if it's a UUID
 * @returns The valid UUID string
 */
export function validateUuid(uuid: string | undefined): string {
  if (uuid == undefined || !isUuid(uuid)) {
    throw new HttpException(404, 'Invalid UUID provided, you must provide a valid UUID')
  }

  return uuid
}
