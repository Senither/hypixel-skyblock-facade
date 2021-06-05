/**
 * The list of pet items is very kindly provided by SkyCryptWebsite on github,
 * all credit goes to them for curating the list of pet items, the original
 * list of items have been slightly altered to remove Minecraft colours.
 *
 * @see https://github.com/SkyCryptWebsite/SkyCrypt/blob/master/src/constants/pets.js
 */

import { PetItemGroup } from '../types/hypixel'

const symbols = {
    health: '❤',
    defense: '❈',
    strength: '❁',
    crit_chance: '☣',
    crit_damage: '☠',
    intelligence: '✎',
    speed: '✦',
    sea_creature_chance: 'α',
    magic_find: '✯',
    pet_luck: '♣',
    attack_speed: '⚔️',
    true_defense: '❂',
    ferocity: '⫽',
}

export const PetItems: PetItemGroup = {
    PET_ITEM_ALL_SKILLS_BOOST_COMMON: {
        name: 'All Skills Exp Boost',
        tier: 'COMMON',
        description: 'Gives +10% pet exp for all skills'
    },
    PET_ITEM_BIG_TEETH_COMMON: {
        name: 'Big Teeth',
        tier: 'COMMON',
        description: `Increases ${symbols.crit_chance} Crit Chance by 5`,
        stats: {
            crit_chance: 5
        }
    },
    PET_ITEM_IRON_CLAWS_COMMON: {
        name: 'Iron Claws',
        tier: 'COMMON',
        description: `Increases the pet's ${symbols.crit_damage} Crit Damage by 40% and ${symbols.crit_chance} Crit Chance by 40%`,
        multStats: {
            crit_chance: 1.4,
            crit_damage: 1.4
        }
    },
    PET_ITEM_SHARPENED_CLAWS_UNCOMMON: {
        name: 'Sharpened Claws',
        tier: 'UNCOMMON',
        description: `Increases ${symbols.crit_damage} Crit Damage by 15`,
        stats: {
            crit_damage: 15
        }
    },
    PET_ITEM_HARDENED_SCALES_UNCOMMON: {
        name: 'Hardened Scales',
        tier: 'UNCOMMON',
        description: `Increases ${symbols.defense} Defense by 25`,
        stats: {
            defense: 25
        }
    },
    PET_ITEM_BUBBLEGUM: {
        name: 'Bubblegum',
        tier: 'RARE',
        description: 'Your pet fuses its power with placed Orbs to give them 2x duration'
    },
    PET_ITEM_LUCKY_CLOVER: {
        name: 'Lucky Clover',
        tier: 'EPIC',
        description: `Increases ${symbols.magic_find} Magic Find by 7`,
        stats: {
            magic_find: 7
        }
    },
    PET_ITEM_TEXTBOOK: {
        name: 'Textbook',
        tier: 'LEGENDARY',
        description: `Increases the pet's ${symbols.intelligence} Intelligence by 100%`,
        multStats: {
            intelligence: 2
        }
    },
    PET_ITEM_SADDLE: {
        name: 'Saddle',
        tier: 'UNCOMMON',
        description: 'Increase horse speed by 50%  and jump boost by 100%'
    },
    PET_ITEM_EXP_SHARE: {
        name: 'Exp Share',
        tier: 'EPIC',
        description: 'While unequipped this pet gains 25% of the equipped pet\'s xp, this is split between all pets holding the item.'
    },
    PET_ITEM_TIER_BOOST: {
        name: 'Tier Boost',
        tier: 'LEGENDARY',
        description: 'Boosts the rarity of your pet by 1 tier!'
    },
    PET_ITEM_COMBAT_SKILL_BOOST_COMMON: {
        name: 'Combat Exp Boost',
        tier: 'COMMON',
        description: 'Gives +20% pet exp for Combat'
    },
    PET_ITEM_COMBAT_SKILL_BOOST_UNCOMMON: {
        name: 'Combat Exp Boost',
        tier: 'UNCOMMON',
        description: 'Gives +30% pet exp for Combat'
    },
    PET_ITEM_COMBAT_SKILL_BOOST_RARE: {
        name: 'Combat Exp Boost',
        tier: 'RARE',
        description: 'Gives +40% pet exp for Combat'
    },
    PET_ITEM_COMBAT_SKILL_BOOST_EPIC: {
        name: 'Combat Exp Boost',
        tier: 'EPIC',
        description: 'Gives +50% pet exp for Combat'
    },
    PET_ITEM_FISHING_SKILL_BOOST_COMMON: {
        name: 'Fishing Exp Boost',
        tier: 'COMMON',
        description: 'Gives +20% pet exp for Fishing'
    },
    PET_ITEM_FISHING_SKILL_BOOST_UNCOMMON: {
        name: 'Fishing Exp Boost',
        tier: 'UNCOMMON',
        description: 'Gives +30% pet exp for Fishing'
    },
    PET_ITEM_FISHING_SKILL_BOOST_RARE: {
        name: 'Fishing Exp Boost',
        tier: 'RARE',
        description: 'Gives +40% pet exp for Fishing'
    },
    PET_ITEM_FISHING_SKILL_BOOST_EPIC: {
        name: 'Fishing Exp Boost',
        tier: 'EPIC',
        description: 'Gives +50% pet exp for Fishing'
    },
    PET_ITEM_FORAGING_SKILL_BOOST_COMMON: {
        name: 'Foraging Exp Boost',
        tier: 'COMMON',
        description: 'Gives +20% pet exp for Foraging'
    },
    PET_ITEM_FORAGING_SKILL_BOOST_UNCOMMON: {
        name: 'Foraging Exp Boost',
        tier: 'UNCOMMON',
        description: 'Gives +30% pet exp for Foraging'
    },
    PET_ITEM_FORAGING_SKILL_BOOST_RARE: {
        name: 'Foraging Exp Boost',
        tier: 'RARE',
        description: 'Gives +40% pet exp for Foraging'
    },
    PET_ITEM_FORAGING_SKILL_BOOST_EPIC: {
        name: 'Foraging Exp Boost',
        tier: 'EPIC',
        description: 'Gives +50% pet exp for Foraging'
    },
    PET_ITEM_MINING_SKILL_BOOST_COMMON: {
        name: 'Mining Exp Boost',
        tier: 'COMMON',
        description: 'Gives +20% pet exp for Mining'
    },
    PET_ITEM_MINING_SKILL_BOOST_UNCOMMON: {
        name: 'Mining Exp Boost',
        tier: 'UNCOMMON',
        description: 'Gives +30% pet exp for Mining'
    },
    PET_ITEM_MINING_SKILL_BOOST_RARE: {
        name: 'Mining Exp Boost',
        tier: 'RARE',
        description: 'Gives +40% pet exp for Mining'
    },
    PET_ITEM_MINING_SKILL_BOOST_EPIC: {
        name: 'Mining Exp Boost',
        tier: 'EPIC',
        description: 'Gives +50% pet exp for Mining'
    },
    PET_ITEM_FARMING_SKILL_BOOST_COMMON: {
        name: 'Farming Exp Boost',
        tier: 'COMMON',
        description: 'Gives +20% pet exp for Farming'
    },
    PET_ITEM_FARMING_SKILL_BOOST_UNCOMMON: {
        name: 'Farming Exp Boost',
        tier: 'UNCOMMON',
        description: 'Gives +30% pet exp for Farming'
    },
    PET_ITEM_FARMING_SKILL_BOOST_RARE: {
        name: 'Farming Exp Boost',
        tier: 'RARE',
        description: 'Gives +40% pet exp for Farming'
    },
    PET_ITEM_FARMING_SKILL_BOOST_EPIC: {
        name: 'Farming Exp Boost',
        tier: 'EPIC',
        description: 'Gives +50% pet exp for Farming'
    },
    // new pet items from 0.9 update yay
    REINFORCED_SCALES: {
        name: 'Reinforced Scales',
        tier: 'RARE',
        description: `Increases ${symbols.defense} Defense by 40`,
        stats: {
            defense: 40
        }
    },
    GOLD_CLAWS: {
        name: 'Gold Claws',
        tier: 'UNCOMMON',
        description: `Increases the pet's ${symbols.crit_damage} Crit Damage by 50% and ${symbols.crit_chance} Crit Chance by 50%`,
        multStats: {
            crit_chance: 1.5,
            crit_damage: 1.5
        }
    },
    ALL_SKILLS_SUPER_BOOST: {
        name: 'All Skills Exp Super-Boost',
        tier: 'COMMON',
        description: 'Gives +20% pet exp for all skills'
    },
    BIGGER_TEETH: {
        name: 'Bigger Teeth',
        tier: 'UNCOMMON',
        description: `Increases ${symbols.crit_chance} Crit Chance by 10`,
        stats: {
            crit_chance: 10
        }
    },
    SERRATED_CLAWS: {
        name: 'Serrated Claws',
        tier: 'RARE',
        description: `Increases ${symbols.crit_damage} Crit Damage by 25`,
        stats: {
            crit_damage: 25
        }
    },
    WASHED_UP_SOUVENIR: {
        name: 'Washed-up Souvenir',
        tier: 'LEGENDARY',
        description: `Increases ${symbols.sea_creature_chance} Sea Creature Chance by 5`,
        stats: {
            sea_creature_chance: 5
        }
    },
    ANTIQUE_REMEDIES: {
        name: 'Antique Remedies',
        tier: 'EPIC',
        description: `Increases the pet's ${symbols.strength} Strength by 80%`,
        multStats: {
            strength: 1.8
        }
    },
    CROCHET_TIGER_PLUSHIE: {
        name: 'Crochet Tiger Plushie',
        tier: 'EPIC',
        description: `Increases ${symbols.attack_speed} Bonus Attack Speed by 35`,
        stats: {
            bonus_attack_speed: 35
        }
    },
    DWARF_TURTLE_SHELMET: {
        name: 'Dwarf Turtle Shelmet',
        tier: 'RARE',
        description: `Makes the pet's owner immune to knockback.`
    },
    PET_ITEM_VAMPIRE_FANG: {
        name: 'Vampire Fang',
        tier: 'LEGENDARY',
        description: 'Upgrades a Bat pet from Legendary to Mythic adding a bonus perk and bonus stats!'
    },
    PET_ITEM_SPOOKY_CUPCAKE: {
        name: 'Spooky Cupcake',
        tier: 'UNCOMMON',
        description: `Increases ${symbols.strength} Strength by 30 and ${symbols.speed} Speed by 20`,
        stats: {
            strength: 30,
            speed: 20
        }
    },
    MINOS_RELIC: {
        name: 'Minos Relic',
        tier: 'EPIC',
        description: `Increases all pet stats by 33.3%`,
        multAllStats: 1.333,
    },
    PET_ITEM_TOY_JERRY: {
        name: 'Jerry 3D Glasses',
        tier: 'LEGENDARY',
        description: 'Upgrades a Jerry pet from Legendary to Mythic and granting it a new perk!'
    },
    REAPER_GEM: {
        name: 'Reaper Gem',
        tier: 'LEGENDARY',
        description: `Gain 8${symbols.ferocity} Ferocity for 5s on kill`
    },
    PET_ITEM_FLYING_PIG: {
        name: 'Flying Pig',
        tier: 'UNCOMMON',
        description: `Grants your pig pet the ability to fly while on your private island! You also don't need to hold a carrot on a stick to control your pig.`
    },
}
