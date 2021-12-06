"use strict";

// creates a gameboard object
const gameBoard = (() => {
    const gameBoardArray = [null, null, null, null, null, null, null, null, null];
    return {
        gameBoardArray
    };
})();

// creates a player object
const createPlayer = (name, symbol) => {
    return {
        name,
        symbol,
    }
}

// create two players
const player1 = createPlayer("Player 1", "X");
const player2 = createPlayer("Player 2", "O");

// define winning conditions
// define whose turn it is
// check if winning condition is met
// switch players
// announce winner