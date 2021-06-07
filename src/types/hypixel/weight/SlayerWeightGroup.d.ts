export default interface SlayerWeightGroup {
  [name: string]: SlayerWeightGroupEntry

  revenant: SlayerWeightGroupEntry
  tarantula: SlayerWeightGroupEntry
  sven: SlayerWeightGroupEntry
  enderman: SlayerWeightGroupEntry
}

interface SlayerWeightGroupEntry {
  divider: number
  modifier: number
}
