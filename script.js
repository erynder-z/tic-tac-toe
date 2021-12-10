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

    let player1 = createPlayer("", "X");
    let player2 = createPlayer("", "O");
    startgame();

    //  Hide the startup modal
    function startgame() {
        const startButton = document.getElementById("startBtn");
        const getModal = document.getElementById("newGame-modal");
        startButton.addEventListener("click", () => {
            getModal.classList.add("hidden");
            getPlayerDetails();

            //get player names from input fields
            function getPlayerDetails() {
                // check if player name field is empty and assign a default name
                let p1InputField =  document.getElementById("nameInputP1");
                let p2InputField = document.getElementById("nameInputP2");
                p1InputField.value == "" ? player1.playerName = "Player 1" : player1.playerName = p1InputField.value;
                p2InputField.value == "" ? player2.playerName = "Player 2" : player2.playerName = p2InputField.value;
                //update Playernames in the DOM
                document.getElementById("player1-name").textContent = player1.playerName;
                document.getElementById("player2-name").textContent = player2.playerName;
            }
        });
    }

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
        checkForTie();
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
                setTimeout(winTheGame, 100); // prevents the winner beeing announced before gameboard is rendered. There surely is a better way
                return
            }
        }

        function winTheGame() {
            alert(`${activePlayer.playerName} has won the round`);
            resetGame();
        }
    }

    const checkForTie = () => {
        if (count === 9) {
            setTimeout(gameTie, 100);
        }
    }

    function gameTie() {
        alert("It's a tie! You are both winners! =)");
        resetGame();
    }

    // reset the game
    const resetGame = () => {
        activePlayer = undefined;
        count = 0;
        gameBoardModule.gameBoardArray = ["", "", "", "", "", "", "", "", ""];
        renderGameBoard();
    }
})();