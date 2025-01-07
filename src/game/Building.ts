import { Unit } from './Unit';
import { UnitType } from './UnitTypes';
import { Race } from './UnitTypes';
import { Game } from './Game';

export enum BuildingType {
    // 테란 건물
    COMMAND_CENTER,
    BARRACKS,
    FACTORY,
    STARPORT,
    ACADEMY,
    
    // 저그 건물
    HATCHERY,
    SPAWNING_POOL,
    HYDRALISK_DEN,
    SPIRE,
    
    // 프로토스 건물
    NEXUS,
    GATEWAY,
    CYBERNETICS_CORE,
    TEMPLAR_ARCHIVES
}

export interface BuildingStats {
    health: number;
    buildTime: number;
    mineralCost: number;
    gasCost: number;
    size: { width: number; height: number };
    race: Race;
    special?: string;
}

export const BUILDING_STATS: Record<BuildingType, BuildingStats> = {
    // 테란 건물
    [BuildingType.COMMAND_CENTER]: {
        health: 1500,
        buildTime: 120,
        mineralCost: 400,
        gasCost: 0,
        size: { width: 4, height: 3 },
        race: Race.TERRAN
    },
    [BuildingType.BARRACKS]: {
        health: 1000,
        buildTime: 80,
        mineralCost: 150,
        gasCost: 0,
        size: { width: 3, height: 2 },
        race: Race.TERRAN
    },
    [BuildingType.FACTORY]: {
        health: 1250,
        buildTime: 100,
        mineralCost: 200,
        gasCost: 100,
        size: { width: 3, height: 2 },
        race: Race.TERRAN
    },
    [BuildingType.STARPORT]: {
        health: 1300,
        buildTime: 100,
        mineralCost: 150,
        gasCost: 100,
        size: { width: 3, height: 2 },
        race: Race.TERRAN
    },
    [BuildingType.ACADEMY]: {
        health: 600,
        buildTime: 80,
        mineralCost: 150,
        gasCost: 0,
        size: { width: 2, height: 2 },
        race: Race.TERRAN
    },
    
    // 저그 건물
    [BuildingType.HATCHERY]: {
        health: 1500,
        buildTime: 120,
        mineralCost: 300,
        gasCost: 0,
        size: { width: 4, height: 3 },
        race: Race.ZERG
    },
    [BuildingType.SPAWNING_POOL]: {
        health: 750,
        buildTime: 65,
        mineralCost: 200,
        gasCost: 0,
        size: { width: 2, height: 2 },
        race: Race.ZERG
    },
    [BuildingType.HYDRALISK_DEN]: {
        health: 850,
        buildTime: 80,
        mineralCost: 100,
        gasCost: 50,
        size: { width: 2, height: 2 },
        race: Race.ZERG
    },
    [BuildingType.SPIRE]: {
        health: 600,
        buildTime: 120,
        mineralCost: 200,
        gasCost: 150,
        size: { width: 2, height: 2 },
        race: Race.ZERG
    },
    
    // 프로토스 건물
    [BuildingType.NEXUS]: {
        health: 750,
        buildTime: 120,
        mineralCost: 400,
        gasCost: 0,
        size: { width: 4, height: 3 },
        race: Race.PROTOSS,
        special: 'shields'
    },
    [BuildingType.GATEWAY]: {
        health: 500,
        buildTime: 65,
        mineralCost: 150,
        gasCost: 0,
        size: { width: 3, height: 2 },
        race: Race.PROTOSS,
        special: 'shields'
    },
    [BuildingType.CYBERNETICS_CORE]: {
        health: 500,
        buildTime: 90,
        mineralCost: 200,
        gasCost: 0,
        size: { width: 2, height: 2 },
        race: Race.PROTOSS,
        special: 'shields'
    },
    [BuildingType.TEMPLAR_ARCHIVES]: {
        health: 500,
        buildTime: 150,
        mineralCost: 150,
        gasCost: 200,
        size: { width: 2, height: 2 },
        race: Race.PROTOSS,
        special: 'shields'
    }
};

export class Building {
    private x: number;
    private y: number;
    private type: BuildingType;
    private health: number;
    private maxHealth: number;
    private constructionProgress: number;
    private productionQueue: UnitType[];
    private productionProgress: number;
    private game: Game;

    constructor(type: BuildingType, x: number, y: number, game: Game) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.game = game;
        this.maxHealth = BUILDING_STATS[type].health;
        this.health = this.maxHealth;
        this.constructionProgress = 0;
        this.productionQueue = [];
        this.productionProgress = 0;
    }

    public update(): Unit | null {
        if (!this.isConstructed()) {
            this.constructionProgress++;
            return null;
        }

        if (this.productionQueue.length > 0) {
            this.productionProgress++;
            if (this.productionProgress >= 50) { // 유닛 생산 시간
                this.productionProgress = 0;
                const unitType = this.productionQueue.shift()!;
                return new Unit(unitType, this.x + 64, this.y + 64, this.game);
            }
        }

        return null;
    }

    public queueUnit(unitType: UnitType): boolean {
        if (this.canProduceUnit(unitType)) {
            this.productionQueue.push(unitType);
            return true;
        }
        return false;
    }

    private canProduceUnit(unitType: UnitType): boolean {
        // 건물 타입에 따라 생산 가능한 유닛 체크
        switch (this.type) {
            case BuildingType.BARRACKS:
                return unitType === UnitType.MARINE;
            case BuildingType.HATCHERY:
                return unitType === UnitType.ZERGLING;
            case BuildingType.GATEWAY:
                return unitType === UnitType.ZEALOT;
            default:
                return false;
        }
    }

    public isConstructed(): boolean {
        return this.constructionProgress >= BUILDING_STATS[this.type].buildTime;
    }

    public takeDamage(amount: number): void {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
    }

    public isAlive(): boolean {
        return this.health > 0;
    }

    public getPosition(): { x: number, y: number } {
        return { x: this.x, y: this.y };
    }

    public getSize(): { width: number, height: number } {
        return BUILDING_STATS[this.type].size;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        const size = this.getSize();
        const width = size.width * 32;
        const height = size.height * 32;

        // 건물 본체
        ctx.fillStyle = this.isConstructed() ? '#444' : '#666';
        ctx.fillRect(this.x, this.y, width, height);

        // 건설/생산 진행 상태 바
        if (!this.isConstructed()) {
            const progress = this.constructionProgress / BUILDING_STATS[this.type].buildTime;
            ctx.fillStyle = 'yellow';
            ctx.fillRect(this.x, this.y - 10, width * progress, 5);
        } else if (this.productionQueue.length > 0) {
            const progress = this.productionProgress / 50;
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x, this.y - 10, width * progress, 5);
        }

        // 체력바
        const healthPercentage = this.health / this.maxHealth;
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - 20, width, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y - 20, width * healthPercentage, 5);
    }
} 