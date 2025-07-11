import { useRef, useState } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './PhaserGame';

function App ()
{
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);
    
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });


    const moveSprite = () => {

        const scene = phaserRef.current.scene;

        if (scene && scene.scene.key === 'MainMenu')
        {
            // Get the update logo position
            scene.moveLogo(({ x, y }) => {

                setSpritePosition({ x, y });

            });
        }
    }

    const startGame = () => {
        const scene = phaserRef.current.scene;

        if (scene) {
            const x = Phaser.Math.Between(64, scene.scale.width - 64);
            const y = Phaser.Math.Between(64, scene.scale.height - 64);

            // Add sprite with physics enabled
            const girl = scene.physics.add.sprite(x, y, 'girl');

            // Enable input for the sprite
            girl.setInteractive();

            // Optional: set physics properties like bounce, drag, etc.
            girl.setBounce(0.5);
            girl.setCollideWorldBounds(true);

            // Listen for pointerdown (click) on the scene, not just on the sprite
            scene.input.on('pointerdown', function (pointer) {
                // Calculate angle to pointer
                const angle = Phaser.Math.Angle.Between(girl.x, girl.y, pointer.x, pointer.y);

                // Calculate velocity components
                const speed = 200; // pixels/second
                const velocityX = Math.cos(angle) * speed;
                const velocityY = Math.sin(angle) * speed;

                // Apply velocity to the sprite
                girl.setVelocity(velocityX, velocityY);
            });
        }
    };
    
    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            <div>
                <div>
                    <button disabled={canMoveSprite} className="button" onClick={moveSprite}>Toggle Movement</button>
                </div>
                <div className="spritePosition">Sprite Position:
                    <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
                </div>
                <div>
                    <button className="button" onClick={startGame} >Start Game</button>
                </div>
            </div>
        </div>
    )
}

export default App
