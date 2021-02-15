import { PlayerStats, SkyBlockProfile } from '../types/hypixel'

export default abstract class Generator {
  /**
   * Builds the generated response.
   *
   * @param player The general Hypixel player stats
   * @param profile The profile data for a single profile
   */
  abstract build(player: PlayerStats, profile: SkyBlockProfile): object | null
}
