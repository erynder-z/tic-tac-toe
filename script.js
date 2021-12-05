"use strict";

// creates a gameboard object
const gameBoard = (() => {
    const row1 = [null, null, null];
    const row2 = [null, null, null];
    const row3 = [null, null, null];
    return {
        row1,
        row2,
        row3,
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