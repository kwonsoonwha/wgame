import { Player } from './Player';
import { Unit } from './Unit';
import { UnitType, UNIT_STATS } from './UnitTypes';
import { GameMap } from './Map';

export class UI {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private miniMapSize: number = 150;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    public renderResourceInfo(player: Player): void {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`미네랄: ${player.getResources().minerals}`, 10, 20);
        this.ctx.fillText(`가스: ${player.getResources().gas}`, 10, 40);
    }

    public renderUnitInfo(unit: Unit | null): void {
        if (!unit) return;

        const info = unit.getInfo();
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.canvas.width - 200, 0, 200, 100);
        this.ctx.fillStyle = 'black';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`유닛: ${info.name}`, this.canvas.width - 190, 20);
        this.ctx.fillText(`체력: ${info.health}/${info.maxHealth}`, this.canvas.width - 190, 40);
        this.ctx.fillText(`공격력: ${info.damage}`, this.canvas.width - 190, 60);
    }

    public renderMiniMap(map: GameMap, players: Player[]): void {
        const mapWidth = map.getWidth();
        const mapHeight = map.getHeight();
        const scale = this.miniMapSize / Math.max(mapWidth, mapHeight);
        
        // 미니맵 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(
            this.canvas.width - this.miniMapSize - 10,
            this.canvas.height - this.miniMapSize - 10,
            this.miniMapSize,
            this.miniMapSize
        );

        // 지형 렌더링
        const terrain = map.getTerrain();
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                if (terrain[y][x] === 1) {
                    this.ctx.fillStyle = '#666';
                    this.ctx.fillRect(
                        this.canvas.width - this.miniMapSize - 10 + x * scale,
                        this.canvas.height - this.miniMapSize - 10 + y * scale,
                        scale,
                        scale
                    );
                }
            }
        }

        // 유닛 렌더링
        players.forEach((player, index) => {
            this.ctx.fillStyle = index === 0 ? 'blue' : 'red';
            player.getUnits().forEach(unit => {
                const pos = unit.getPosition();
                this.ctx.fillRect(
                    this.canvas.width - this.miniMapSize - 10 + (pos.x / 32) * scale,
                    this.canvas.height - this.miniMapSize - 10 + (pos.y / 32) * scale,
                    scale * 2,
                    scale * 2
                );
            });
        });
    }

    public renderCommandCard(player: Player): void {
        const cardWidth = 400;
        const cardHeight = 100;
        const x = (this.canvas.width - cardWidth) / 2;
        const y = this.canvas.height - cardHeight;

        // 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(x, y, cardWidth, cardHeight);

        // 유닛 생산 버튼
        const buttonWidth = 80;
        const buttonHeight = 80;
        const units = [
            { type: UnitType.MARINE, name: "마린", cost: 50 },
            { type: UnitType.ZERGLING, name: "저글링", cost: 25 },
            { type: UnitType.ZEALOT, name: "질럿", cost: 100 }
        ];

        units.forEach((unit, index) => {
            const buttonX = x + 10 + (buttonWidth + 10) * index;
            const buttonY = y + 10;

            // 버튼 배경
            this.ctx.fillStyle = 'gray';
            this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

            // 유닛 정보
            this.ctx.fillStyle = 'white';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(unit.name, buttonX + 5, buttonY + 20);
            this.ctx.fillText(`비용: ${unit.cost}`, buttonX + 5, buttonY + 40);
        });
    }
} 