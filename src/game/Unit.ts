import { UnitType, UnitStats, UNIT_STATS } from './UnitTypes';
import { Sprite } from './Sprite';

export class Unit {
    private x: number;
    private y: number;
    private health: number;
    private maxHealth: number;
    private type: UnitType;
    private stats: UnitStats;
    private target: Unit | null = null;
    private attackCooldown: number = 0;

    constructor(type: UnitType, x: number, y: number) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.stats = UNIT_STATS[type];
        this.maxHealth = this.stats.health;
        this.health = this.maxHealth;
    }

    public update(): void {
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }

        if (this.target && this.attackCooldown <= 0) {
            const distance = this.getDistanceTo(this.target);
            if (distance <= this.stats.range * 32) {
                this.attack(this.target);
                this.attackCooldown = 30; // 공격 쿨다운 (30프레임)
            } else {
                this.moveToward(this.target.getPosition());
            }
        }
    }

    public setTarget(unit: Unit | null): void {
        this.target = unit;
    }

    private getDistanceTo(unit: Unit): number {
        const dx = unit.x - this.x;
        const dy = unit.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    private moveToward(pos: {x: number, y: number}): void {
        const dx = pos.x - this.x;
        const dy = pos.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > this.stats.speed) {
            const ratio = this.stats.speed / distance;
            this.x += dx * ratio;
            this.y += dy * ratio;
        }
    }

    public move(x: number, y: number): void {
        this.target = null;
        const dx = x - this.x;
        const dy = y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > this.stats.speed) {
            const ratio = this.stats.speed / distance;
            this.x += dx * ratio;
            this.y += dy * ratio;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    public attack(target: Unit): void {
        target.takeDamage(this.stats.damage);
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

    public getInfo(): any {
        return {
            name: UnitType[this.type],
            health: this.health,
            maxHealth: this.maxHealth,
            damage: this.stats.damage
        };
    }

    public render(ctx: CanvasRenderingContext2D): void {
        // 임시로 사각형으로 유닛 표시
        ctx.fillRect(this.x - 16, this.y - 16, 32, 32);

        // 체력바 렌더링
        const healthBarWidth = 32;
        const healthBarHeight = 5;
        const healthPercentage = this.health / this.maxHealth;

        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 16, this.y - 25, healthBarWidth, healthBarHeight);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - 16, this.y - 25, healthBarWidth * healthPercentage, healthBarHeight);
    }
}
