
/// GAME BOARD - module


const Gameboard = (() => {
    // cache DOM - fetch each board item

    const boardBlocks = document.querySelectorAll(".board-block");
    
    // Events

    boardBlocks.forEach(square => {
        square.addEventListener("click", mark);
    });

    // Function

    function mark() {
      // add class so X or O appear
      // prevent refilling
    }

    //Fill board item - prevent refilling (under Game?)

    //check for three (789,456,123,741,852,963,753,951)?

    

    return {
      
    };
})();


/// PLAYERS OBJECT - factory

const Player = (name, playerType) => {
    return { name, playerType };
};


/// GAME OBJECT - module

const Game = (() => {
    //gives turn

    // cache DOM

    const selectButtons = document.querySelectorAll(".select-player button")
    const restartButton = document.getElementById("restart");

    // Events

    restartButton.addEventListener("click", restart)
    selectButtons.forEach(button => {
        button.addEventListener("click", assignPlayer);
    });

    // Functions

    function assignPlayer() {
      
    }

    // countClick on each square - prevent re-clicking (under board? - I would say yes)

    function clickCounter() {
      
    }
    

    //countTurn - countClicks?
    function restart() {
      
    }

    function pronounceWinner() {
    // gameOver - three in a row (789,456,123,741,852,963,753,951)
    //+ displayWinner OR tie (9 clicks and no 3 in a row)
    }

    function pronounceTie() {

    }

    return {
        
    };
})();



