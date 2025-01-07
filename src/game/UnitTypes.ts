export enum Race {
    TERRAN,
    ZERG,
    PROTOSS
}

export enum UnitType {
    MARINE,
    ZERGLING,
    ZEALOT
}

export interface UnitStats {
    health: number;
    damage: number;
    speed: number;
    range: number;
    cost: number;
}

export const UNIT_STATS: Record<UnitType, UnitStats> = {
    [UnitType.MARINE]: {
        health: 40,
        damage: 6,
        speed: 2,
        range: 4,
        cost: 50
    },
    [UnitType.ZERGLING]: {
        health: 35,
        damage: 5,
        speed: 3,
        range: 1,
        cost: 25
    },
    [UnitType.ZEALOT]: {
        health: 100,
        damage: 8,
        speed: 2,
        range: 1,
        cost: 100
    }
}; 