"use strict";

let activePlayer;

// creates a gameboard object
const gameBoardModule = (() => {
            const gameBoardArray = ["", "", "", "", "", "", "", "", ""];
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
    // create two players
    const player1 = createPlayer("Player 1", "X");
    const player2 = createPlayer("Player 2", "O");
    // create a simple counter that determines who the currently active player is
    let count = 0;
    const getActivePlayer = () => {
        if (count % 2 === 0) {
            activePlayer = player1;
        } else {
            activePlayer = player2;
        }
        count++;
    }
    // eventListeners for every gameboard-cell
    gameBoardModule.cells.forEach(cell => {
        cell.addEventListener("click", handleClick, {once: true}); //let the eventListener fire only once for the according cell
    });

    // get the currently active player and inserts the players mark at the corresponding position in the gameBoardArray
    function handleClick() {
        getActivePlayer();
        gameBoardModule.gameBoardArray.splice(this.dataset.index-1, 1, activePlayer.mark);
        renderGameBoard();
    }
})();

// define winning conditions
// check if winning condition is met
// announce winner