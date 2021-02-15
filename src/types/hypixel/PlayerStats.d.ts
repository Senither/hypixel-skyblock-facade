export default interface PlayerStats {
  username: string
  firstLogin: number
  lastLogin: number
  socialMedia: {
    links?: {
      DISCORD?: string
      TWITTER?: string
      TWITCH?: string
    }
  }
  skyblockSkills: {
    mining: number
    foraging: number
    enchanting: number
    farming: number
    combat: number
    fishing: number
    alchemy: number
    taming: number
  }
  dungeons: {
    secrets_found: number
  }
}
