import Generator from '../contracts/Generator'
import { GeneralSkillsExperience, RunecraftingSkillsExperience } from '../constants'
import { SkillWeightEntity, SkillWeightGroup, SkyBlockProfile } from '../types/hypixel'

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
    // Maxes out combat at 800 points at level 50.
    combat: {
      exponent: 1.22307,
      divider: 275862,
      maxLevel: 50,
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

  build(profile: SkyBlockProfile): object | null {
    const mining = profile.experience_skill_mining || 0
    const foraging = profile.experience_skill_foraging || 0
    const enchanting = profile.experience_skill_enchanting || 0
    const farming = profile.experience_skill_farming || 0
    const combat = profile.experience_skill_combat || 0
    const fishing = profile.experience_skill_fishing || 0
    const alchemy = profile.experience_skill_alchemy || 0
    const taming = profile.experience_skill_taming || 0

    // Checks if the player has any experience, if no experience is found
    // for the main skills we can assume the player has their skill
    // API disabled, and can instead return null.
    if (mining + foraging + enchanting + farming + combat + fishing + alchemy + taming == 0) {
      return null
    }

    const carpentry = profile.experience_skill_carpentry || 0
    const runecrafting = profile.experience_skill_runecrafting || 0

    let skills: any = {
      average_skills: 0,
      weight: 0,
      weight_overflow: 0,
      mining: this.calculateSkillProperties('mining', mining),
      foraging: this.calculateSkillProperties('foraging', foraging),
      enchanting: this.calculateSkillProperties('enchanting', enchanting),
      farming: this.calculateSkillProperties('farming', farming),
      combat: this.calculateSkillProperties('combat', combat),
      fishing: this.calculateSkillProperties('fishing', fishing),
      alchemy: this.calculateSkillProperties('alchemy', alchemy),
      taming: this.calculateSkillProperties('taming', taming),
      carpentry: this.calculateSkillProperties('carpentry', carpentry),
      runecrafting: this.calculateSkillProperties('runecrafting', runecrafting),
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
}

export default new SkillsGenerator()
