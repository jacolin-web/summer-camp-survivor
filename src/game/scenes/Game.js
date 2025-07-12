import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import Phaser from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

     preloader(){
        this.load.image('tent', 'tent-start.PNG');
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
        this.add.image(512, 384, 'tent');

        //Characters spawn here
        const spawnX = 750;
        const spawnY = 350;
        const minDistanceFromSpawn = 250;

        const randomSpawnX = Phaser.Math.Between(64, this.scale.width - 64);
        const randomSpawnY = Phaser.Math.Between(64, this.scale.height - 64);

        this.girl = this.physics.add.sprite(spawnX, spawnY, 'girl').setInteractive();
        this.girl.body.setSize(65,100);

        this.boy = this.physics.add.sprite(spawnX + 50, spawnY, 'boy').setScale(0.85);
        this.boy.body.setSize(65,100);

        this.zombie = this.physics.add.sprite(randomSpawnX, randomSpawnY, 'zombie');
        this.zombie.body.setSize(65,100);
        
        this.trees = this.physics.add.staticGroup();
        const treeCount = Phaser.Math.Between(10, 13);
        const minDistanceBetweenTrees = 120;
        const placedTreePositions = [];

        for (let i = 0; i < treeCount; i++) {
            let x, y;
            let valid = false;
            let attempts = 0;
            const maxAttempts = 100;

            while (!valid && attempts < maxAttempts) {
                x = Phaser.Math.Between(100, this.scale.width - 100) - 50;
                y = Phaser.Math.Between(100, this.scale.height - 100);
                attempts++;

                // 1. Too close to the spawn point?
                const farFromSpawn = Phaser.Math.Distance.Between(x, y, spawnX, spawnY) > minDistanceFromSpawn;

                // 2. Too close to other trees?
                const farFromOtherTrees = placedTreePositions.every(pos => {
                    return Phaser.Math.Distance.Between(x, y, pos.x, pos.y) > minDistanceBetweenTrees;
                });

                if (farFromSpawn && farFromOtherTrees) {
                    valid = true;
                }
            }

            if (valid) {
                placedTreePositions.push({ x, y });
                const tree = this.trees.create(x, y, 'tree').setScale(1.5).refreshBody();
                tree.body.setSize(90, 100);
            }
        }

        this.physics.add.collider(this.girl, this.trees);
        this.physics.add.collider(this.boy, this.trees);


        this.input.on('pointerdown', (pointer) => {
            this.moveTo(this.girl, pointer.x, pointer.y, 200);

            console.log(`current position x: ${pointer.x}`)
            console.log(`current position y: ${pointer.y}`)

            this.time.delayedCall(200, () => {
                this.moveTo(this.boy, pointer.x + 50, pointer.y, 120);
            });
        });
    }

    update(time, delta) {
        if (this.girl && this.zombie) {
            // Move the enemy a few pixels per frame toward the girl
            const speed = 100; // Adjust to make it faster/slower
            this.physics.moveToObject(this.zombie, this.girl, speed);
        }
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
