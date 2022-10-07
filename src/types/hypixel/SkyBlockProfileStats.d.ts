import { PetItem } from './PetItems'

export default interface SkyBlockProfileStats {
  id: string
  name: string
  selected: boolean
  weight: number
  weight_overflow: number
  fairy_souls: number
  skills: SkyBlockSkillGroupResponse | null
  slayers: SkyBlockSlayerGroupResponse | null
  dungeons: SkyBlockDungeonGroupResponse | null
  pets: Pets[] | null
  coins: Banking | null
}

interface SkyBlockSkillGroupResponse {
  average_skills: number
  weight: number
  weight_overflow: number
  mining: SkyBlockSkillStatsResponse
  foraging: SkyBlockSkillStatsResponse
  enchanting: SkyBlockSkillStatsResponse
  farming: SkyBlockSkillStatsResponse
  combat: SkyBlockSkillStatsResponse
  fishing: SkyBlockSkillStatsResponse
  alchemy: SkyBlockSkillStatsResponse
  taming: SkyBlockSkillStatsResponse
  carpentry: SkyBlockSkillStatsResponse
  runecrafting: SkyBlockSkillStatsResponse
}

interface SkyBlockSkillStatsResponse {
  level: number
  experience: number
  weight: number
  weight_overflow: number
}

interface SkyBlockSlayerGroupResponse {
  total_coins_spent: number
  total_experience: number
  weight: number
  weight_overflow: number
  bosses: {
    revenant: SkyBlockSlayerStatsResponse
    tarantula: SkyBlockSlayerStatsResponse
    sven: SkyBlockSlayerStatsResponse
    enderman: SkyBlockSlayerStatsResponse
  }
}

interface SkyBlockSlayerStatsResponse {
  level: number
  experience: number
  weight: number
  weight_overflow: number
  kills: {
    tier_1: number
    tier_2: number
    tier_3: number
    tier_4: number
  }
}

interface SkyBlockDungeonGroupResponse {
  selected_class: string
  weight: number
  weight_overflow: number
  classes: {
    healer: SkyBlockDungeonPlayerClassResponse
    mage: SkyBlockDungeonPlayerClassResponse
    berserker: SkyBlockDungeonPlayerClassResponse
    archer: SkyBlockDungeonPlayerClassResponse
    tank: SkyBlockDungeonPlayerClassResponse
  }
  types: {
    catacombs: SkyBlockDungeonGroupEntryResponse
  }
}

interface SkyBlockDungeonGroupEntryResponse {
  level: number
  experience: number
  weight: number
  weight_overflow: number
  highest_tier_completed: number
  times_played: SkyBlockDungeonStatsGroupResponse
  tier_completions: SkyBlockDungeonStatsGroupResponse
  best_score: SkyBlockDungeonScoreGroupResponse
  fastest_time: SkyBlockDungeonTimeGroupResponse
  fastest_time_s_plus: SkyBlockDungeonTimeGroupResponse
  mobs_killed: SkyBlockDungeonStatsGroupResponse
  most_mobs_killed: SkyBlockDungeonStatsGroupResponse

  master_mode: {
    highest_tier_completed: number
    tier_completions: SkyBlockDungeonStatsGroupResponse
    best_score: SkyBlockDungeonScoreGroupResponse
    fastest_time: SkyBlockDungeonTimeGroupResponse
    fastest_time_s_plus: SkyBlockDungeonTimeGroupResponse
    mobs_killed: SkyBlockDungeonStatsGroupResponse
    most_mobs_killed: SkyBlockDungeonStatsGroupResponse
  }
}

interface SkyBlockDungeonPlayerClassResponse {
  level: number
  experience: number
  weight: number
  weight_overflow: number
}

interface SkyBlockDungeonStatsGroupResponse {
  entrance?: number
  tier_1?: number
  tier_2?: number
  tier_3?: number
  tier_4?: number
  tier_5?: number
  tier_6?: number
  tier_7?: number
}

interface SkyBlockDungeonScoreGroupResponse {
  entrance?: SkyBlockDungeonScoresResponse
  tier_1?: SkyBlockDungeonScoresResponse
  tier_2?: SkyBlockDungeonScoresResponse
  tier_3?: SkyBlockDungeonScoresResponse
  tier_4?: SkyBlockDungeonScoresResponse
  tier_5?: SkyBlockDungeonScoresResponse
  tier_6?: SkyBlockDungeonScoresResponse
  tier_7?: SkyBlockDungeonScoresResponse
}

interface SkyBlockDungeonScoresResponse {
  value: number
  score: string
}

interface SkyBlockDungeonTimeGroupResponse {
  entrance?: SkyBlockDungeonTimesResponse
  tier_1?: SkyBlockDungeonTimesResponse
  tier_2?: SkyBlockDungeonTimesResponse
  tier_3?: SkyBlockDungeonTimesResponse
  tier_4?: SkyBlockDungeonTimesResponse
  tier_5?: SkyBlockDungeonTimesResponse
  tier_6?: SkyBlockDungeonTimesResponse
  tier_7?: SkyBlockDungeonTimesResponse
}

interface SkyBlockDungeonTimesResponse {
  time: string
  seconds: number
}

interface Pets {
  type: string
  tier: string
  level: number
  xp: number
  heldItem: PetItem | string | null
  candyUsed: number
  active: boolean
}

interface Banking {
  bank?: number | null
  purse?: number | null
}
