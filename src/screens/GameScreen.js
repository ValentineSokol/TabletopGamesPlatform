import React, { useState } from 'react';
import GameBoard from '../components/GameBoard/GameBoard';
import generateBoard from "../gameLogic/generateBoard";
/*
   This screen is responsible for drawing the game board of a selected game, as well as
   submitting moves to the server and managing the game's logic.
*/
const GameScreen = (props) => {
    const [gameState, setGameState] = useState({});

    return (
        <div>
            <GameBoard
                board={generateBoard()}
                moves={gameState.moves}
                currentMoveIndex={gameState.currentMoveIndex}
            />
        </div>
    );
};

export default GameScreen;
