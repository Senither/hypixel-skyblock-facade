import { SkyBlockProfilesResponse } from '../types/hypixel'

export default abstract class Generator {
  /**
   * Builds the generated response.
   *
   * @param uuid The minified player UUID
   * @param profileData The profile data for a single profile
   */
  abstract build(uuid: string, profileData: SkyBlockProfilesResponse): object | null
}
