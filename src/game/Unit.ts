import { UnitType, UnitStats, UNIT_STATS } from './UnitTypes';
import { Sprite } from './Sprite';
import { Game } from './Game';

export class Unit {
    private x: number;
    private y: number;
    private targetX: number | null = null;
    private targetY: number | null = null;
    private targetUnit: Unit | null = null;
    private attackCooldown: number = 0;
    private readonly ATTACK_SPEED = 1000; // 1초마다 공격
    private lastUpdateTime: number = Date.now();
    private game: Game;
    private health: number;
    private maxHealth: number;
    private type: UnitType;
    private stats: UnitStats;

    constructor(type: UnitType, x: number, y: number, game: Game) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.game = game;
        this.health = UNIT_STATS[type].health;
        this.maxHealth = UNIT_STATS[type].health;
        this.stats = UNIT_STATS[type];
    }

    public move(x: number, y: number): void {
        this.targetX = x;
        this.targetY = y;
        this.targetUnit = null;  // 이동 시 공격 대상 취소
    }

    public attack(target: Unit): void {
        this.targetUnit = target;
        this.targetX = null;
        this.targetY = null;
    }

    public takeDamage(amount: number): void {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
        }
    }

    public isAlive(): boolean {
        return this.health > 0;
    }

    public getPosition(): { x: number; y: number } {
        return { x: this.x, y: this.y };
    }

    public update(): void {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastUpdateTime;
        this.lastUpdateTime = currentTime;

        // 공격 대상이 있는 경우
        if (this.targetUnit && this.targetUnit.isAlive()) {
            const targetPos = this.targetUnit.getPosition();
            const distance = this.getDistanceTo(targetPos.x, targetPos.y);
            
            if (distance <= this.stats.range * 32) {
                // 공격 실행
                if (this.attackCooldown <= 0) {
                    this.targetUnit.takeDamage(this.stats.damage);
                    this.attackCooldown = this.ATTACK_SPEED;
                }
                this.attackCooldown -= deltaTime;
            } else {
                // 공격 범위까지 이동
                this.moveToward(targetPos.x, targetPos.y);
            }
        }
        // 이동 명령이 있는 경우
        else if (this.targetX !== null && this.targetY !== null) {
            this.moveToward(this.targetX, this.targetY);
        }
    }

    private moveToward(targetX: number, targetY: number): void {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {  // 5픽셀 이상 떨어져 있을 때만 이동
            const speed = this.stats.speed;
            const ratio = speed / distance;
            
            // 새로운 위치 계산
            const newX = this.x + dx * ratio;
            const newY = this.y + dy * ratio;
            
            // 충돌 체크
            if (!this.checkCollision(newX, newY)) {
                this.x = newX;
                this.y = newY;
            } else {
                // 충돌 시 우회 경로 시도
                const angle = Math.atan2(dy, dx);
                for (let i = 1; i <= 8; i++) {
                    const testAngle = angle + (i % 2 === 0 ? 1 : -1) * (Math.PI / 4) * Math.ceil(i / 2);
                    const testX = this.x + Math.cos(testAngle) * speed;
                    const testY = this.y + Math.sin(testAngle) * speed;
                    
                    if (!this.checkCollision(testX, testY)) {
                        this.x = testX;
                        this.y = testY;
                        break;
                    }
                }
            }
        } else {
            // 목표 지점에 도달
            this.targetX = null;
            this.targetY = null;
        }
    }

    private getDistanceTo(x: number, y: number): number {
        const dx = this.x - x;
        const dy = this.y - y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    private checkCollision(newX: number, newY: number): boolean {
        const units = this.game.getAllUnits();
        for (const other of units) {
            if (other === this) continue;
            
            const otherPos = other.getPosition();
            const dx = newX - otherPos.x;
            const dy = newY - otherPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 32) {  // 유닛 크기만큼의 거리
                return true;
            }
        }
        return false;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        // 유닛 본체
        ctx.fillStyle = this.getUnitColor();
        ctx.fillRect(this.x - 16, this.y - 16, 32, 32);

        // 체력바
        const healthBarWidth = 32;
        const healthBarHeight = 4;
        const healthPercentage = this.health / this.maxHealth;

        // 체력바 배경 (빨간색)
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 16, this.y - 24, healthBarWidth, healthBarHeight);

        // 현재 체력 (녹색)
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - 16, this.y - 24, healthBarWidth * healthPercentage, healthBarHeight);

        // 공격 대상이 있는 경우 공격선 표시
        if (this.targetUnit && this.targetUnit.isAlive()) {
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            const targetPos = this.targetUnit.getPosition();
            ctx.lineTo(targetPos.x, targetPos.y);
            ctx.stroke();
        }
    }

    public getInfo(): string {
        return `${UnitType[this.type]} (HP: ${this.health}/${this.maxHealth})`;
    }

    private getUnitColor(): string {
        switch (this.type) {
            case UnitType.MARINE:
                return 'blue';
            case UnitType.ZERGLING:
                return 'purple';
            case UnitType.ZEALOT:
                return 'yellow';
            default:
                return 'gray';
        }
    }

    public getStats(): UnitStats {
        return this.stats;
    }
}
