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
    const cellIndexesAI = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // indexes of the cells the AI can play
    const gameBoard = document.getElementById("gameboard");
    const cells = document.querySelectorAll("[data-cell]");
    return {
        gameBoardArray,
        gameBoard,
        cells,
        winningCombinations,
        cellIndexesAI,
    };
})();

// creates a player object
const createPlayer = (playerName, mark, isAI) => {
    return {
        playerName,
        mark,
        isAI,
    }
}

// Logic for the gameflow    
const playGameModule = (() => {

    const startButton = document.getElementById("startBtn");
    const getModal = document.getElementById("newGame-modal");
    const p1InputField = document.getElementById("nameInputP1");
    const p2InputField = document.getElementById("nameInputP2");
    const getOverModal = document.getElementById("over-modal");
    const win = document.getElementById("winnerID");
    const resetButton = document.getElementById("resetBtn");

    const player1 = createPlayer("", "X", false);
    const player2 = createPlayer("", "O", false);
    let activePlayer;
    let turn = 0;
    let winner;
    let won = false;

    startgame();
    addListeners();

    //  Hide the startup modal
    function startgame() {
        startButton.addEventListener("click", () => {
            getModal.classList.add("hidden");
            getPlayerDetails();

            //get player names from input fields
            function getPlayerDetails() {
                // check if player name field is empty and assign a default name
                p1InputField.value == "" ? player1.playerName = "Player 1" : player1.playerName = p1InputField.value;
                p2InputField.value == "" ? player2.playerName = "Player 2" : player2.playerName = p2InputField.value;
                // let player 2 be an AI if the checkbox is checked
                if (document.getElementById("aiCheck").checked === true) {
                    player2.isAI = true;
                }
                // update Playernames in the DOM
                document.getElementById("player1-name").textContent = player1.playerName;
                if (player2.isAI === true) {
                    document.getElementById("player2-name").textContent = player2.playerName + " (AI)";
                } else {
                    document.getElementById("player2-name").textContent = player2.playerName;
                }
            }
        });
        getActivePlayer();
    }

    // create a simple counter that determines who the currently active player is
    function getActivePlayer() {
        if (won === true) {
            return
        }
        if (turn % 2 === 0) {
            activePlayer = player1;
        } else {
            activePlayer = player2;
            if (player2.isAI === true && turn < 9) {
                removeListeners(); // remove the evenntListeners for 500ms to prevent input while AI is "thinking"
                setTimeout(addListeners, 500);
                setTimeout(playAI, 500); // make it look lie the AI needs time to think
            }
        }
    }

    // render gameBoard-data to DOM
    const renderGameBoard = () => {
        gameBoardModule.gameBoardArray.forEach(function (item, i) {
            gameBoardModule.cells[i].textContent = item;
        });
    }

    // eventListeners for every gameboard-cell
    function addListeners() {
        gameBoardModule.cells.forEach(cell => {
            cell.addEventListener("click", handleClick);
        });
    }

    // turn flow for a human player
    function handleClick() {
        if (gameBoardModule.gameBoardArray[this.dataset.index - 1] === "") { // prevent input to an non-empty field
            gameBoardModule.gameBoardArray.splice(this.dataset.index - 1, 1, activePlayer.mark); // insert activePlayer mark into gameBoard array
            gameBoardModule.cellIndexesAI.splice(this.dataset.index - 1, 1, null); //remove currently played cell from AI cell array
            this.classList.add(activePlayer.mark + "class"); // add class to color element
            turn++;
            renderGameBoard();
            checkForWinner();
            if (won !== true) {
                checkForTie();
            }
            getActivePlayer();
        }
    }

    // turn flow for the AI
    function playAI() {
        if (won === false) {
            getRandomMove();
            turn++;
            renderGameBoard();
            checkForWinner();
            checkForTie();
            getActivePlayer();
        } else {
            return
        }
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
                won = true;
                winTheGame();
            }
        }

        function winTheGame() {
            win.textContent = `${winner} has won the round!`;
            removeListeners();
            setTimeout(showOverModal, 1000);
            showResetbutton();
        }
    }

    const checkForTie = () => {
        if (turn === 9) {
            gameTie();
        }
    }

    function gameTie() {
        win.textContent = "It's a tie!";
        showResetbutton();
        setTimeout(showOverModal, 1000);
    }

    // shows modal after round is over
    const showOverModal = () => {
        getOverModal.classList.remove("hidden");
    }

    // removes modal after round is over
    const removeOverModal = () => {
        getOverModal.classList.add("hidden");
    }

    // reset button
    const showResetbutton = () => {
        resetButton.classList.remove("hidden");
        resetButton.addEventListener("click", () => {
            resetButton.classList.toggle("hidden");
            resetGame();
        });
    }

    // reset all necessary game variables
    const resetGame = () => {
        won = false;
        activePlayer = undefined;
        turn = 0;
        gameBoardModule.cellIndexesAI = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        gameBoardModule.gameBoardArray = ["", "", "", "", "", "", "", "", ""];
        removeOverModal();
        removeClasses();
        renderGameBoard();
        addListeners();
        startgame();

        function removeClasses() {
            const currentCellArray = Array.from(document.getElementsByClassName("cell"));
            currentCellArray.forEach(element => element.classList.remove("Xclass"));
            currentCellArray.forEach(element => element.classList.remove("Oclass"));
        }
    }

    // remove eventlisteners
    function removeListeners() {
        gameBoardModule.cells.forEach(cell => {
            cell.removeEventListener("click", handleClick);
        });
    }

    // logic for the AI
    function getRandomMove() {
        const onlyValidValues = gameBoardModule.cellIndexesAI.filter(value => value != null); // prevent the AI from choosing null
        let randomItem = onlyValidValues[Math.floor(Math.random() * onlyValidValues.length)]; // chose a random item from a list of valid moves
        gameBoardModule.gameBoardArray.splice(randomItem, 1, activePlayer.mark); // update the gameBoard
        gameBoardModule.cellIndexesAI.splice(randomItem, 1, null); // update the list of legal moves for the AI
        let currentCell = gameBoardModule.cells[randomItem]
        currentCell.classList.add(activePlayer.mark + "class"); // add class to color element;
    }

})();