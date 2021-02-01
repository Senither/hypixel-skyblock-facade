import SkillWeightEntity from './SkillWeightEntity'

export default interface SkillWeightGroup {
  [name: string]: SkillWeightEntity

  mining: SkillWeightEntity
  foraging: SkillWeightEntity
  enchanting: SkillWeightEntity
  farming: SkillWeightEntity
  combat: SkillWeightEntity
  fishing: SkillWeightEntity
  alchemy: SkillWeightEntity
  taming: SkillWeightEntity
  carpentry: SkillWeightEntity
  runecrafting: SkillWeightEntity
}
