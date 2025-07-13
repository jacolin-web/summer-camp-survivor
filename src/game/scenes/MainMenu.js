import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    logoTween;

    constructor ()
    {
        super('MainMenu');
    }

    preloader(){
        this.load.image('tent', 'assets/main-menu.PNG');
    }

    create ()
    {
        this.add.image(512, 384, 'tent');
        let music = this.sound.add('backgroundMusic');
        music.play();

        this.add.text(512, 460, 'Summer Camp Survival', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'left'
        }).setDepth(100).setOrigin(0.5);

        const startButton = this.add.text(this.scale.width / 2, 400, 'Start Game', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        this.add.text(this.scale.width / 2, 525, 
            ['Click to walk around camp and pick up other campers.',
            'Bring them back to the tent!'], {
            fontSize: '20px',
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 5,
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)

        startButton.on('pointerdown', () => {
            this.scene.start('Game');
        });
        
        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('Game');
    }

    moveLogo (reactCallback)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
        }
        else
        {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (reactCallback)
                    {
                        reactCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }
}
