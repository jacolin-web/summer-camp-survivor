import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import Phaser from 'phaser';

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

        this.zombie = this.add.sprite(spawnX, spawnY, 'zombie');

        this.input.on('pointerdown', (pointer) => {
            this.tweens.add({
                targets: this.girl,
                x: pointer.x,
                y: pointer.y,
                duration: 1000,
                ease: 'Sine.easeInOut'
            });

            this.tweens.add({
                targets: this.boy,
                x: pointer.x + 50,
                y: pointer.y,
                duration: 1200, // a little slower for trailing effect
                ease: 'Sine.easeInOut',
                delay: 200 
            });
        });
    }

    update(time, delta) {
        if (this.girl && this.zombie) {
            // Move the enemy a few pixels per frame toward the girl
            const speed = 1.2; // Adjust to make it faster/slower
            // Phaser.Math.MoveToObject(this.zombie, this.girl, speed);
        }
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
