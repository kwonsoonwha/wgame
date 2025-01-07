export class Unit {
    protected x: number;
    protected y: number;
    protected health: number;
    protected damage: number;
    protected name: string;

    constructor(x: number, y: number, health: number, damage: number, name: string) {
        this.x = x;
        this.y = y;
        this.health = health;
        this.damage = damage;
        this.name = name;
    }

    public move(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    public attack(target: Unit): void {
        target.takeDamage(this.damage);
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
}
