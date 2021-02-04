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
}
