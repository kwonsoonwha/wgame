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
        const resources = player.getResources();
        this.ctx.fillText(`미네랄: ${resources.minerals}`, 10, 20);
        this.ctx.fillText(`가스: ${resources.gas}`, 10, 40);
    }

    public renderUnitInfo(unit: Unit): void {
        if (!unit) return;

        const info = unit.getInfo();
        const stats = unit.getStats();

        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`유닛: ${info}`, 10, 70);
        this.ctx.fillText(`공격력: ${stats.damage}`, 10, 90);
        this.ctx.fillText(`방어력: ${stats.armor}`, 10, 110);
        this.ctx.fillText(`이동속도: ${stats.speed}`, 10, 130);
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
        const startX = (this.canvas.width - cardWidth) / 2;
        const buttonWidth = 80;
        const buttonHeight = 80;
        const buttonSpacing = 10;
        const buttonY = this.canvas.height - 100;

        // 커맨드 카드 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(startX, buttonY, cardWidth, 90);

        // 유닛 생산 버튼
        const unitTypes = [UnitType.MARINE, UnitType.ZERGLING, UnitType.ZEALOT];
        const costs = [50, 25, 100];

        unitTypes.forEach((type, index) => {
            const buttonX = startX + buttonSpacing + index * (buttonWidth + buttonSpacing);
            
            // 버튼 배경
            this.ctx.fillStyle = player.canAfford(costs[index], 0) ? 'gray' : 'darkgray';
            this.ctx.fillRect(buttonX, buttonY + 5, buttonWidth, buttonHeight);

            // 유닛 정보
            this.ctx.fillStyle = 'white';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(UnitType[type], buttonX + 5, buttonY + 20);
            this.ctx.fillText(`비용: ${costs[index]}`, buttonX + 5, buttonY + 40);
        });
    }
} 