
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
        console.log(gameBoard[cell].marked)
        document.getElementById(cell).classList.add("marked")
        document.getElementById(cell).innerHTML = fill;

    }

    function reset () {
        boardContainer.innerHTML = "";
        gameBoard = []
        render()
        console.log(gameBoard)
    }

    function deactivate () {
        let blocks = document.getElementsByClassName("board-block");
        for (let i = 0; i < blocks.length; i++) {
            blocks[i].removeEventListener("click", Game.play);
        }
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

const Player = (name, playerType) => {
    return { name, playerType };
};

const Player1 = Player("computer", "O");
const Player2 = Player("computer", "X");
let currentPlayer = Player1;


/// GAME OBJECT - module

const Game = (() => {

    function isMarked (cell) {
        return Gameboard.fetch()[cell].marked === ""
    }

    function getWinner () {
        let xArray = [];
        let oArray = [];

        for (let i = 0; i < Gameboard.fetch().length; i++) {
            if (Gameboard.fetch()[i].marked === "X") {
                xArray.push(i)
            } else if (Gameboard.fetch()[i].marked === "O") {
                oArray.push(i)
            }
        }

        const combos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

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

    function play (event) {
        event.target.removeEventListener("click", Game.play)

        let cell = event.target.id;

        function mark (index) {
            if (isMarked(index) !== "") {
                if (currentPlayer === Player1) {
                    currentPlayer = Player2;
                } else {
                    currentPlayer = Player1;
                }
                Gameboard.update(index, currentPlayer.playerType);
            }
        }

        mark(cell)

        if (getWinner() === "X") {
            pronounceWinner("X");
            Gameboard.deactivate()
        }
        else if (getWinner() === "O") {
            pronounceWinner("O");
            Gameboard.deactivate()
        }
        else if (Gameboard.fetch().every(cell => cell.marked !== "")){
            // gameOver
            pronounceTie()
            Gameboard.deactivate()
        }
        else {
            setTimeout(
                function(){
                    mark(getRandom())

                    if (getWinner() === "X") {
                        pronounceWinner("X");
                        Gameboard.deactivate()
                    }
                    else if (getWinner() === "O") {
                        pronounceWinner("O");
                        Gameboard.deactivate()
                    }
                    else if (Gameboard.fetch().every(cell => cell.marked !== "")){
                        // gameOver
                        pronounceTie()
                        Gameboard.deactivate()
                    }
                }, 600);
        }

    }

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
        let nonMarked = Gameboard.fetch().filter(cell => cell.marked === "")
        let random = nonMarked[Math.floor(Math.random()*nonMarked.length)]
        return Gameboard.fetch().indexOf(random)
    }

    // cache DOM

    const selectButtons = document.querySelectorAll(".select-player button")
    const restartButton = document.getElementById("restart");

    // Events

    restartButton.addEventListener("click", restart)
    // selectButtons.forEach(button => {
    //     button.addEventListener("click", assignPlayer);
    // });

    // Functions


    function restart() {
        Gameboard.reset()
        currentPlayer = Player1;
        console.log(Gameboard.fetch())
    }

    function pronounceWinner(player) {
        console.log("you win player " + player)
    // gameOver - three in a row (789,456,123,741,852,963,753,951)
    //+ displayWinner OR tie (9 clicks and no 3 in a row)
    }

    function pronounceTie() {
        console.log("its a tie")
    }

    return {
        play
    };
})();


Gameboard.render()

console.log(Gameboard.fetch())





