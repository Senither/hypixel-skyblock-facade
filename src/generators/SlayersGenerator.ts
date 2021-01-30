import Generator from '../contracts/Generator'
import { SlayerExperience } from '../constants'
import { SkyBlockProfile, SkyBlockProfilesResponse, Slayer, SlayerBosses } from '../types/hypixel'

class SlayersGenerator extends Generator {
  build(uuid: string, profileData: SkyBlockProfilesResponse): object | null {
    const profile: SkyBlockProfile = profileData[uuid]

    return {
      total_coins_spent: this.getTotalCoinsSpentOnSlayers(profile.slayer_bosses),
      total_experience: this.calculateTotalCombinedSlayerExperience(profile.slayer_bosses),
      bosses: {
        revenant: this.generateSlayerStatsResponse(profile.slayer_bosses.zombie),
        tarantula: this.generateSlayerStatsResponse(profile.slayer_bosses.spider),
        sven: this.generateSlayerStatsResponse(profile.slayer_bosses.wolf),
      },
    }
  }

  /**
   * Calculates the total amount of money spent on all slayers combined.
   *
   * @param slayers The slayer bosses object
   */
  getTotalCoinsSpentOnSlayers(slayers: SlayerBosses): number {
    let totalCoins = 0

    for (let type of Object.keys(slayers)) {
      const slayer = slayers[type]

      totalCoins += (slayer.boss_kills_tier_0 || 0) * 100
      totalCoins += (slayer.boss_kills_tier_1 || 0) * 2000
      totalCoins += (slayer.boss_kills_tier_2 || 0) * 10000
      totalCoins += (slayer.boss_kills_tier_3 || 0) * 50000
    }

    return totalCoins
  }

  /**
   * Calculates the total amount of experience gained for all slayers combined.
   *
   * @param slayers The slayer bosses object
   */
  calculateTotalCombinedSlayerExperience(slayers: SlayerBosses): number {
    let totalXp = 0

    for (let type of Object.keys(slayers)) {
      totalXp += slayers[type].xp || 0
    }

    return totalXp
  }

  /**
   * Generates the slayer response object for the given slayer stats.
   *
   * @param slayer The slayer object
   */
  generateSlayerStatsResponse(slayer: Slayer): object {
    return {
      level: this.calculateSlayerLevel(slayer.xp),
      experience: slayer.xp,
      kills: {
        tier_1: slayer.boss_kills_tier_0 || 0,
        tier_2: slayer.boss_kills_tier_1 || 0,
        tier_3: slayer.boss_kills_tier_2 || 0,
        tier_4: slayer.boss_kills_tier_3 || 0,
      },
    }
  }

  /**
   * Calculates slayer level based off the given experience.
   *
   * @param experience The slayer experience
   */
  calculateSlayerLevel(experience: number): number {
    for (let level = 0; level < SlayerExperience.length; level++) {
      let requirement = SlayerExperience[level]

      if (experience < requirement) {
        let lastRequirement = level == 0 ? 0 : SlayerExperience[level - 1]

        return level + (experience - lastRequirement) / (requirement - lastRequirement)
      }
    }
    return 9
  }
}

export default new SlayersGenerator()
