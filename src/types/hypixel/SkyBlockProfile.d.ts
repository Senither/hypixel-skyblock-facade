import SlayerBosses from './SlayerBosses'

export default interface SkyBlockProfile {
  last_save: number
  first_join: number

  experience_skill_mining?: number
  experience_skill_foraging?: number
  experience_skill_enchanting?: number
  experience_skill_farming?: number
  experience_skill_combat?: number
  experience_skill_fishing?: number
  experience_skill_alchemy?: number
  experience_skill_taming?: number
  experience_skill_carpentry?: number
  experience_skill_runecrafting?: number

  slayer_bosses: SlayerBosses
}
