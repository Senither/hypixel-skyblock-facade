import Generator from '../contracts/Generator'
import { Pets } from '../types/hypixel/SkyBlockProfileStats'
import { PetGroups, PetItem, PlayerStats, SkyBlockProfile } from '../types/hypixel'
import { PetItems, PetsExperience as experienceGroup } from '../constants'

class PetsGenerator extends Generator {
    /**
     * The pet tier level offsets.
     *
     * @type Object<string, number>
     */
    private levelOffsets: { [key: string]: number } = {
        COMMON: 0,
        UNCOMMON: 6,
        RARE: 11,
        EPIC: 16,
        LEGENDARY: 20,
        MYTHIC: 20,
    }

    build(_: PlayerStats, profile: SkyBlockProfile): Pets[] {
        if (!profile.pets) {
            return []
        }

        let pets: Pets[] = []
        for (let pet of profile.pets) {
            const item: PetItem | string | null = PetItems.hasOwnProperty(pet.heldItem)
                ? PetItems[pet.heldItem]
                : pet.heldItem

            pets.push({
                type: pet.type,
                tier: pet.tier,
                level: this.calculateSkillLevel(pet),
                xp: pet.exp,
                heldItem: item,
                candyUsed: pet.candyUsed,
                active: pet.active,
            })
        }

        return pets
    }

    /**
     * Calculates the level of the given pet.
     *
     * @param pet The pet that should have its level calculated
     * @returns number
     */
    private calculateSkillLevel(pet: PetGroups): number {
        const offset = this.levelOffsets[pet.tier]
        const levels = experienceGroup.slice(offset, offset + 99)

        let level = 1
        let totalExperience = 0

        for (let i = 0; i < 100; i++) {
            totalExperience += levels[i]

            if (totalExperience > pet.exp) {
                totalExperience -= levels[i]
                break
            }

            level++
        }

        if (level >= 100) {
            return Math.min(level, 100)
        }

        const xpCurrent = Math.floor(pet.exp - totalExperience)
        const xpForNext = Math.ceil(levels[level - 1])

        return level + Math.max(0, Math.min(xpCurrent / xpForNext, 1))
    }
}

export default new PetsGenerator()
