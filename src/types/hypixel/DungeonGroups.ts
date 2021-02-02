import DungeonTypes from './DungeonTypes'
import PlayerClass from './DungeonPlayerClass'

export default interface DungeonGroups {
  selected_dungeon_class: string

  player_classes: PlayerClass
  dungeon_types: DungeonTypes
}
