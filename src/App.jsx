import { useRef, useState } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './PhaserGame';

function App ()
{
    const phaserRef = useRef();
    const [started, setStarted] = useState(false);

    const startGame = () => {
    const mainMenu = phaserRef.current?.scene; // this is MainMenu scene

    if (mainMenu && mainMenu.scene.key === 'MainMenu') {
      mainMenu.scene.launch('DialogueScene', {
        lines: [
          'Welcome to the forest.',
          'Avoid the zombie if you can.',
          'Click to move around!'
        ],
        onComplete: () => {
          mainMenu.scene.start('Game'); // start game AFTER dialogue
          setStarted(true);             // hide start button
        }
      });
      setStarted(true);
    }
  };

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} />
    </div>
  );
}

export default App
