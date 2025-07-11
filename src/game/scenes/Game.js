import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import Phaser from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    moveTo(sprite, targetX, targetY, speed) {
        const angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, targetX, targetY);

        sprite.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed

        );

        const stopDistance = 4;
        const check = this.time.addEvent({
            delay: 20,
            callback: () => {
                const distance = Phaser.Math.Distance.Between(sprite.x, sprite.y, targetX, targetY);
                if (distance < stopDistance) {
                    sprite.body.setVelocity(0, 0);
                    check.remove(); // Stop checking once we've arrived
                }
            },
            loop: true
        });
    }

    create() {

        const spawnX = Phaser.Math.Between(64, this.scale.width - 64);
        const spawnY = Phaser.Math.Between(64, this.scale.height - 64);

        this.girl = this.physics.add.sprite(spawnX, spawnY, 'girl').setInteractive();
        this.girl.body.setSize(65,100);

        this.boy = this.physics.add.sprite(spawnX + 50, spawnY, 'boy').setScale(0.85);
        this.boy.body.setSize(65,100);

        this.zombie = this.add.sprite(spawnX, spawnY, 'zombie');

        this.tree = this.physics.add.staticImage(300, 200, 'tree').setScale(1.5).refreshBody();
        this.tree.body.setSize(90,100);

        this.physics.add.collider(this.girl, this.tree);
        this.physics.add.collider(this.boy, this.tree);

        

        this.input.on('pointerdown', (pointer) => {
            this.moveTo(this.girl, pointer.x, pointer.y, 150);

            this.time.delayedCall(200, () => {
                this.moveTo(this.boy, pointer.x + 50, pointer.y, 120);
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
