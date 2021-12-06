"use strict";

// creates a gameboard object
const gameBoardModule = (() => {
            const gameBoardArray = ["X", "X", "X", "0", "0", "0", "X", "X", "X"];
            const gameBoard = document.getElementById("gameboard");
            const cells = document.querySelectorAll("[data-cell]");
            cells.forEach(cell => {
                cell.addEventListener("click", something, {once: true});
            });

            function something(event) {
                console.log("clicked");
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

// define winning conditions
// define whose turn it is
// check if winning condition is met
// switch players
// announce winner