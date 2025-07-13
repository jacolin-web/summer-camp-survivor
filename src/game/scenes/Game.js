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

    setDirectionTexture(sprite, dx, dy, baseName) {
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
            sprite.setTexture(`${baseName}-east`);
        } else {
            sprite.setTexture(`${baseName}-west`);
        }
    } else {
        if (dy > 0) {
            sprite.setTexture(`${baseName}-south`);
        } else {
            sprite.setTexture(`${baseName}-north`);
        }
    }
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

    collectCamper(girl, camper){
        if (!this.followers.includes(camper)){
            this.campers.remove(camper);
            this.followers.push(camper);
            camper.setTint(0x88ff88);
        }
    }

    create() {
        //Setting up initial scene
        this.add.image(512, 384, 'tent');

        //Starting and endpoint of tent
        this.spawnX = 750;
        this.spawnY = 350;
        //Game mechanics
        this.campersTotal = 2; 
        this.hasWon = false;

        const minDistanceFromSpawn = 250;

        const randomSpawnX = Phaser.Math.Between(64, this.scale.width - 64);
        const randomSpawnY = Phaser.Math.Between(64, this.scale.height - 64);

        this.followers = [];
        this.campers = this.physics.add.group();

        this.girl = this.physics.add.sprite(this.spawnX, this.spawnY, 'girl-south').setInteractive();
        this.girl.body.setSize(65,100);

        this.boy = this.physics.add.sprite(this.spawnX + 50, this.spawnY, 'boy-south').setScale(0.85);
        this.boy.body.setSize(20,40);

        this.zombie = this.physics.add.sprite(randomSpawnX, randomSpawnY, 'zombie-east');
        this.zombie.body.setSize(20,40);

        this.boss = this.physics.add.sprite(randomSpawnX, randomSpawnY, 'boss-east').setScale(2);
        this.boss.body.setSize(20,40);

        this.physics.add.overlap(this.girl, this.zombie, () => {
            this.changeScene('lose');
        });

        this.camper1 = this.physics.add.sprite(300, 300, 'egg-south').setScale(0.85);
        this.camper1.body.setSize(65,100);
        this.campers.add(this.camper1);

        this.camper2 = this.physics.add.sprite(300, 350, 'boohoo-south').setScale(0.85);
        this.camper2.body.setSize(65,100);
        this.campers.add(this.camper2);

        this.physics.add.overlap(this.girl, this.campers, this.collectCamper, null, this);
        
        // Set up trees dynamically
        this.trees = this.physics.add.staticGroup();
        const treeCount = Phaser.Math.Between(10, 13);
        const minDistanceBetweenTrees = 200;
        const placedTreePositions = [];

        for (let i = 0; i < treeCount; i++) {
            let x, y;
            let valid = false;
            let attempts = 0;
            const maxAttempts = 150;

            while (!valid && attempts < maxAttempts) {
                x = Phaser.Math.Between(100, this.scale.width - 100) - 50;
                y = Phaser.Math.Between(100, this.scale.height - 100);
                attempts++;

                // 1. Too close to the spawn point?
                const farFromSpawn = Phaser.Math.Distance.Between(x, y, this.spawnX, this.spawnY) > minDistanceFromSpawn;

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
                tree.body.setSize(45, 50);
            }
        }

        this.physics.add.collider(this.girl, this.trees);
        this.physics.add.collider(this.boy, this.trees);

        // Handle click down 
        this.input.on('pointerdown', (pointer) => {
            const dx = pointer.x - this.girl.x;
            const dy = pointer.y - this.girl.y;

            this.setDirectionTexture(this.girl, dx, dy, 'girl');
            this.moveTo(this.girl, pointer.x, pointer.y, 200);

            const boyDx = (pointer.x + 50) - this.boy.x;
            const boyDy = pointer.y - this.boy.y;

            this.setDirectionTexture(this.boy, boyDx, boyDy, 'boy');
            this.moveTo(this.boy, pointer.x + 50, pointer.y, 200);
        });
    }

    update(time, delta) {
        if (this.girl && this.zombie && this.boss) {
            // Move the enemy a few pixels per frame toward the girl
            const speed = 75; 
            this.physics.moveToObject(this.zombie, this.girl, speed);
            this.physics.moveToObject(this.boss, this.girl, speed);

            const dx = this.girl.x - this.zombie.x;
            if (dx > 0) {
                this.zombie.setTexture('zombie-east');
            } else {
                this.zombie.setTexture('zombie-west');
            }

        }

          if (this.girl && this.boss) {
            // Move the enemy a few pixels per frame toward the girl
            const speed = 100; // Adjust to make it faster/slower
            this.physics.moveToObject(this.boss, this.girl, speed);

            const dx = this.girl.x - this.boss.x;
            if (dx > 0) {
                this.boss.setTexture('boss-east');
            } else {
                this.boss.setTexture('boss-west');
            }

        }
        const followSpeed = 140;
        const minDistance = 25;

        for (let i = 0; i < this.followers.length; i++){
            const leader = i === 0 ? this.girl : this.followers[i - 1];
            const camper = this.followers[i];

            const dx = leader.x - camper.x;
            const dy = leader.y - camper.y;
            const distance = Phaser.Math.Distance.Between(camper.x, camper.y, leader.x, leader.y);

            this.setDirectionTexture(camper, dx, dy, camper.texture.key.split('-')[0]);

            if (distance > minDistance){
                this.physics.moveToObject(camper, leader, followSpeed);
            } else{
                camper.body.setVelocity(0,0);
            }
        }

        const distanceToSpawn = Phaser.Math.Distance.Between(
                this.girl.x, this.girl.y,
                this.spawnX, this.spawnY
        );

        if (this.followers.length === this.campersTotal && distanceToSpawn < 30) {
            this.hasWon = true;
            this.handleWin();
        }
    }

    handleWin() {
        this.girl.body.setVelocity(0, 0);
        for (let camper of this.followers) {
            camper.body.setVelocity(0, 0);
        }

        this.changeScene('win')
    }

    changeScene(result = 'lose') {
            this.scene.start('GameOver', { result });
        }
}
