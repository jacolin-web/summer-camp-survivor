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
      mainMenu.scene.start('Game');
      setStarted(true);
    }
  };

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} />
      {!started && (
        <button className="button" onClick={startGame}>
          Start Game
        </button>
      )}
    </div>
  );
}

export default App
