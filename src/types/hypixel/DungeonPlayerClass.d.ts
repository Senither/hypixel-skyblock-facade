export default interface DungeonPlayerClass {
  [name: string]: PlayerClassExperience

  healer: PlayerClassExperience
  mage: PlayerClassExperience
  berserk: PlayerClassExperience
  archer: PlayerClassExperience
  tank: PlayerClassExperience
}

interface PlayerClassExperience {
  experience?: number
}
