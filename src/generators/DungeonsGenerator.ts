import Generator from '../contracts/Generator'
import { humanizeTime } from '../utils'
import { DungeonsExperience } from '../constants'
import { SkyBlockProfile, DungeonGroups, Dungeon, DungeonWeightGroup, PlayerStats } from '../types/hypixel'
import { DungeonStatsGroup } from '../types/hypixel/Dungeon'
import { PlayerClassExperience } from '../types/hypixel/DungeonPlayerClass'
import { SkyBlockDungeonGroupResponse } from '../types/hypixel/SkyBlockProfileStats'

class DungeonsGenerator extends Generator {
  /**
   * The experience required to reach level 50 in any dungeon class.
   *
   * @type Number
   */
  private level50Experience = 569809640

  /**
   * The dungeon weight percentage, these values are used to help
   * calculate a dungeon weight by specifying how much of the
   * total weight calculated that should be counted, all
   * XP past level 50 will be given at 1/4 the rate.
   *
   * @type Object
   */
  private weights: DungeonWeightGroup = {
    catacombs: 0.0002149604615,
    healer: 0.0000045254834,
    mage: 0.0000045254834,
    berserker: 0.0000045254834,
    archer: 0.0000045254834,
    tank: 0.0000045254834,
  }

  build(player: PlayerStats, profile: SkyBlockProfile): SkyBlockDungeonGroupResponse | null {
    if (profile.dungeons == undefined) {
      return null
    }

    const dungeonGroups: DungeonGroups = profile.dungeons

    if (!this.hasDungeonData(dungeonGroups)) {
      return null
    }

    const dungeons: any = {
      selected_class: dungeonGroups.selected_dungeon_class,
      weight: 0,
      weight_overflow: 0,
      secrets_found: player.dungeons.secrets_found,
      classes: {
        healer: this.generateClassProperties('healer', dungeonGroups.player_classes.healer || null),
        mage: this.generateClassProperties('mage', dungeonGroups.player_classes.mage || null),
        berserker: this.generateClassProperties('berserker', dungeonGroups.player_classes.berserk || null),
        archer: this.generateClassProperties('archer', dungeonGroups.player_classes.archer || null),
        tank: this.generateClassProperties('tank', dungeonGroups.player_classes.tank || null),
      },
      types: {
        catacombs: this.buildDungeonTypeProperties(
          'catacombs',
          dungeonGroups.dungeon_types.catacombs,
          dungeonGroups.dungeon_types.master_catacombs
        ),
      },
    }

    dungeons.weight = this.sumWeights(dungeons, 'weight') + dungeons.types.catacombs.weight
    dungeons.weight_overflow = this.sumWeights(dungeons, 'weight_overflow') + dungeons.types.catacombs.weight_overflow

    return dungeons
  }

  /**
   * Preforms some checks to ensure the dungeon groups for the current
   * player actually has all the expected data before we proceed
   * with calculating the players dungeon stats.
   *
   * @param dungeons The dungeon groups that should be checked
   */
  private hasDungeonData(dungeons: DungeonGroups): boolean {
    return (
      dungeons != undefined &&
      dungeons.player_classes != undefined &&
      dungeons.dungeon_types != undefined &&
      dungeons.dungeon_types.catacombs != undefined &&
      dungeons.dungeon_types.catacombs.experience != undefined &&
      dungeons.dungeon_types.catacombs.tier_completions != undefined
    )
  }

  /**
   * Builds all the dungeon properties for the given dungeon instance.
   *
   * @param type The dungeon type the properties should be built with
   * @param dungeon The dungeon that the properties should be built for
   * @param masterDungeon The master version of the dungeon properties that should be built for
   */
  private buildDungeonTypeProperties(type: string, dungeon: Dungeon, masterDungeon: Dungeon) {
    const level = this.calculateLevel(dungeon.experience)

    const dungeonResult = {
      level: level,
      experience: dungeon.experience,
      ...this.calculateWeight(type, level, dungeon.experience),
      highest_tier_completed: dungeon.highest_tier_completed,
      times_played: this.formatDungeonStatsGroup(dungeon.times_played),
      tier_completions: this.formatDungeonStatsGroup(dungeon.tier_completions),
      best_score: this.formatDungeonStatsGroup(dungeon.best_score),
      fastest_time: this.formatDungeonStatsGroup(dungeon.fastest_time),
      fastest_time_s_plus: this.formatDungeonStatsGroup(dungeon.fastest_time_s_plus),
      mobs_killed: this.formatDungeonStatsGroup(dungeon.mobs_killed),
      most_mobs_killed: this.formatDungeonStatsGroup(dungeon.most_mobs_killed),

      master_mode: {
        highest_tier_completed: masterDungeon?.highest_tier_completed || 0,
        tier_completions: this.formatDungeonStatsGroup(masterDungeon?.tier_completions),
        best_score: this.formatDungeonStatsGroup(masterDungeon?.best_score),
        fastest_time: this.formatDungeonStatsGroup(masterDungeon?.fastest_time),
        fastest_time_s_plus: this.formatDungeonStatsGroup(masterDungeon?.fastest_time_s_plus),
        mobs_killed: this.formatDungeonStatsGroup(masterDungeon?.mobs_killed),
        most_mobs_killed: this.formatDungeonStatsGroup(masterDungeon?.most_mobs_killed),
      }
    }

    dungeonResult.best_score = this.formatDungeonScores(dungeonResult.best_score)
    dungeonResult.fastest_time = this.formatDungeonsTime(dungeonResult.fastest_time)
    dungeonResult.fastest_time_s_plus = this.formatDungeonsTime(dungeonResult.fastest_time_s_plus)

    dungeonResult.master_mode.best_score = this.formatDungeonScores(dungeonResult.master_mode.best_score)
    dungeonResult.master_mode.fastest_time = this.formatDungeonsTime(dungeonResult.master_mode.fastest_time)
    dungeonResult.master_mode.fastest_time_s_plus = this.formatDungeonsTime(dungeonResult.master_mode.fastest_time_s_plus)

    return dungeonResult
  }

  /**
   * Formats the given dungeon stats group into a more human friendly format.
   *
   * @param group The dungeon stats group that should be formatted
   */
  private formatDungeonStatsGroup(group: DungeonStatsGroup): DungeonStatsGroup {
    let result: DungeonStatsGroup = {}

    if (group == undefined) {
      return result
    }

    for (let key of Object.keys(group)) {
      if (key == '0') {
        result['entrance'] = group[key]
      } else {
        result[`tier_${key}`] = group[key]
      }
    }

    return result
  }

  /**
   * Formats the given dungeon scores into their individual scores and values,
   * making the scores a bit more informative to the end-user.
   *
   * @param scores The dungeon scores that should be formatted
   */
  private formatDungeonScores(scores: any): any {
    for (let key of Object.keys(scores)) {
      let value = scores[key]
      let score = 'C'

      if (value >= 300) {
        score = 'S+'
      } else if (value >= 270) {
        score = 'S'
      } else if (value >= 240) {
        score = 'A'
      } else if (value >= 175) {
        score = 'B'
      }

      scores[key] = {
        value,
        score,
      }
    }

    return scores
  }

  /**
   * Formats the given dungeon times into more human friendly formats by converting
   * times to seconds, and creating a humanized representation of the time.
   *
   * @param times The dungeon times that should be formatted
   */
  private formatDungeonsTime(times: any): any {
    for (let key of Object.keys(times)) {
      let seconds = times[key] / 1000

      times[key] = {
        time: humanizeTime(seconds),
        seconds,
      }
    }

    return times
  }

  /**
   * Generates the class level, experience, and weight for the given player class type.
   *
   * @param type The dungeon class type
   * @param playerClass The player class that should be generated
   */
  private generateClassProperties(type: string, playerClass?: PlayerClassExperience) {
    if (playerClass == null) {
      playerClass = {}
    }

    const experience = playerClass.experience || 0
    const level = this.calculateLevel(experience)

    return {
      level: level,
      experience: experience,
      ...this.calculateWeight(type, level, experience),
    }
  }

  /**
   * Calculates a dungeon level using the given experience.
   *
   * @param experience The experience that should be calculated to a level
   */
  private calculateLevel(experience: number) {
    let level = 0

    for (let toRemove of DungeonsExperience) {
      experience -= toRemove
      if (experience < 0) {
        return level + (1 - (experience * -1) / toRemove)
      }
      level++
    }

    return Math.min(level, 50)
  }

  /**
   * Calculates the weight for the given dungeon class using the experience.
   *
   * @param type The class that should be used in the calculations
   * @param experience The total amount of experience in the current class
   */
  private calculateWeight(type: string, level: number, experience: number) {
    let percentageModifier = this.weights[type]

    // Calculates the base weight using the players level
    let base = Math.pow(level, 4.5) * percentageModifier

    // If the dungeon XP is below the requirements for a level 50 dungeon we'll
    // just return our weight right away.
    if (experience <= this.level50Experience) {
      return {
        weight: base,
        weight_overflow: 0,
      }
    }

    // Calculates the XP above the level 50 requirement, and the splitter
    // value, weight given past level 50 is given at 1/4 the rate.
    let remaining = experience - this.level50Experience
    let splitter = (4 * this.level50Experience) / base

    // Calculates the dungeon overflow weight and returns it to the weight object builder.
    return {
      weight: Math.floor(base),
      weight_overflow: Math.pow(remaining / splitter, 0.968),
    }
  }

  /**
   * Sums up the given weight type using the given dungeons object.
   *
   * @param dungeons The dungeons object that contains already calculated weights
   * @param type The type of weight that should be summed up
   */
  private sumWeights(dungeons: any, type: string): number {
    return Object.keys(this.weights)
      .map(v => {
        return dungeons.classes.hasOwnProperty(v) ? dungeons.classes[v][type] : 0
      })
      .reduce((accumulator, current) => accumulator + current)
  }
}

export default new DungeonsGenerator()
