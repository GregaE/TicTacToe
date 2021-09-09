
/// GAME BOARD - module

const Gameboard = (() => {

    //  Create game board array

    let gameBoard = [];

    // cache DOM

    const boardContainer = document.querySelector("#gameboard");

    // Function

    function render() {
        for (let count = 1; count <= 9; count++) {
            gameBoard.push({
                marked: ""
            })
        }

        gameBoard.forEach(function(square, index) {
            cell = document.createElement('div');
            cell.setAttribute("class","board-block");
            cell.setAttribute("id",index);
            cell.addEventListener("click", Game.play);
            boardContainer.appendChild(cell)
        });
    }

    function fetch () {
        return gameBoard;
    }

    function update(cell, fill) {
        gameBoard[cell].marked = fill;
        document.getElementById(cell).classList.add("marked")
        document.getElementById(cell).innerHTML = fill;
        document.getElementById(cell).removeEventListener("click", Game.play)
    }

    function reset () {
        boardContainer.innerHTML = `<div id="result">
        </div>`;
        gameBoard = []
        render()
    }

    function deactivate () {
        let blocks = document.getElementsByClassName("board-block");
        for (let i = 0; i < blocks.length; i++) {
            blocks[i].removeEventListener("click", Game.play);
            setTimeout(function(){ blocks[i].classList.add("deactivate"); }, 1000)

        }
        setTimeout(function() {
            document.getElementById("result").classList.add("reveal");
        }, 1000)
    }

    function highlightWinner (sequence) {
        for (let i = 0; i < sequence.length; i++) {
            document.getElementById(sequence[i]).classList.add("winner")

        }
    }

    return {
        fetch,
        update,
        render,
        reset,
        deactivate,
        highlightWinner
    };
})();

/// PLAYERS OBJECT - factory

const Player = (name, type) => {
    return { name, type };
};

const Player1 = Player("player", "X");
const Player2 = Player("computer", "O");
let currentPlayer = Player1;


/// GAME OBJECT - module

const Game = (() => {

    // GAME PROGRESS AND CONTROLS

    function play (event) {

        let cell = event.target.id;
        mark(cell)

        if (getWinner(Gameboard.fetch()) === "X") {
            pronounceWinner(Player1.type === "X" ? Player1.name : Player2.name);
            Gameboard.deactivate()
        }
        else if (getWinner(Gameboard.fetch()) === "O") {
            pronounceWinner(Player1.type === "O" ? Player1.name : Player2.name);
            Gameboard.deactivate()
        }
        else if (Gameboard.fetch().every(cell => cell.marked !== "")){
            pronounceTie()
            Gameboard.deactivate()
        }
        else {
            setTimeout(
                function(){
                    mark(getRandom());

                    if (getWinner(Gameboard.fetch()) === "X") {
                        pronounceWinner(Player1.type === "X" ? Player1.name : Player2.name);
                        Gameboard.deactivate()
                    }
                    else if (getWinner(Gameboard.fetch()) === "O") {
                        pronounceWinner(Player1.type === "O" ? Player1.name : Player2.name);
                        Gameboard.deactivate()
                    }
                    else if (Gameboard.fetch().every(cell => cell.marked !== "")){
                        pronounceTie()
                        Gameboard.deactivate()
                    }
                }, 600);
        }

    }

    function switchPlayer (event) {
        if (event.target.id === "o-play") {
            if (!Gameboard.fetch().every(cell => cell.marked === "")) {
                restart()
            }
            mark(getRandom());
            Player1.name = "computer";
            Player2.name = "player"
            document.getElementById("x-play").classList.remove("active");
            document.getElementById("o-play").removeEventListener("click", switchPlayer);
            document.getElementById("o-play").classList.add("active");
            document.getElementById("x-play").addEventListener("click", switchPlayer);
        }
        else {
            Player1.name = "player";
            Player2.name = "computer"
            document.getElementById("x-play").classList.add("active");
            document.getElementById("o-play").addEventListener("click", switchPlayer);
            document.getElementById("o-play").classList.remove("active");
            document.getElementById("x-play").removeEventListener("click", switchPlayer);
            restart()
        }
    }

    function restart() {
        Gameboard.reset()
        currentPlayer = Player1;
        if (document.getElementById("o-play").classList.contains("active")) {
            mark(getRandom())
        }
    }

    // Update gameboard array helper functions

    function isMarked (cell) {
        return Gameboard.fetch()[cell].marked === ""
    }

    function mark (index) {
        if (isMarked(index) !== "") {
            Gameboard.update(index, currentPlayer.type);
            if (currentPlayer === Player1) {
                currentPlayer = Player2;
            } else {
                currentPlayer = Player1;
            }
        }
    }

    // COMPUTER AI

    // computer picks a random empty field
    function getRandom () {
        // filter out marked squares
        let nonMarked = Gameboard.fetch().filter(cell => cell.marked === "")
        let random = nonMarked[Math.floor(Math.random()*nonMarked.length)]
        return Gameboard.fetch().indexOf(random)
    }

    // computer picks the optimal empty field
    function getOptimal () {
        // filter out marked squares
        let nonMarked = [];

        for (let i = 0; i < Gameboard.fetch().length; i++) {
            if(Gameboard.fetch()[i].marked === "") {
                nonMarked.push(i)
            }
        }
        console.log(Gameboard.fetch());

        // let x = Gameboard.fetch().map(option => findPlacement(option, Gameboard.fetch()))

        function findPlacement (selection, board) {
            let updatedBoard = board.map(a => ({...a}))
            updatedBoard[selection].marked = "O";

            if (getWinner(updatedBoard) === "X") {
                return -10
            } else if (getWinner(updatedBoard) === "O") {
                return 10
            }
            else if (updatedBoard.every(cell => cell.marked !== "")) {
                return 0
            }
            else {
                //return findPlacement(selection, updatedBoard)
            }
        }

        return nonMarked.map(selection => findPlacement(selection, Gameboard.fetch()))
    }

    // DEFINE WINNER

    // Winning Combinations
    const combos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    function getWinner (boardState) {
        let xArray = [];
        let oArray = [];

        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i].marked === "X") {
                xArray.push(i)
            } else if (boardState[i].marked === "O") {
                oArray.push(i)
            }
        }

        let winCombo;

        let xWin = combos.some(function (combo) {
            if(combo.every(number => xArray.includes(number))){
                winCombo = combo;
                Gameboard.highlightWinner(winCombo)
                return true;
            }
        });

        let oWin = combos.some(function (combo) {
            if(combo.every(number => oArray.includes(number))){
                winCombo = combo;
                Gameboard.highlightWinner(winCombo)
                return true;
            }
        });

        if (xWin){
            return "X"

        }
        else if (oWin){
            return "O"
        }
    }

    function pronounceWinner(player) {
        document.getElementById("result").innerHTML = player + " wins";
    }

    function pronounceTie() {
        document.getElementById("result").innerHTML = "It's a tie";
    }

    // Cache DOM

    const selectButtons = document.querySelectorAll(".select-player")
    const restartButton = document.getElementById("restart");

    // Events

    restartButton.addEventListener("click", restart)
    selectButtons.forEach(button => {
        button.addEventListener("click", switchPlayer);
    });

    return {
        play,
        getOptimal,
        pronounceWinner
    };
})();

Gameboard.render()









