export interface PetItemGroup {
    [key: string]: PetItem,
}

export interface PetItem {
    name: string
    tier: string
    description: string

    stats?: any
    multStats?: any
    multAllStats?: any
}
