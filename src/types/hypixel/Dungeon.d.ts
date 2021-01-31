export default interface Dungeon {
  experience: number
  highest_tier_completed: number

  times_played: DungeonStatsGroup
  tier_completions: DungeonStatsGroup
  best_score: DungeonStatsGroup
  fastest_time_s_plus: DungeonStatsGroup
  fastest_time: DungeonStatsGroup
  mobs_killed: DungeonStatsGroup
  most_mobs_killed: DungeonStatsGroup
}

interface DungeonStatsGroup {
  [level: string]: number
}
