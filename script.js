"use strict";

let activePlayer;

// creates a gameboard object
const gameBoardModule = (() => {
    const gameBoardArray = ["", "", "", "", "", "", "", "", ""];
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    const gameBoard = document.getElementById("gameboard");
    const cells = document.querySelectorAll("[data-cell]");
    return {
        gameBoardArray,
        gameBoard,
        cells,
        winningCombinations,
    };
})();

// creates a player object
const createPlayer = (playerName, mark) => {
    return {
        playerName,
        mark,
    }
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

    // render gameBoard-data
    const renderGameBoard = () => {
        gameBoardModule.gameBoardArray.forEach(function (item, i) {
            gameBoardModule.cells[i].textContent = item;
        });
        console.log("render");
    }
    // eventListeners for every gameboard-cell
    gameBoardModule.cells.forEach(cell => {
        cell.addEventListener("click", handleClick, {once: true}); //let the eventListener fire only once for the according cell
    });

    // get the currently active player and inserts the players mark at the corresponding position in the gameBoardArray
    function handleClick() {
        getActivePlayer();
        gameBoardModule.gameBoardArray.splice(this.dataset.index - 1, 1, activePlayer.mark);
        renderGameBoard();
        checkForWinner();
        //checkForDraw();
    }

    // check if activePlayer has a winning combination in the gameBoardArray
    const checkForWinner = () => {
        // checks gameBoardArray for all of currentplayers' marks and saves their indexes in a new array
        const currentMarkIndexes = [];
        gameBoardModule.gameBoardArray.forEach((mark, index) => mark === activePlayer.mark ? currentMarkIndexes.push(index) : null);
        // compares the currentMarkIndexes with the winningComnbinations and declares a win if a match is detected
        ////// better done with an array method??
        for (let i = 0; i < gameBoardModule.winningCombinations.length; i++) {
            if (JSON.stringify(gameBoardModule.winningCombinations[i]) == JSON.stringify(currentMarkIndexes)) {
                setTimeout(winTheGame, 100); // prevents the winner beeing announced before gameboard is rendered
                return
            }
        }

        function winTheGame() {
            alert(`${activePlayer.playerName} has won the round`);
            console.log("check");
            resetGame();
        }
    }

    // reset the game
    const resetGame = () => {
        activePlayer = undefined;
        gameBoardModule.gameBoardArray = ["", "", "", "", "", "", "", "", ""];
        renderGameBoard();
    }
})();

// define winning conditions
// check if winning condition is met
// announce winner