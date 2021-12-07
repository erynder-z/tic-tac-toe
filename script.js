"use strict";

let activePlayer;

// creates a gameboard object
const gameBoardModule = (() => {
            const gameBoardArray = ["X", "O", "X", "0", "0", "0", "X", "X", "X"];
            const gameBoard = document.getElementById("gameboard");
            const cells = document.querySelectorAll("[data-cell]");
            return {
                gameBoardArray,
                gameBoard,
                cells,
    };
})();

// creates a player object
const createPlayer = (playerName, mark) => {
    return {
        playerName,
        mark,
        
    }
}

// render gameBoard-data
const renderGameBoard = () => {
    gameBoardModule.gameBoardArray.forEach(function (item, i) {
        gameBoardModule.cells[i].textContent = item;
    });
}
// Logic for the gameflow    
const playGameModule = (() => {
    const player1 = createPlayer("Player 1", "X");
    const player2 = createPlayer("Player 2", "O");

    let count = 0;
    const getActivePlayer = () => {
        if (count % 2 === 0) {
            activePlayer = player1;
        } else {
            activePlayer = player2;
        }
         count++;
    }

    gameBoardModule.cells.forEach(cell => {
        cell.addEventListener("click", handleClick, {once: true});
    });
    

    function handleClick() {
        getActivePlayer();
        this.textContent = activePlayer.mark;
    }
})();

// define winning conditions
// check if winning condition is met
// switch players
// announce winner