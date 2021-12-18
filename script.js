"use strict";

// creates a gameboard
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

    let allPossibleWinningCombinationsAI = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    const gameBoard = document.getElementById("gameboard");
    const cells = document.querySelectorAll("[data-cell]");
    return {
        gameBoardArray,
        gameBoard,
        cells,
        winningCombinations,
        cellIndexesAI,
        allPossibleWinningCombinationsAI,
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

    let targetCombination;
    let targetCombinationValue1;
    let targetCombinationValue2;
    let targetCombinationValue3;
    let needNewTarget = true;


    //  Hide the startup modal
    const startgame = () => {
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
    const getActivePlayer = () => {
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
    const addListeners = () => {
        gameBoardModule.cells.forEach(cell => {
            cell.addEventListener("click", handleClick);
        });
    }

    // turn flow for a human player
    function handleClick() {
        // input only in empty cells
        if (gameBoardModule.gameBoardArray[this.dataset.index - 1] === "") {
            // insert activePlayer mark into gameBoard array
            gameBoardModule.gameBoardArray.splice(this.dataset.index - 1, 1, activePlayer.mark);
            // remove currently played cell from AI cell array
            gameBoardModule.cellIndexesAI.splice(this.dataset.index - 1, 1, "occupied");
            // add class to color element
            this.classList.add(activePlayer.mark + "class");
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
    const playAI = () => {
        AILevel();

        if (AILevel() === "easy") {
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

        } else if (AILevel() === "medium") {
            if (won === false) {
                getNormalMove();
                turn++;
                renderGameBoard();
                checkForWinner();
                checkForTie();
                getActivePlayer();
            } else {
                return
            }
        }
    }

    // check if activePlayer has a winning combination in the gameBoardArray
    const checkForWinner = () => {

        // checks gameBoardArray for all of currentplayers' marks and saves their indexes in a new array
        const currentMarkIndexes = [];
        gameBoardModule.gameBoardArray.forEach((mark, index) => mark === activePlayer.mark ? currentMarkIndexes.push(index) : "occupied");

        // loop over all possible winning combinations and check if all three values of a winning combination occur in currentMarkIndexes   
        for (let i = 0; i < gameBoardModule.winningCombinations.length; i++) {
            let winningValue1 = gameBoardModule.winningCombinations[i][0];
            let winningValue2 = gameBoardModule.winningCombinations[i][1];
            let winningValue3 = gameBoardModule.winningCombinations[i][2];
            if (currentMarkIndexes.includes(winningValue1) && currentMarkIndexes.includes(winningValue2) && currentMarkIndexes.includes(winningValue3)) {
                winner = activePlayer.playerName;
                won = true;
                winTheGame();
                return
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

    const gameTie = () => {
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
        gameBoardModule.allPossibleWinningCombinationsAI = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        targetCombination = undefined;
        needNewTarget = true;
        removeOverModal();
        removeClasses();
        renderGameBoard();
        addListeners();
        startgame();
    }

    // remove Player classes
    const removeClasses = () => {
        const currentCellArray = Array.from(document.getElementsByClassName("cell"));
        currentCellArray.forEach(element => element.classList.remove("Xclass"));
        currentCellArray.forEach(element => element.classList.remove("Oclass"));
    }

    // remove eventlisteners
    const removeListeners = () => {
        gameBoardModule.cells.forEach(cell => {
            cell.removeEventListener("click", handleClick);
        });
    }

    // select AI level
    const AILevel = () => {
        if (document.getElementById("lvl").value === "easy") {
            return "easy";
        } else if (document.getElementById("lvl").value === "medium") {
            return "medium";
        }
    }

    // logic for the easy AI
    const getRandomMove = () => {

        let randomMove

        const chooseMoveEasy = () => {
            // prevent the AI from choosing occupied field
            const onlyValidValues = gameBoardModule.cellIndexesAI.filter(value => value != "occupied");
            // chose a random item from a list of valid moves
            randomMove = onlyValidValues[Math.floor(Math.random() * onlyValidValues.length)];
        }

        const playMoveEasy = () => {
            // update the gameBoard
            gameBoardModule.gameBoardArray.splice(randomMove, 1, activePlayer.mark);
            // add class to color element;
            let currentCell = gameBoardModule.cells[randomMove]
            currentCell.classList.add(activePlayer.mark + "class");
        }

        const updateAIEasy = () => {
            // update the list of legal moves for the AI
            gameBoardModule.cellIndexesAI.splice(randomMove, 1, "occupied");
        }

        chooseMoveEasy();
        playMoveEasy();
        updateAIEasy();
    }

    // logic for the medium AI
    const getNormalMove = () => {

        let AImove;

        const chooseTarget = () => {

            // choose a random winning combination
            const getRandomTarget = () => {
                if (needNewTarget === true) { // if targetCombination is invalid, chose another one (= if "X" already occipues any of this targets positions)
                    targetCombination = gameBoardModule.allPossibleWinningCombinationsAI[Math.floor(Math.random() * gameBoardModule.allPossibleWinningCombinationsAI.length)];
                    removeCombinationFromAIPool();
                    // if no valid target can be found > play random move
                } else if (targetCombination === "invalid") {
                    getRandomMove();
                }
                // check if winning combination is possible
                checkTarget();
            }

            const removeCombinationFromAIPool = () => {
                // remove chosen targetCombination from allPossibleWinningCombinationsAI
                let index = gameBoardModule.allPossibleWinningCombinationsAI.indexOf(targetCombination);
                gameBoardModule.allPossibleWinningCombinationsAI.splice(index, 1);
                // if no winning combination is possible: set target to invalid
                if (index === -1) {
                    targetCombination = "invalid"
                }
            }

            const checkTarget = () => {
                // play random move if target is invalid
                if (targetCombination === "invalid") {
                    getRandomMove();
                    return
                }
                // loop over every item in the choosen targetMove
                targetCombinationValue1 = targetCombination[0];
                targetCombinationValue2 = targetCombination[1];
                targetCombinationValue3 = targetCombination[2];

                // check if all moves from that target are possible (= not "X")
                if (gameBoardModule.gameBoardArray[targetCombinationValue1] !== "X" && gameBoardModule.gameBoardArray[targetCombinationValue2] !== "X" && gameBoardModule.gameBoardArray[targetCombinationValue3] !== "X") {
                    // if current combination is valid > return that combination
                    needNewTarget = false;
                } else {
                    // if current combination is not possible > get new one
                    needNewTarget = true;
                    getRandomTarget();
                }
            }
            getRandomTarget();
        }

        const chooseMove = () => {
            if (targetCombination === "invalid") {
                return
            } else {
                // filter invalid moves
                const filteredTargetCombination = targetCombination.filter(value => value != "occupied");
                // chose a random value/move from target
                AImove = filteredTargetCombination[Math.floor(Math.random() * filteredTargetCombination.length)];
            }
        }


        const playTargetMove = () => {
            if (targetCombination === "invalid" || AImove === undefined) {
                return
            } else {
                // play  AImove
                gameBoardModule.gameBoardArray.splice(AImove, 1, activePlayer.mark);
                // add classes
                let currentCell = gameBoardModule.cells[AImove];
                currentCell.classList.add(activePlayer.mark + "class"); // add class to color element;    
            }
        }


        const updateAI = () => {
            if (targetCombination === "invalid") {
                return
            }
            // remove that value from the targetCombination-Array // replace with "occupied"
            let index = targetCombination.indexOf(AImove);
            targetCombination.splice(index, 1, "occupied");
            // remove that value in all remaining possible winning combinations // replace with "occupied"
            for (let i = 0; i < gameBoardModule.allPossibleWinningCombinationsAI.length; i++) {
                for (let j = 0; j < gameBoardModule.allPossibleWinningCombinationsAI[i].length; j++) {
                    if (gameBoardModule.allPossibleWinningCombinationsAI[i][j] === AImove) {
                        gameBoardModule.allPossibleWinningCombinationsAI[i][j] = "occupied";
                    }
                }
            }
            // remove that value also on the currentCellindexesAI-array // replace with occupied
            gameBoardModule.cellIndexesAI.splice(AImove, 1, "occupied");
        }

        chooseTarget();
        chooseMove();
        playTargetMove();
        updateAI();
    }

    startgame();
    addListeners();

})();