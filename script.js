"use strict";

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

    let player1 = createPlayer("", "X", 0);
    let player2 = createPlayer("", "O", 0);

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
                let p1InputField = document.getElementById("nameInputP1");
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
    let activePlayer;
    let turn = 0;
    const getActivePlayer = () => {
        if (turn % 2 === 0) {
            activePlayer = player1;
        } else {
            activePlayer = player2;
        }
        turn++;
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
        // loop over all possible winning combinations and check if all three values of a winning combination occur in currentMarkIndexes   
        for (let i = 0; i < gameBoardModule.winningCombinations.length; i++) {
            let winningValue1 = gameBoardModule.winningCombinations[i][0];
            let winningValue2 = gameBoardModule.winningCombinations[i][1];
            let winningValue3 = gameBoardModule.winningCombinations[i][2];
                if (currentMarkIndexes.includes(winningValue1) && currentMarkIndexes.includes(winningValue2) && currentMarkIndexes.includes(winningValue3)) {
                    winner = activePlayer.playerName;
                    setTimeout(winTheGame, 100);
                    return
                } 
        }

        function winTheGame() {
            alert(`${winner} has won the round`);
            showResetbutton();
            gameBoardModule.cells.forEach(cell => {
                cell.removeEventListener("click", handleClick, {once: true});
            });
        }
    }

    const checkForTie = () => {
        if (turn === 9) {
            setTimeout(gameTie, 100);
        }
    }

    function gameTie() {
        alert("It's a tie!");
        showResetbutton();
        gameBoardModule.cells.forEach(cell => {
            cell.removeEventListener("click", handleClick);
        });
    }

    // reset button
    const showResetbutton = () => {
        const resetButton = document.getElementById("resetBtn");
        resetButton.classList.remove("hidden");
        resetButton.addEventListener("click", () => {
            resetButton.classList.toggle("hidden");
            resetGame();
        });
    }

    // reset the game
    const resetGame = () => {
        activePlayer = undefined;
        turn = 0;
        gameBoardModule.gameBoardArray = ["", "", "", "", "", "", "", "", ""];
        renderGameBoard();
        gameBoardModule.cells.forEach(cell => {
            cell.addEventListener("click", handleClick, {once: true});
        });
    }
})();