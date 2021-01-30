import Generator from '../contracts/Generator'
import { GeneralSkillsExperience, RunecraftingSkillsExperience } from '../constants'
import { SkyBlockProfile } from '../types/hypixel'

class SkillsGenerator extends Generator {
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

    let skills = {
      average_skills: 0,
      mining: this.calculateSkillProperties(mining, GeneralSkillsExperience, 60),
      foraging: this.calculateSkillProperties(foraging, GeneralSkillsExperience, 50),
      enchanting: this.calculateSkillProperties(enchanting, GeneralSkillsExperience, 60),
      farming: this.calculateSkillProperties(farming, GeneralSkillsExperience, 60),
      combat: this.calculateSkillProperties(combat, GeneralSkillsExperience, 50),
      fishing: this.calculateSkillProperties(fishing, GeneralSkillsExperience, 50),
      alchemy: this.calculateSkillProperties(alchemy, GeneralSkillsExperience, 50),
      taming: this.calculateSkillProperties(taming, GeneralSkillsExperience, 50),
      carpentry: this.calculateSkillProperties(carpentry, GeneralSkillsExperience, 50),
      runecrafting: this.calculateSkillProperties(runecrafting, RunecraftingSkillsExperience, 25),
    }

    skills.average_skills = this.calculateSkillAverage(skills)

    return skills
  }

  /**
   * Creates the skill properties object for the given skill
   * experience, experience group, and the max level.
   *
   * @param experience The skill experience
   * @param experienceGroup The skill experience group used to calculate the level
   * @param maxLevel The max level the skill can be
   */
  calculateSkillProperties(experience: number, experienceGroup: number[], maxLevel: number) {
    return {
      level: this.calculateSkillLevel(experience, experienceGroup, maxLevel),
      experience: experience,
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
  calculateSkillLevel(experience: number, experienceGroup: number[], maxLevel: number) {
    let level = 0

    for (let toRemove of experienceGroup) {
      experience -= toRemove
      if (experience < 0) {
        return level + (1 - (experience * -1) / toRemove)
      }
      level++
    }

    return Math.min(level, maxLevel)
  }

  /**
   * Calculates the skill average using the skills
   * object created in the builds method.
   *
   * @param skills The skills object generated in the build method
   */
  calculateSkillAverage(skills: any): number {
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
}

export default new SkillsGenerator()
