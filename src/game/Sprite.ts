export class Sprite {
    private image: HTMLImageElement;
    private frameWidth: number;
    private frameHeight: number;
    private totalFrames: number;
    private currentFrame: number;
    private animationSpeed: number;
    private frameCounter: number;

    constructor(imagePath: string, frameWidth: number, frameHeight: number, totalFrames: number) {
        this.image = new Image();
        this.image.src = imagePath;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.totalFrames = totalFrames;
        this.currentFrame = 0;
        this.animationSpeed = 5;
        this.frameCounter = 0;
    }

    public update(): void {
        this.frameCounter++;
        if (this.frameCounter >= this.animationSpeed) {
            this.frameCounter = 0;
            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
        }
    }

    public render(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.drawImage(
            this.image,
            this.currentFrame * this.frameWidth,
            0,
            this.frameWidth,
            this.frameHeight,
            x - this.frameWidth / 2,
            y - this.frameHeight / 2,
            this.frameWidth,
            this.frameHeight
        );
    }
} 