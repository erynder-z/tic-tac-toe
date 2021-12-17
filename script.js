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
    let counter = 8;

    const allPossibleWinningCombinationsAI = gameBoardModule.winningCombinations;
    let targetCombination;
    let targetCombinationValue1;
    let targetCombinationValue2;
    let targetCombinationValue3;
    let needNewTarget = true;


    /*     let randomWinningArray;
        let targetMove;
        let normalMove;
        let targetArrayValue1;
        let targetArrayValue2;
        let targetArrayValue3;
        let winningArrayValue1;
        let winningArrayValue2;
        let winningArrayValue3; */

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
            gameBoardModule.cellIndexesAI.splice(this.dataset.index - 1, 1, "occupied"); //remove currently played cell from AI cell array
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
        counter = 8;
        gameBoardModule.cellIndexesAI = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        gameBoardModule.gameBoardArray = ["", "", "", "", "", "", "", "", ""];
        /* targetMove = undefined; */
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

    const AILevel = () => {
        if (document.getElementById("lvl").value === "easy") {
            return "easy";
        } else if (document.getElementById("lvl").value === "medium") {
            return "medium";
        }
    }

    // logic for the easy AI
    function getRandomMove() {
        const onlyValidValues = gameBoardModule.cellIndexesAI.filter(value => value != "occupied"); // prevent the AI from choosing null
        let randomItem = onlyValidValues[Math.floor(Math.random() * onlyValidValues.length)]; // chose a random item from a list of valid moves
        gameBoardModule.gameBoardArray.splice(randomItem, 1, activePlayer.mark); // update the gameBoard
        gameBoardModule.cellIndexesAI.splice(randomItem, 1, "occupied"); // update the list of legal moves for the AI
        let currentCell = gameBoardModule.cells[randomItem]
        currentCell.classList.add(activePlayer.mark + "class"); // add class to color element;
    }

    // logic for the medium AI
    function getNormalMove() {

        let AImove;

        chooseTarget(); // select a winning combination to target
        chooseMove(); // choose a random move from chosen target
        playTargetMove(); // play move
        updateAI(); // prevent AI from playing the same move twice


        function chooseTarget() {
            
            getRandomTarget();

            // choose a random winning combination
            function getRandomTarget() {
                if (needNewTarget === true) { // if targetCombination is invalid, chose another one (= if "X" already occipues any of this targets positions)
                    targetCombination = allPossibleWinningCombinationsAI[Math.floor(Math.random() * allPossibleWinningCombinationsAI.length)];
                    removeCombinationFromAIPool();
                    // if no valid target can be found > play random move
                } else if (targetCombination === "invalid") {
                    getRandomMove();
                }
                // check if winning combination is possible
                checkTarget(); 
            }

            function removeCombinationFromAIPool() {
                // remove chosen targetCombination from allPossibleWinningCombinationsAI
                let index = allPossibleWinningCombinationsAI.indexOf(targetCombination);
                allPossibleWinningCombinationsAI.splice(index, 1);
                // if no winning combination is possible: set target to invalid
                if (index < 0) {
                    targetCombination = "invalid"
                }
            }

            function checkTarget() {
                // play random move if target is invalid
                if (targetCombination === "invalid") {
                    getRandomMove();
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
            console.log(targetCombination);
        }



        function chooseMove() {
            // chose a random value/move from target
            AImove = targetCombination[Math.floor(Math.random() * targetCombination.length)];
           do {
               AImove = targetCombination[Math.floor(Math.random() * targetCombination.length)];
            } while (AImove === undefined);
        }


        function playTargetMove() {
            // play  AImove
            gameBoardModule.gameBoardArray.splice(AImove, 1, activePlayer.mark);
            // add classes
            let currentCell = gameBoardModule.cells[AImove];
            currentCell.classList.add(activePlayer.mark + "class"); // add class to color element;    
        }


        function updateAI() {
            // remove that value from the targetMove-Array // replace with "occupied"
            // remove that value in all remaining winning combinations // replace with "occupied"
            // nremove that value also on the currentCellindexesAI-array // replace with occupied
            // goto checkTarget
        }

    }




    /*     // logic for the medium AI
        function getNormalMove() {
            const AIwinningCombinations = gameBoardModule.winningCombinations;
            // AI tries to get a winning combination
            checkTargetMove(targetMove);
            getLegalMove();
            playNormalMove();

            function checkTargetMove(targetArray) {
                if (targetArray === undefined) { //AI grabs a random winning combination
                    targetArray = AIwinningCombinations[Math.floor(Math.random() * AIwinningCombinations.length)];
                }

                //if targetarray contains undefined > get another one
                // if AIwinningcombinations contains no element without undefined > play random move
            
                targetArrayValue1 = targetArray[0];
                targetArrayValue2 = targetArray[1];
                targetArrayValue3 = targetArray[2];


                if (gameBoardModule.gameBoardArray[targetArrayValue1] !== "X" && gameBoardModule.gameBoardArray[targetArrayValue2] !== "X" && gameBoardModule.gameBoardArray[targetArrayValue3] !== "X") { // Ai checks if winning combination is still available
                    targetMove = targetArray; // if winning combination is still available: set as target
                } else {
                    searchForWinningArray(); // if chosen random winning combination was not available : seach for new one
                }
                console.log("Target move: ");
                console.log(targetMove);
            }


            function searchForWinningArray() {
                if (counter === 0) {
                    getRandomMove();
                } else {
                    counter--;
                    targetMove = gameBoardModule.winningCombinations[Math.floor(Math.random() * gameBoardModule.winningCombinations.length)]; // set target to a new random winning combination
                    checkTargetMove(targetMove); // passes new target so be checked for availability
                }
            }

            function getLegalMove() {
                let legalMove = targetMove;
                const checkLegalMove = legalMove.filter(value => value != undefined);

                normalMove = checkLegalMove[Math.floor(Math.random() * checkLegalMove.length)]; // get the value of an random element in the array
                let index = legalMove.indexOf(normalMove); // get the index of above random value in that array
                legalMove.splice(index, 1, undefined);

                gameBoardModule.cellIndexesAI.splice(normalMove, 1, undefined);
                for (let i = 0; i < AIwinningCombinations.length; i++) {
                    
                    for (let j = 0; j < AIwinningCombinations[i].length; j++) {
                        
                        if (AIwinningCombinations[i][j] === normalMove) {
                            AIwinningCombinations[i][j] = undefined;
                        }
                    }
                }

            
                console.log("current move: " + normalMove);
                console.log("AI winning combinations:");
                console.log(AIwinningCombinations);
            }

            function playNormalMove() { //prevent playing a field that already has a circle // doe not know where circles have already been put
                gameBoardModule.gameBoardArray.splice(normalMove, 1, activePlayer.mark);

                let currentCell = gameBoardModule.cells[normalMove];
                currentCell.classList.add(activePlayer.mark + "class"); // add class to color element;              
            }
        } */

})();