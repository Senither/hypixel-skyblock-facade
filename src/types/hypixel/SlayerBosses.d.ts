import Slayer from './Slayer'

export default interface SlayerBosses {
  [boss: string]: Slayer

  zombie: Slayer
  spider: Slayer
  wolf: Slayer
}
