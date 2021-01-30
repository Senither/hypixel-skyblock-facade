import { SkyBlockProfile } from '../types/hypixel'

export default abstract class Generator {
  /**
   * Builds the generated response.
   *
   * @param profile The profile data for a single profile
   */
  abstract build(profile: SkyBlockProfile): object | null
}
