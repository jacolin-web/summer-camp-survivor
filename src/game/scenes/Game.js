import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create() {

        const spawnX = Phaser.Math.Between(64, this.scale.width - 64);
        const spawnY = Phaser.Math.Between(64, this.scale.height - 64);

        this.girl = this.add.sprite(spawnX, spawnY, 'girl').setInteractive();
        this.boy = this.add.sprite(spawnX + 50, spawnY, 'boy');

        this.input.on('pointerdown', (pointer) => {
        this.tweens.add({
            targets: this.girl,
            x: pointer.x,
            y: pointer.y,
            duration: 1000,
            ease: 'Sine.easeInOut'
        });
        });
    }

    // update() {
    //     if (this.girl && this.boy) {
    //     const speed = 1.5;
    //     Phaser.Math.MoveToObject(this.boy, this.girl, speed);
    //     }
    // }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
