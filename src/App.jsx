import { useRef, useState } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './PhaserGame';

function App ()
{
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);
    const [showStart, setShowStart] = useState(true);
    
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
            const girl = scene.add.sprite(x, y, 'girl');

            // Enable input for the sprite
            girl.setInteractive();

            scene.input.on('pointerdown', function (pointer) {
                scene.tweens.add({
                    targets: girl,
                    x: pointer.x,
                    y: pointer.y,
                    duration: 1000,           // slower movement (1 second)
                    ease: 'Sine.easeInOut' 
                });
            });

            setShowStart(false);
        }
    };
    
    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            <button hidden={!showStart} className="button" onClick={startGame} >Start Game</button>
        </div>
    )
}

export default App
