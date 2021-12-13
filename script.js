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

    let player1 = createPlayer("", "X", false);
    let player2 = createPlayer("", "O", false);
    let activePlayer;
    let turn = 0;
    let winner;
    let won = false;

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
                // update Playernames in the DOM
                document.getElementById("player1-name").textContent = player1.playerName;
                document.getElementById("player2-name").textContent = player2.playerName;
                // let player 2 be an AI if the checkbox is checked
                if (document.getElementById("aiCheck").checked === true) {
                    player2.isAI = true;
                }
            }
        });
        getActivePlayer();
    }

    // create a simple counter that determines who the currently active player is
    function getActivePlayer() {
        if (turn % 2 === 0) {
            activePlayer = player1;
        } else {
            activePlayer = player2;
            if (player2.isAI === true && turn < 9) {
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
    gameBoardModule.cells.forEach(cell => {
        cell.addEventListener("click", handleClick); //let the eventListener fire only once for the according cell
    });

    // turn for a human player
    function handleClick() {     
        if (gameBoardModule.gameBoardArray[this.dataset.index - 1] === "") { // prevent input to an non-empty field
            gameBoardModule.gameBoardArray.splice(this.dataset.index - 1, 1, activePlayer.mark); // insert activePlayer mark into gameBoard array
            gameBoardModule.cellIndexesAI.splice(this.dataset.index - 1, 1, null); //remove currently played cell from AI cell array
            turn++;
            renderGameBoard();
            checkForWinner();
            if (won !== true) {
                checkForTie();
            }
            getActivePlayer();
        }
    }

    // turn for the AI
    function playAI() {
        getRandomMove();
        turn++;
        renderGameBoard();
        checkForWinner();
        checkForTie();
        getActivePlayer();
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
                setTimeout(winTheGame, 100);
            }
        }

        function winTheGame() {
            alert(`${winner} has won the round`);
            showResetbutton();
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
        won = false;
        activePlayer = undefined;
        turn = 0;
        gameBoardModule.cellIndexesAI = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        gameBoardModule.gameBoardArray = ["", "", "", "", "", "", "", "", ""];
        renderGameBoard();
        startgame();
    }

    function getRandomMove() {
        const onlyValidValues = gameBoardModule.cellIndexesAI.filter(value => value != null); // prevent the AI from choosing null
        let randomItem = onlyValidValues[Math.floor(Math.random() * onlyValidValues.length)]; // chose a random item from a list of valid moves
        gameBoardModule.gameBoardArray.splice(randomItem, 1, activePlayer.mark); // update the gameBoard
        gameBoardModule.cellIndexesAI.splice(randomItem, 1, null); // update the list of legal moves for the AI
    }

})();

// toggle eventlisteners