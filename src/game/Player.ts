import { Unit } from './Unit';
import { Race, UnitType } from './UnitTypes';

interface Resources {
    minerals: number;
    gas: number;
}

export class Player {
    private units: Unit[];
    private race: Race;
    private resources: Resources;

    constructor(race: Race) {
        this.units = [];
        this.race = race;
        this.resources = {
            minerals: 50,
            gas: 0
        };
    }

    public getResources(): Resources {
        return this.resources;
    }

    public addResources(minerals: number, gas: number): void {
        this.resources.minerals += minerals;
        this.resources.gas += gas;
    }

    public canAfford(mineralCost: number, gasCost: number): boolean {
        return this.resources.minerals >= mineralCost && this.resources.gas >= gasCost;
    }

    public spendResources(minerals: number, gas: number): void {
        this.resources.minerals -= minerals;
        this.resources.gas -= gas;
    }

    public createUnit(type: UnitType, x: number, y: number): void {
        const unit = new Unit(type, x, y);
        this.units.push(unit);
    }

    public addUnit(unit: Unit): void {
        this.units.push(unit);
    }

    public removeUnit(unit: Unit): void {
        const index = this.units.indexOf(unit);
        if (index > -1) {
            this.units.splice(index, 1);
        }
    }

    public getUnits(): Unit[] {
        return this.units;
    }

    public getRace(): Race {
        return this.race;
    }

    public update(): void {
        // 죽은 유닛 제거
        this.units = this.units.filter(unit => unit.isAlive());
        
        // 각 유닛 업데이트
        this.units.forEach(unit => unit.update());
    }
} 