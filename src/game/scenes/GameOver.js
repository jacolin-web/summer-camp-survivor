export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.result = data.result || 'lose';
    }

    preload(){
        this.load.image('gameover', 'assets/main-menu.PNG');
    }

    create() {
        this.add.image(512, 384, 'gameover');

        const message = this.result === 'win' ? 'You Win!' : 'Game Over';
        const color = this.result === 'win' ? '#88ff88' : '#ff4444';

        this.add.text(this.scale.width / 2, this.scale.height / 2, message, {
            fontSize: '48px',
            color: color
        }).setOrigin(0.5);

        const restartBtn = this.add.text(this.scale.width / 2, this.scale.height / 2 + 100, 'Play Again', {
            fontSize: '28px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        restartBtn.on('pointerdown', () => {
            this.sound.stopAll();
            this.scene.start('MainMenu'); // or 'Game' if you want to restart directly
        });
    }
}
