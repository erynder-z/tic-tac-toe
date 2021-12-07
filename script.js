"use strict";

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
    // check whose turn it is
    gameBoardModule.cells.forEach(cell => {
        cell.addEventListener("click", handleClick, {once: true});
    });

    function handleClick() {
        console.log(this.dataset.index);
        this.textContent = "X";
    }
})();

// define winning conditions
// check if winning condition is met
// switch players
// announce winner