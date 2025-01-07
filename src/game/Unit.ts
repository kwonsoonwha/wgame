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
    private shields: number = 0;
    private maxShields: number = 0;
    private energy: number = 0;
    private maxEnergy: number = 0;
    private isFlying: boolean = false;
    private targetX: number | null = null;
    private targetY: number | null = null;

    constructor(type: UnitType, x: number, y: number) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.stats = UNIT_STATS[type];
        this.maxHealth = this.stats.health;
        this.health = this.maxHealth;

        // 특수 능력 초기화
        if (this.stats.special) {
            switch (this.stats.special) {
                case 'shields':
                    this.maxShields = this.maxHealth / 2;
                    this.shields = this.maxShields;
                    break;
                case 'psionic':
                case 'cloak':
                    this.maxEnergy = 200;
                    this.energy = 50;
                    break;
                case 'flying':
                    this.isFlying = true;
                    break;
            }
        }
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

        // 쉴드 재생
        if (this.maxShields > 0 && this.shields < this.maxShields) {
            this.shields += 0.1;
        }

        // 에너지 재생
        if (this.maxEnergy > 0 && this.energy < this.maxEnergy) {
            this.energy += 0.1;
        }

        // 목표 지점으로 이동
        if (this.targetX !== null && this.targetY !== null) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > this.stats.speed) {
                const ratio = this.stats.speed / distance;
                this.x += dx * ratio;
                this.y += dy * ratio;
            } else {
                this.x = this.targetX;
                this.y = this.targetY;
                this.targetX = null;
                this.targetY = null;
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
        this.targetX = x;
        this.targetY = y;
    }

    public attack(target: Unit): void {
        target.takeDamage(this.stats.damage);
    }

    public takeDamage(amount: number): void {
        // 쉴드가 있는 경우 먼저 쉴드에 데미지
        if (this.shields > 0) {
            if (this.shields >= amount) {
                this.shields -= amount;
                return;
            } else {
                amount -= this.shields;
                this.shields = 0;
            }
        }
        
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
        // 유닛 본체 렌더링
        ctx.fillStyle = 'blue';  // 임시 색상
        ctx.fillRect(this.x - 16, this.y - 16, 32, 32);

        // 체력바 렌더링
        const healthBarWidth = 32;
        const healthBarHeight = 4;
        const healthPercentage = this.health / this.maxHealth;

        // 체력바 배경
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 16, this.y - 24, healthBarWidth, healthBarHeight);

        // 현재 체력
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - 16, this.y - 24, healthBarWidth * healthPercentage, healthBarHeight);
    }

    public heal(amount: number): void {
        this.health = Math.min(this.health + amount, this.maxHealth);
    }
}
