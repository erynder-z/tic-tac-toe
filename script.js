"use strict";

// creates a gameboard object
const gameBoardModule = (() => {
            const gameBoardArray = ["X", "O", "X", "0", "0", "0", "X", "X", "X"];
            const gameBoard = document.getElementById("gameboard");
            const cells = document.querySelectorAll("[data-cell]");
            // check whose turn it is
            // currentPlayerMarkt = mark of the current player
/*             cells.forEach(cell => {
                cell.addEventListener("click", something, {once: true});
            });
            function something() { 
                console.log(this.dataset.index);
                this.textContent = currentPlayerMark;
            } */
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
    gameBoardModule.gameBoardArray.forEach(function(item, i) {
        gameBoardModule.cells[i].textContent = item;
    });
    }
    
const playGameModule = () => {
    gameBoardModule.cells.forEach(cell => {
        cell.addEventListener("click", something, {once: true});
    });
    function something() { 
        console.log(this.dataset.index);
        this.textContent = currentPlayerMark;
    }
}

// define winning conditions
// check if winning condition is met
// switch players
// announce winner