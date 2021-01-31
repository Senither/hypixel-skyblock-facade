import Generator from '../contracts/Generator'
import { humanizeTime } from '../utils'
import { DungeonsExperience } from '../constants'
import { SkyBlockProfile, DungeonGroups, Dungeon } from '../types/hypixel'
import { DungeonStatsGroup } from '../types/hypixel/Dungeon'
import { PlayerClassExperience } from '../types/hypixel/PlayerClass'

class DungeonsGenerator extends Generator {
  build(profile: SkyBlockProfile): object | null {
    const dungeonGroups: DungeonGroups = profile.dungeons

    if (!this.hasDungeonData(dungeonGroups)) {
      return null
    }

    return {
      selected_class: dungeonGroups.selected_dungeon_class,
      classes: {
        healer: this.generateClassProperties(dungeonGroups.player_classes.healer),
        mage: this.generateClassProperties(dungeonGroups.player_classes.mage),
        berserker: this.generateClassProperties(dungeonGroups.player_classes.berserk),
        archer: this.generateClassProperties(dungeonGroups.player_classes.archer),
        tank: this.generateClassProperties(dungeonGroups.player_classes.tank),
      },
      types: {
        catacombs: this.buildDungeonTypeProperties(dungeonGroups.dungeon_types.catacombs),
      },
    }
  }

  /**
   * Preforms some checks to ensure the dungeon groups for the current
   * player actually has all the expected data before we proceed
   * with calculating the players dungeon stats.
   *
   * @param dungeons The dungeon groups that should be checked
   */
  hasDungeonData(dungeons: DungeonGroups): boolean {
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
   * @param dungeon The dungeon type that the properties should be built for
   */
  buildDungeonTypeProperties(dungeon: Dungeon) {
    const dungeonResult = {
      level: this.calculateLevel(dungeon.experience),
      experience: dungeon.experience,
      highest_tier_completed: dungeon.highest_tier_completed,
      times_played: this.formatDungeonStatsGroup(dungeon.times_played),
      tier_completions: this.formatDungeonStatsGroup(dungeon.tier_completions),
      best_score: this.formatDungeonStatsGroup(dungeon.best_score),
      fastest_time: this.formatDungeonStatsGroup(dungeon.fastest_time),
      fastest_time_s_plus: this.formatDungeonStatsGroup(dungeon.fastest_time_s_plus),
      mobs_killed: this.formatDungeonStatsGroup(dungeon.mobs_killed),
      most_mobs_killed: this.formatDungeonStatsGroup(dungeon.most_mobs_killed),
    }

    dungeonResult.best_score = this.formatDungeonScores(dungeonResult.best_score)
    dungeonResult.fastest_time = this.formatDungeonsTime(dungeonResult.fastest_time)
    dungeonResult.fastest_time_s_plus = this.formatDungeonsTime(dungeonResult.fastest_time_s_plus)

    return dungeonResult
  }

  /**
   * Formats the given dungeon stats group into a more human friendly format.
   *
   * @param group The dungeon stats group that should be formatted
   */
  formatDungeonStatsGroup(group: DungeonStatsGroup): DungeonStatsGroup {
    let result: DungeonStatsGroup = {}

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
  formatDungeonScores(scores: any): any {
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
  formatDungeonsTime(times: any): any {
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
   * Generates the class level and experience for the given player class.
   *
   * @param playerClass The player class that should be generated
   */
  generateClassProperties(playerClass: PlayerClassExperience) {
    const experience = playerClass.experience || 0

    return {
      level: this.calculateLevel(experience),
      experience: experience,
    }
  }

  /**
   * Calculates a dungeon level using the given experience.
   *
   * @param experience The experience that should be calculated to a level
   */
  calculateLevel(experience: number) {
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
}

export default new DungeonsGenerator()
