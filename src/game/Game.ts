import { GameMap } from './Map';
import { Player } from './Player';
import { Unit } from './Unit';
import { Race, UnitType, UNIT_STATS } from './UnitTypes';
import { UI } from './UI';
import { Building, BuildingType } from './Building';

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private map: GameMap;
    private players: Player[];
    private selectedUnit: Unit | null = null;
    private selectedUnits: Unit[] = [];
    private ui: UI;
    private dragStart: { x: number, y: number } | null = null;
    private isDragging: boolean = false;

    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d')!;
        this.map = new GameMap(this.canvas.width, this.canvas.height);
        
        // 플레이어 초기화 시 this 전달
        this.players = [
            new Player(Race.TERRAN, this),  // this 전달
            new Player(Race.ZERG, this)     // this 전달
        ];
        
        this.ui = new UI(this.canvas, this.ctx);
        
        // 테스트용 적 유닛 생성
        const enemyUnit = new Unit(UnitType.ZERGLING, 600, 300, this);
        this.players[1].addUnit(enemyUnit);
        
        this.setupEventListeners();
        this.gameLoop();
    }

    private setupEventListeners(): void {
        // 모든 마우스 이벤트를 캔버스에 바인딩
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.handleRightClick(e);
        });
    }

    private gameLoop(): void {
        // 게임 상태 업데이트
        this.update();
        
        // 화면 렌더링
        this.render();
        
        // 다음 프레임 요청
        requestAnimationFrame(() => this.gameLoop());
    }

    private update(): void {
        // 플레이어 업데이트
        this.players.forEach(player => {
            player.update();
        });
    }

    private render(): void {
        // 화면 클리어
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 맵 렌더링
        this.map.render(this.ctx);
        
        // 유닛 렌더링
        this.players.forEach(player => {
            player.getUnits().forEach(unit => unit.render(this.ctx));
        });
        
        // UI 렌더링
        this.ui.renderResourceInfo(this.players[0]);
        this.ui.renderCommandCard(this.players[0]);
        
        // 선택된 유닛 표시
        if (this.selectedUnits.length > 0) {
            this.selectedUnits.forEach(unit => {
                const pos = unit.getPosition();
                this.ctx.strokeStyle = 'yellow';
                this.ctx.strokeRect(pos.x - 18, pos.y - 18, 36, 36);
            });
        }
    }

    public start(): void {
        this.gameLoop();
    }

    private handleMouseDown(e: MouseEvent): void {
        if (e.button === 0) { // 좌클릭
            const rect = this.canvas.getBoundingClientRect();
            this.dragStart = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            this.isDragging = true;
        }
    }

    private handleMouseMove(e: MouseEvent): void {
        if (this.isDragging && this.dragStart) {
            const rect = this.canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;

            // 드래그 영역 표시
            this.render();
            this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
            this.ctx.strokeRect(
                this.dragStart.x,
                this.dragStart.y,
                currentX - this.dragStart.x,
                currentY - this.dragStart.y
            );
        }
    }

    private handleMouseUp(e: MouseEvent): void {
        if (e.button === 0 && this.isDragging) {
            const rect = this.canvas.getBoundingClientRect();
            const endX = e.clientX - rect.left;
            const endY = e.clientY - rect.top;

            // 드래그 선택
            if (Math.abs(endX - this.dragStart!.x) > 5 || Math.abs(endY - this.dragStart!.y) > 5) {
                const left = Math.min(this.dragStart!.x, endX);
                const right = Math.max(this.dragStart!.x, endX);
                const top = Math.min(this.dragStart!.y, endY);
                const bottom = Math.max(this.dragStart!.y, endY);

                this.selectedUnits = this.players[0].getUnits().filter(unit => {
                    const pos = unit.getPosition();
                    return pos.x >= left && pos.x <= right && 
                           pos.y >= top && pos.y <= bottom;
                });
            }

            this.isDragging = false;
            this.dragStart = null;
        }
    }

    private handleClick(e: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        console.log('Click at:', x, y);

        // 커맨드 카드 영역 클릭 처리
        if (y > this.canvas.height - 110) {
            console.log('Command card clicked');
            const cardWidth = 400;
            const startX = (this.canvas.width - cardWidth) / 2;
            const buttonWidth = 80;
            const buttonSpacing = 10;
            
            const relativeX = x - startX - buttonSpacing;
            const buttonIndex = Math.floor(relativeX / (buttonWidth + buttonSpacing));
            
            console.log('Button index:', buttonIndex);

            if (buttonIndex >= 0 && buttonIndex < 3) {
                const unitTypes = [UnitType.MARINE, UnitType.ZERGLING, UnitType.ZEALOT];
                const costs = [50, 25, 100];
                
                if (this.players[0].getResources().minerals >= costs[buttonIndex]) {
                    console.log('Creating unit:', unitTypes[buttonIndex]);
                    this.players[0].spendResources(costs[buttonIndex], 0);
                    const spawnX = 100;
                    const spawnY = Math.random() * (this.canvas.height - 200) + 100;
                    const newUnit = new Unit(unitTypes[buttonIndex], spawnX, spawnY, this);
                    this.players[0].addUnit(newUnit);
                    console.log('Unit created');
                }
            }
            return;
        }

        // 유닛 선택
        const clickedUnit = this.findUnitAt(x, y);
        if (clickedUnit) {
            this.selectedUnit = clickedUnit;
            this.selectedUnits = [clickedUnit];
        }
    }

    private handleRightClick(e: MouseEvent): void {
        e.preventDefault();
        
        if (this.selectedUnits.length === 0) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 적 유닛 클릭 확인
        const targetUnit = this.findEnemyUnitAt(x, y);
        
        this.selectedUnits.forEach(unit => {
            if (targetUnit) {
                // 공격 명령
                unit.attack(targetUnit);
            } else {
                // 이동 명령
                unit.move(x, y);
            }
        });
    }

    private findUnitAt(x: number, y: number): Unit | null {
        // 모든 플레이어의 유닛을 검사
        for (const player of this.players) {
            for (const unit of player.getUnits()) {
                const pos = unit.getPosition();
                // 유닛의 히트박스 (32x32 픽셀)를 기준으로 클릭 판정
                if (Math.abs(pos.x - x) < 16 && Math.abs(pos.y - y) < 16) {
                    return unit;
                }
            }
        }
        return null;
    }

    private findEnemyUnitAt(x: number, y: number): Unit | null {
        // 플레이어 1의 유닛은 제외하고 검색
        for (let i = 1; i < this.players.length; i++) {
            for (const unit of this.players[i].getUnits()) {
                const pos = unit.getPosition();
                if (Math.abs(pos.x - x) < 16 && Math.abs(pos.y - y) < 16) {
                    return unit;
                }
            }
        }
        return null;
    }

    public getAllUnits(): Unit[] {
        let allUnits: Unit[] = [];
        this.players.forEach(player => {
            allUnits = allUnits.concat(player.getUnits());
        });
        return allUnits;
    }
}
