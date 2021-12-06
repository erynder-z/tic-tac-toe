"use strict";

// creates a gameboard object
const gameBoardModule = (() => {
            const gameBoardArray = ["X", "O", "X", "0", "0", "0", "X", "X", "X"];
            const gameBoard = document.getElementById("gameboard");
            const cells = document.querySelectorAll("[data-cell]");
            cells.forEach(cell => {
                cell.addEventListener("click", something, {once: true});
            });
            function something(event) { 
                console.log("test"); // add symbol of the current player
            }
            return {
                gameBoardArray,
                gameBoard,
                cells,
    };
})();

// creates a player object
const createPlayer = (playerName, symbol) => {
    return {
        playerName,
        symbol,
    }
}

// render gameBoard-data
const renderGameBoard = () => {
    gameBoardModule.gameBoardArray.forEach(function(item, i) {
        gameBoardModule.cells[i].textContent = item;
    });
    }

// define winning conditions
// define whose turn it is
// check if winning condition is met
// switch players
// announce winner