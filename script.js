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
    const cellIndexesAI = [0, 1, 2, 3, 4, 5, 6, 7, 8];
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
            if (player2.isAI === true) {
                playAI();
            }
        }
        console.log(turn);
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
        gameBoardModule.gameBoardArray.splice(this.dataset.index - 1, 1, activePlayer.mark);
        gameBoardModule.cellIndexesAI.splice(this.dataset.index -1, 1, null); 
        /* updateArrayAI(); */
        turn++;
        renderGameBoard();
        checkForWinner();
        checkForTie();   
        getActivePlayer();    
    }

    function playAI() {
        const randomIndex = Math.floor(Math.random() * gameBoardModule.cellIndexesAI.length);
        const randomItem = gameBoardModule.cellIndexesAI.splice(randomIndex, 1)[0];
        gameBoardModule.gameBoardArray.splice(randomItem - 1, 1, activePlayer.mark);
        gameBoardModule.cellIndexesAI.splice(randomItem - 1, 1, null);
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
        // compares the currentMarkIndexes with the winningComnbinations and declares a win if a match is detected
        ////// better done with an array method??
        for (let i = 0; i < gameBoardModule.winningCombinations.length; i++) {
            if (JSON.stringify(gameBoardModule.winningCombinations[i]) == JSON.stringify(currentMarkIndexes)) {
                winner = activePlayer.playerName;
                setTimeout(winTheGame, 100); // prevents the winner beeing announced before gameboard is rendered. There surely is a better way
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
        startgame();
    }

    const updateArrayAI = () => {
        somethingsomthing;
    }
})();

// better way to prevent input to occupied field
// create AI index array from gameboardarray