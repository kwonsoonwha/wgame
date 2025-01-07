import { GameMap } from './Map';
import { Player } from './Player';
import { Unit } from './Unit';
import { Race, UnitType } from './UnitTypes';
import { UI } from './UI';
import { BuildingType } from './Building';

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private map: GameMap;
    private players: Player[];
    private selectedUnit: Unit | null;
    private ui: UI;
    private buildMode: boolean;
    private selectedBuildingType: BuildingType | null;

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error('Canvas element not found!');
        }
        
        this.ctx = this.canvas.getContext('2d')!;
        if (!this.ctx) {
            throw new Error('Could not get 2D context!');
        }
        
        // 캔버스 크기 설정
        this.canvas.width = 800;
        this.canvas.height = 600;

        // UI 초기화
        this.ui = new UI(this.canvas, this.ctx);

        // 맵 생성
        this.map = new GameMap(25, 19);
        this.map.generateTerrain();

        // 플레이어 생성
        this.players = [
            new Player(Race.TERRAN),
            new Player(Race.ZERG)
        ];

        // 초기 유닛 생성
        this.players[0].createUnit(UnitType.MARINE, 100, 100);
        this.players[1].createUnit(UnitType.ZERGLING, 700, 500);

        this.selectedUnit = null;
        this.buildMode = false;
        this.selectedBuildingType = null;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.handleRightClick(e);
        });
    }

    private handleClick(e: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 건물 건설 모드 처리
        if (this.buildMode) {
            this.players[0].createBuilding(this.selectedBuildingType!, x, y);
            this.buildMode = false;
            this.selectedBuildingType = null;
            return;
        }

        // 커맨드 카드 영역 클릭 처리
        if (y > this.canvas.height - 110) {
            this.handleCommandCardClick(x, y);
            return;
        }

        // 유닛 선택
        const clickedUnit = this.findUnitAt(x, y);
        if (clickedUnit) {
            this.selectedUnit = clickedUnit;
        } else if (this.selectedUnit) {
            this.selectedUnit.move(x, y);
        }
    }

    private handleRightClick(e: MouseEvent): void {
        if (!this.selectedUnit) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const targetUnit = this.findUnitAt(x, y);
        if (targetUnit && targetUnit !== this.selectedUnit) {
            this.selectedUnit.setTarget(targetUnit);
        }
    }

    private handleCommandCardClick(x: number, y: number): void {
        // 유닛 생산 버튼 클릭 처리
        const buttonWidth = 80;
        const cardX = (this.canvas.width - 400) / 2;
        const buttonIndex = Math.floor((x - cardX - 10) / (buttonWidth + 10));
        
        if (buttonIndex >= 0 && buttonIndex < 3) {
            const unitTypes = [UnitType.MARINE, UnitType.ZERGLING, UnitType.ZEALOT];
            this.players[0].createUnit(unitTypes[buttonIndex], 100, 100);
        }
    }

    private findUnitAt(x: number, y: number): Unit | null {
        for (const player of this.players) {
            for (const unit of player.getUnits()) {
                const pos = unit.getPosition();
                if (Math.abs(pos.x - x) < 16 && Math.abs(pos.y - y) < 16) {
                    return unit;
                }
            }
        }
        return null;
    }

    public start(): void {
        this.gameLoop();
    }

    private gameLoop(): void {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    private update(): void {
        this.players.forEach(player => player.update());
    }

    private render(): void {
        // 화면 클리어
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 맵 렌더링
        this.map.render(this.ctx);
        
        // 유닛 렌더링
        this.players.forEach((player, index) => {
            this.ctx.fillStyle = index === 0 ? 'blue' : 'red';
            player.getUnits().forEach(unit => unit.render(this.ctx));
        });

        // 건물 렌더링
        this.players.forEach((player, index) => {
            player.getBuildings().forEach(building => building.render(this.ctx));
        });

        // UI 렌더링
        this.ui.renderResourceInfo(this.players[0]);
        this.ui.renderUnitInfo(this.selectedUnit);
        this.ui.renderMiniMap(this.map, this.players);
        this.ui.renderCommandCard(this.players[0]);

        // 선택된 유닛 표시
        if (this.selectedUnit) {
            const pos = this.selectedUnit.getPosition();
            this.ctx.strokeStyle = 'yellow';
            this.ctx.strokeRect(pos.x - 18, pos.y - 18, 36, 36);
        }
    }
}
