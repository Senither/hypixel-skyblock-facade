import Generator from '../contracts/Generator'
import { GeneralSkillsExperience, RunecraftingSkillsExperience } from '../constants'
import { PlayerStats, SkillWeightEntity, SkillWeightGroup, SkyBlockProfile } from '../types/hypixel'
import { SkyBlockSkillGroupResponse } from '../types/hypixel/SkyBlockProfileStats'

class SkillsGenerator extends Generator {
  /**
   * The experience required to reach level 50 in any skill.
   *
   * @type number
   */
  private level50SkillExp: number = 55172425

  /**
   * The experience required to reach level 60 in any skill.
   *
   * @type number
   */
  private level60SkillExp: number = 111672425

  /**
   * The skill weight exponents and dividers, these values are
   * used to calculate a skills weight, the divider value is
   * only used for calculating a skills overflow value.
   *
   * @type object
   */
  private skillGroups: SkillWeightGroup = {
    // Maxes out mining at 1,750 points at 60.
    mining: {
      exponent: 1.18207448,
      divider: 259634,
      maxLevel: 60,
    },
    // Maxes out foraging at 850 points at level 50.
    foraging: {
      exponent: 1.232826,
      divider: 259634,
      maxLevel: 50,
    },
    // Maxes out enchanting at 450 points at level 60.
    enchanting: {
      exponent: 0.96976583,
      divider: 882758,
      maxLevel: 60,
    },
    // Maxes out farming at 2,200 points at level 60.
    farming: {
      exponent: 1.217848139,
      divider: 220689,
      maxLevel: 60,
    },
    // Maxes out combat at 1,500 points at level 60.
    combat: {
      exponent: 1.15797687265,
      divider: 275862,
      maxLevel: 60,
    },
    // Maxes out fishing at 2,500 points at level 50.
    fishing: {
      exponent: 1.406418,
      divider: 88274,
      maxLevel: 50,
    },
    // Maxes out alchemy at 200 points at level 50.
    alchemy: {
      exponent: 1.0,
      divider: 1103448,
      maxLevel: 50,
    },
    // Maxes out taming at 500 points at level 50.
    taming: {
      exponent: 1.14744,
      divider: 441379,
      maxLevel: 50,
    },
    // Sets up carpentry and runecrafting without any weight components.
    carpentry: {
      maxLevel: 50,
    },
    runecrafting: {
      maxLevel: 25,
    },
  }

  /**
   * A list of all the skills that has weight associated with them.
   *
   * @type string[]
   */
  private weightSkills: string[] = ['mining', 'foraging', 'enchanting', 'farming', 'combat', 'fishing', 'alchemy', 'taming']

  build(player: PlayerStats, profile: SkyBlockProfile): SkyBlockSkillGroupResponse | null {
    let usingAchievements = false

    let experiences = {
      mining: profile.experience_skill_mining || 0,
      foraging: profile.experience_skill_foraging || 0,
      enchanting: profile.experience_skill_enchanting || 0,
      farming: profile.experience_skill_farming || 0,
      combat: profile.experience_skill_combat || 0,
      fishing: profile.experience_skill_fishing || 0,
      alchemy: profile.experience_skill_alchemy || 0,
      taming: profile.experience_skill_taming || 0,
      carpentry: profile.experience_skill_carpentry || 0,
      runecrafting: profile.experience_skill_runecrafting || 0,
    }

    // Checks if the player has any experience, if no experience is found
    // for the main skills we can assume the player has their skill
    // API disabled, and can instead return null.
    if (this.sumExperienceGroup(experiences) == 0) {
      usingAchievements = true

      experiences = {
        mining: this.getExperienceFromLevel(player.skyblockSkills.mining),
        foraging: this.getExperienceFromLevel(player.skyblockSkills.foraging),
        enchanting: this.getExperienceFromLevel(player.skyblockSkills.enchanting),
        farming: this.getExperienceFromLevel(player.skyblockSkills.farming),
        combat: this.getExperienceFromLevel(player.skyblockSkills.combat),
        fishing: this.getExperienceFromLevel(player.skyblockSkills.fishing),
        alchemy: this.getExperienceFromLevel(player.skyblockSkills.alchemy),
        taming: this.getExperienceFromLevel(player.skyblockSkills.taming),
        carpentry: 0,
        runecrafting: 0,
      }

      if (this.sumExperienceGroup(experiences) == 0) {
        return null
      }
    }

    let skills: any = {
      apiEnabled: !usingAchievements,
      average_skills: 0,
      weight: 0,
      weight_overflow: 0,
      mining: this.calculateSkillProperties('mining', experiences.mining),
      foraging: this.calculateSkillProperties('foraging', experiences.foraging),
      enchanting: this.calculateSkillProperties('enchanting', experiences.enchanting),
      farming: this.calculateSkillProperties('farming', experiences.farming),
      combat: this.calculateSkillProperties('combat', experiences.combat),
      fishing: this.calculateSkillProperties('fishing', experiences.fishing),
      alchemy: this.calculateSkillProperties('alchemy', experiences.alchemy),
      taming: this.calculateSkillProperties('taming', experiences.taming),
      carpentry: this.calculateSkillProperties('carpentry', experiences.carpentry),
      runecrafting: this.calculateSkillProperties('runecrafting', experiences.runecrafting),
    }

    skills.average_skills = this.calculateSkillAverage(skills)

    skills.weight = this.sumWeights(skills, 'weight')
    skills.weight_overflow = this.sumWeights(skills, 'weight_overflow')

    return skills
  }

  /**
   * Creates the skill properties object for the given skill type and experience.
   *
   * @param type The skill type that should be calculated
   * @param experience The skill experience
   */
  private calculateSkillProperties(type: string, experience: number) {
    const skillGroup: SkillWeightEntity = this.skillGroups[type]
    const experienceGroup: number[] = type == 'runecrafting' ? RunecraftingSkillsExperience : GeneralSkillsExperience

    const level = this.calculateSkillLevel(experience, experienceGroup, skillGroup.maxLevel)

    return {
      level: level,
      experience: experience,
      ...this.calculateSkillWeight(skillGroup, level, experience),
    }
  }

  /**
   * Calculates the skills level based off the skill experience,
   * experience group, and the max level.
   *
   * @param experience The skill experience
   * @param experienceGroup The skill experience group used to calculate the level
   * @param maxLevel The max level the skill can be
   */
  private calculateSkillLevel(experience: number, experienceGroup: number[], maxLevel: number) {
    let level = 0

    for (let toRemove of experienceGroup) {
      experience -= toRemove
      if (experience < 0) {
        return Math.min(level + (1 - (experience * -1) / toRemove), maxLevel)
      }
      level++
    }

    return Math.min(level, maxLevel)
  }

  /**
   * Calculates the weight for the given skill group using the given level and experience.
   *
   * @param skillGroup The skill group that should be used to calculate the weight
   * @param level The level of the current skill
   * @param experience The total amount of experience in the current skill
   */
  private calculateSkillWeight(skillGroup: SkillWeightEntity, level: number, experience: number) {
    if (skillGroup.exponent == undefined || skillGroup.divider == undefined) {
      return {
        weight: 0,
        weight_overflow: 0,
      }
    }

    // Gets the XP required to max out the skill.
    let maxSkillLevelXP = skillGroup.maxLevel == 60 ? this.level60SkillExp : this.level50SkillExp

    // Calculates the base weight using the players level, if the players level
    // is 50/60 we'll round off their weight to get a nicer looking number.
    let base = Math.pow(level * 10, 0.5 + skillGroup.exponent + level / 100) / 1250
    if (experience > maxSkillLevelXP) {
      base = Math.round(base)
    }

    // If the skill XP is below the requirements for a level 50/60 skill we'll
    // just return our weight to the weight object builder right away.
    if (experience <= maxSkillLevelXP) {
      return {
        weight: base,
        weight_overflow: 0,
      }
    }

    // Calculates the skill overflow weight and returns it to the weight object builder.
    return {
      weight: base,
      weight_overflow: Math.pow((experience - maxSkillLevelXP) / skillGroup.divider, 0.968),
    }
  }

  /**
   * Calculates the skill average using the skills
   * object created in the builds method.
   *
   * @param skills The skills object generated in the build method
   */
  private calculateSkillAverage(skills: any): number {
    return (
      (skills.mining.level +
        skills.foraging.level +
        skills.enchanting.level +
        skills.farming.level +
        skills.combat.level +
        skills.fishing.level +
        skills.alchemy.level +
        skills.taming.level) /
      8
    )
  }

  /**
   * Sums up the given weight type using the given skills object.
   *
   * @param skills The skills object that contains already calculated weights
   * @param type The type of weight that should be summed up
   */
  private sumWeights(skills: any, type: string): number {
    return this.weightSkills
      .map(v => {
        return skills[v][type]
      })
      .reduce((accumulator, current) => accumulator + current)
  }

  /**
   * Sums up all the values in the given experience group object.
   *
   * @param experienceGroup The experience group object
   */
  private sumExperienceGroup(experienceGroup: any): number {
    let total = 0

    for (let name of Object.keys(experienceGroup)) {
      total += experienceGroup[name]
    }

    return total
  }

  /**
   * Gets the total amount experience required to get the given level.
   *
   * @param level The level of the skill
   */
  private getExperienceFromLevel(level: number): number {
    let totalRequiredExperience = 0
    for (let i = 0; i < Math.min(level, GeneralSkillsExperience.length); i++) {
      totalRequiredExperience += GeneralSkillsExperience[i]
    }
    return totalRequiredExperience
  }
}

export default new SkillsGenerator()
