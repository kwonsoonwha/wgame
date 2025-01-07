export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        
        // 캔버스 크기 설정
        this.canvas.width = 800;
        this.canvas.height = 600;
    }

    public start(): void {
        this.gameLoop();
    }

    private gameLoop(): void {
        // 게임 루프 구현
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    private update(): void {
        // 게임 상태 업데이트
    }

    private render(): void {
        // 화면 클리어
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 게임 요소 렌더링
        this.ctx.fillStyle = 'black';
        this.ctx.fillText('StarCraft Game', 10, 30);
    }
}
