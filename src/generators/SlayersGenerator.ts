import Generator from '../contracts/Generator'
import { SlayerExperience } from '../constants'
import { SkyBlockProfile, Slayer, SlayerBosses, SlayerWeightGroup } from '../types/hypixel'
import { SkyBlockSlayerGroupResponse } from '../types/hypixel/SkyBlockProfileStats'

class SlayersGenerator extends Generator {
  /**
   * The slayer weight breakpoints, slayer weight will be
   * given everytime a player reaches each breakpoint
   * for each slayer type.
   *
   * @type object
   */
  private weights: SlayerWeightGroup = {
    revenant: 2208,
    tarantula: 2118,
    sven: 1962,
  }

  build(profile: SkyBlockProfile): SkyBlockSlayerGroupResponse {
    const slayers: any = {
      total_coins_spent: this.getTotalCoinsSpentOnSlayers(profile.slayer_bosses),
      total_experience: this.calculateTotalCombinedSlayerExperience(profile.slayer_bosses),
      weight: 0,
      weight_overflow: 0,
      bosses: {
        revenant: this.generateSlayerStatsResponse('revenant', profile.slayer_bosses.zombie),
        tarantula: this.generateSlayerStatsResponse('tarantula', profile.slayer_bosses.spider),
        sven: this.generateSlayerStatsResponse('sven', profile.slayer_bosses.wolf),
      },
    }

    slayers.weight = this.sumWeights(slayers, 'weight')
    slayers.weight_overflow = this.sumWeights(slayers, 'weight_overflow')

    return slayers
  }

  /**
   * Calculates the total amount of money spent on all slayers combined.
   *
   * @param slayers The slayer bosses object
   */
  private getTotalCoinsSpentOnSlayers(slayers: SlayerBosses): number {
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
  private calculateTotalCombinedSlayerExperience(slayers: SlayerBosses): number {
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
  private generateSlayerStatsResponse(type: string, slayer: Slayer): object {
    const experience = slayer.xp || 0

    return {
      level: this.calculateSlayerLevel(experience),
      experience: experience,
      ...this.calculateWeight(type, experience),
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
  private calculateSlayerLevel(experience: number): number {
    for (let level = 0; level < SlayerExperience.length; level++) {
      let requirement = SlayerExperience[level]

      if (experience < requirement) {
        let lastRequirement = level == 0 ? 0 : SlayerExperience[level - 1]

        return level + (experience - lastRequirement) / (requirement - lastRequirement)
      }
    }
    return 9
  }

  /**
   * Calculates the weight for the given slayer type using the experience.
   *
   * @param type The slayer type that should be used in the calculations
   * @param experience The total amount of experience in the current slayer type
   */
  private calculateWeight(type: string, experience: number) {
    const divider = this.weights[type]

    if (experience <= 1000000) {
      return {
        weight: experience == 0 ? 0 : experience / divider,
        weight_overflow: 0,
      }
    }

    let base = 1000000 / divider
    let remaining = experience - 1000000
    let overflow = Math.pow(remaining / (divider * 1.5), 0.942)

    return {
      weight: base,
      weight_overflow: overflow,
    }
  }

  /**
   * Sums up the given weight type using the given slayer object.
   *
   * @param slayers The slayers object that contains already calculated weights
   * @param type The type of weight that should be summed up
   */
  private sumWeights(slayers: any, type: string): number {
    return Object.keys(this.weights)
      .map(v => slayers.bosses[v][type])
      .reduce((accumulator, current) => accumulator + current)
  }
}

export default new SlayersGenerator()
