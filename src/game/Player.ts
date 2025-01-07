import { Unit } from './Unit';
import { Race, UnitType } from './UnitTypes';
import { Building, BuildingType } from './Building';

export class Player {
    private resources: { minerals: number; gas: number };
    private units: Unit[];
    private buildings: Building[];
    private race: Race;

    constructor(race: Race) {
        this.race = race;
        this.resources = { minerals: 1000, gas: 0 };
        this.units = [];
        this.buildings = [];
    }

    public getResources() {
        return this.resources;
    }

    public spendResources(minerals: number, gas: number): void {
        this.resources.minerals -= minerals;
        this.resources.gas -= gas;
    }

    public addUnit(unit: Unit): void {
        this.units.push(unit);
    }

    public getUnits(): Unit[] {
        return this.units;
    }

    public getBuildings(): Building[] {
        return this.buildings;
    }

    public canAfford(minerals: number, gas: number): boolean {
        return this.resources.minerals >= minerals && this.resources.gas >= gas;
    }

    public createUnit(type: UnitType, x: number, y: number): void {
        const newUnit = new Unit(type, x, y);
        this.units.push(newUnit);
    }

    public update(): void {
        // 유닛 업데이트
        this.units = this.units.filter(unit => unit.isAlive());
        this.units.forEach(unit => unit.update());

        // 건물 업데이트
        this.buildings = this.buildings.filter(building => building.isAlive());
        this.buildings.forEach(building => building.update());
    }

    public getRace(): Race {
        return this.race;
    }
} 