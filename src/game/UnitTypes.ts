export enum Race {
    TERRAN,
    ZERG,
    PROTOSS
}

export enum UnitType {
    // 테란 유닛
    MARINE,
    FIREBAT,
    GHOST,
    MEDIC,
    
    // 저그 유닛
    ZERGLING,
    HYDRALISK,
    MUTALISK,
    
    // 프로토스 유닛
    ZEALOT,
    DRAGOON,
    HIGH_TEMPLAR
}

export interface UnitStats {
    health: number;
    damage: number;
    speed: number;
    range: number;
    cost: number;
    buildTime: number;
    special?: string;
}

export const UNIT_STATS: Record<UnitType, UnitStats> = {
    // 테란 유닛
    [UnitType.MARINE]: {
        health: 40,
        damage: 6,
        speed: 2.5,
        range: 4,
        cost: 50,
        buildTime: 24
    },
    [UnitType.FIREBAT]: {
        health: 50,
        damage: 8,
        speed: 2.2,
        range: 2,
        cost: 75,
        buildTime: 24,
        special: 'splash'
    },
    [UnitType.GHOST]: {
        health: 45,
        damage: 10,
        speed: 2.8,
        range: 6,
        cost: 100,
        buildTime: 32,
        special: 'cloak'
    },
    [UnitType.MEDIC]: {
        health: 60,
        damage: 0,
        speed: 2.5,
        range: 2,
        cost: 75,
        buildTime: 30,
        special: 'heal'
    },
    
    // 저그 유닛
    [UnitType.ZERGLING]: {
        health: 35,
        damage: 5,
        speed: 3.5,
        range: 1,
        cost: 25,
        buildTime: 20
    },
    [UnitType.HYDRALISK]: {
        health: 80,
        damage: 10,
        speed: 2.3,
        range: 4,
        cost: 75,
        buildTime: 28
    },
    [UnitType.MUTALISK]: {
        health: 120,
        damage: 9,
        speed: 4,
        range: 3,
        cost: 100,
        buildTime: 33,
        special: 'flying'
    },
    
    // 프로토스 유닛
    [UnitType.ZEALOT]: {
        health: 100,
        damage: 8,
        speed: 2.7,
        range: 1,
        cost: 100,
        buildTime: 27,
        special: 'shields'
    },
    [UnitType.DRAGOON]: {
        health: 100,
        damage: 20,
        speed: 2.4,
        range: 4,
        cost: 125,
        buildTime: 35,
        special: 'shields'
    },
    [UnitType.HIGH_TEMPLAR]: {
        health: 40,
        damage: 0,
        speed: 2,
        range: 6,
        cost: 150,
        buildTime: 50,
        special: 'psionic'
    }
}; 