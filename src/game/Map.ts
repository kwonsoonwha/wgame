export class GameMap {
    private width: number;
    private height: number;
    private terrain: number[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.terrain = Array(height).fill(0).map(() => Array(width).fill(0));
    }

    public generateTerrain(): void {
        // 간단한 지형 생성
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.terrain[y][x] = Math.random() > 0.8 ? 1 : 0;
            }
        }
    }

    public isWalkable(x: number, y: number): boolean {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return false;
        }
        return this.terrain[y][x] === 0;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        const tileSize = 32;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                ctx.fillStyle = this.terrain[y][x] === 1 ? '#666' : '#8B4513';
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }
}
