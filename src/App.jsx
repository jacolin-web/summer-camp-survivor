import { useRef, useState } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './PhaserGame';

function App ()
{
    const [showStart, setShowStart] = useState(true);

    function callRandom(scene){
        return Phaser.Math.Between(64, scene.scale.width - 64)
    }
    
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();

    const startGame = () => {
        const scene = phaserRef.current.scene;

        if (scene) {
            const spawnX = callRandom(scene)
            const spawnY = callRandom(scene)

            // Add girl scout sprite
            const girl = scene.add.sprite(spawnX, spawnY, 'girl');

            // Enable input for the sprite
            girl.setInteractive();

            // Add girl scout sprite
            const boy = scene.add.sprite(spawnX + 50, spawnY, 'boy');

            scene.input.on('pointerdown', function (pointer) {
                scene.tweens.add({
                    targets: girl,
                    x: pointer.x,
                    y: pointer.y,
                    duration: 1000,           // slower movement (1 second)
                    ease: 'Sine.easeInOut' 
                });

                scene.tweens.add({
                targets: boy,
                x: pointer.x + 50,
                y: pointer.y,
                duration: 1200, // a little slower for trailing effect
                ease: 'Sine.easeInOut',
                delay: 100       // optional delay to look like it’s following
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
