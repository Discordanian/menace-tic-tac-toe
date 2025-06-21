const board = Board();

/*
    board.toConsole
    board.toString
    board.toInt
    board.hasWinner
    board.gameOver
    board.validMoves
    board.initBoardMoves
	board.rotateBoard
	board.minBoard
*/


let gameboard = "         ";
let computer_first = true;
let playerMove = false;
let universe = [];
let weightInit = 8;
let computerMoves = [];
let gameStats = [];
let incentive = {
    win: 3
}

function test() {
    let testB = "XXXOOOXXX";
    let error = false;
    if (board.toString(board.toInt(testB)) !== testB) {
        console.error("board.toString(board.toInt(" + testB + ")) isn't equal to '" + testB + "'");
        error = true;
    } else {
        console.log("TEST PASSED: board.toString(board.toInt(X)) == X");
    }

    if (!board.gameOver(testB)) {
        console.error("Should be gameOver : " + testB);
        error = true;
    } else {
        console.log("TEST PASSED: board.gameOver");
    }

    if (board.hasWinner(testB) !== "X") {
        console.error("board.hasWinner(" + testB + ") should have been 'X'");
        error = true;
    } else {
        console.log("TEST PASSED: board.hasWinner");
    }

    if (error) {
        console.error("An error was seen.");
    } else {
        console.log("board is good-to-go");
    }

    return error;
} // test

function init() {
    // console.log("init()");
    if (!test()) {
        console.log("!test() == true");
        setup();
    } else {
        console.error("!test() !== true");
    }

    // Adding click events to the locations
    for (var i = 0; i < 9; i++) {
        let id = "b" + i;
        let j = i;
        document.getElementById(id).addEventListener("click", function() {
            // This becomes a sort of 'hard coded' to the id.
            selectPosition(id, j);
        });
    }
    document.getElementById("next").addEventListener("click", function() {
        setup();
    });

    gameStats = [];
    updateScreenStats();
} // init

function updateScreenStats() {
    document.getElementById("loss").innerHTML = gameStats.filter(x => x === -1).length;
    document.getElementById("wins").innerHTML = gameStats.filter(x => x === 1).length;
    document.getElementById("total_plays").innerHTML = gameStats.length;
    var lwindow = 20;
    var lastWindow = gameStats.slice(gameStats.length - lwindow, gameStats.length);
    var perc = 100 * (lastWindow.filter(x => x === 1).length / lwindow);
    document.getElementById("confidence").innerHTML = " " + perc + " %";
    // TODO graph
} // updateScreenStats

// i is the numeric position
// id is the div id of the position
// player is either "X" or "O"
function makeMove(index, id, player) {
    // console.log("makeMove(" + index + "," + id + "," + player + ")");
    let gb = Array.from(gameboard);
    if (gb[index] !== " ") {
        console.warn("Player moving to spot already occupied");
    }
    gb[index] = player;
    gameboard = gb.join('');
    document.getElementById(id).classList.remove("p-space");
    if (player == "X") {
        document.getElementById(id).classList.add("p-x");
    } else {
        document.getElementById(id).classList.add("p-o");
    }
    if (player !== "X" && player !== "O") {
        console.warn("Invalid player option sent to makeMove");
    }

} // makeMove

// Give it a weighted array and it'll return array of percents
function weightInfluence(arr) {
    let retval = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let options = arr.length;;
    for (var i = 0; i < 9; i++) {
        retval[i] = arr.filter(x => x === i).length;
    }
    return retval.map(x => x);
}

// The user has selected a move
function selectPosition(id, i) {
    // console.log("selectPosition(" + id + "," + i + ")");
    if (playerMove) {
        if (gameboard[i] === " ") {
            // console.info("This is a valid position.");
            playerMove = false;
            makeMove(i, id, "X"); //
            // board.toConsole(gameboard);
            // console.log("This is the game board [" + gameboard + "]");
            // If the game isn't over continue
            if (!isDone()) {
                computerMove();
            }
        } else {
            console.warn("Invalid selection attempted");
            console.warn("[ ] !== [" + gameboard[i] + "] in [" + gameboard + "]");
        }
    } else {
        console.warn("It is not the player's turn");
    }
} // selectPosition

// remove an element from an array
function arrayRemove(arr, num) {
    // console.log("arrayRemove(arr," + num + ")");
    let idx = arr.indexOf(num);
    arr.splice(idx, 1); // splice modifies array
    return arr.map(x => x); // return shallow copy
}

// is the isDone
function isDone() {
    // console.log("isDone()");
    let retval = false;
    // TODO is it game over?
    // console.log("gameboard : ["+gameboard+"]");
    let boardDone = board.gameOver(gameboard);
    if (boardDone) {
        retval = true;
        // player won
        let winner = board.hasWinner(gameboard);
        if (winner == "X") {
            gameStats.push(-1); // push a loss
            // console.log("Player has WON!");
            setWinDesc("You have won!  I will learn from my loss.");
            // Remove 1 weight from losing pos
            computerMoves.forEach((pos, bint) => {
                universe[bint] = arrayRemove(universe[bint].map(x => x), pos);
            });
            // Loop
        } else {
            gameStats.push(1); // push a win
            // console.log("Computer has WON!");
            setWinDesc("I'll consider this a WIN for me.");
            // Add 3 more to weight of winning pos
            computerMoves.forEach((pos, bint) => {
                // Weight a win heavily
                for (var i = 0; i < incentive.win; i++) {
                    universe[bint].push(pos);
                }
            });
        }
        updateScreenStats();
        // update weights for computer

    }
    return retval;

}

//
function updatePrevBoard(brdstr) {
    var barr = Array.from(brdstr);
    barr.forEach((e, i) => {
        let id = "prev" + i;
        document.getElementById(id).classList.remove("p-space", "p-x", "p-o");
        if (e === "X") {
            document.getElementById(id).classList.add("p-x");
        } else if (e === "O") {
            document.getElementById(id).classList.add("p-o");
        } else {
            document.getElementById(id).classList.add("p-space");
        }
    }); // forEach
};

function updateMinBoard(brdstr) {
    var barr = Array.from(brdstr);
    barr.forEach((e, i) => {
        let id = "min" + i;
        document.getElementById(id).classList.remove("p-space", "p-x", "p-o");
        if (e === "X") {
            document.getElementById(id).classList.add("p-x");
        } else if (e === "O") {
            document.getElementById(id).classList.add("p-o");
        } else {
            document.getElementById(id).classList.add("p-space");
        }
    }); // forEach
};

// TODO now for the computer to move
function computerMove() {
    // is the current min board in the universe?
    updatePrevBoard(gameboard);
    let bint = board.minBoard(gameboard); // give me the int of the game board
    updateMinBoard(board.toString(bint));
    if (!universe[bint]) {
        // if not, create it and populate it.
        console.log("Initializing board [" + board.toString(bint) + "] #" + bint + "");
        universe[bint] = board.initBoardMoves(bint, weightInit);
        // console.log(universe);
    }

    // is the current board in the universe but empty?
    if (universe[bint].length === 0) {
        // This configuration went to zero so resetting
        console.warn("RE-Initializing board [" + board.toString(bint) + "] #" + bint + "");
        universe[bint] = board.initBoardMoves(bint, weightInit);
        // console.log(universe);
    }


    // Draw percent thinking to screen
    updateScreenWeights(bint);


    // Check the weights and choose one.
    let choice = Math.floor(Math.random() * universe[bint].length);
    let position = universe[bint][choice];
    let distance = board.distanceTo(gameboard, bint); // how much to rotate
    let rot_pos = board.positionRotate(position, distance);
    /*
    console.log({
    	'MinBoard':board.toString(bint),
    	'position':position,
    	'distance':distance,
    	'rot_pos' :rot_pos
    });
    */

    // track computer move
    computerMoves[bint] = position;

    // Update screen
    makeMove(rot_pos, "b" + rot_pos, "O");

    // Did the computer win?
    if (!isDone()) {
        // Let the player move next
        playerMove = true;
    }
}

function updateScreenWeights(bint) {
    // Weights
    let weight_array = weightInfluence(universe[bint]);
    weight_array.forEach((p, i) => {
        let perc = Math.floor((p * 1000) / universe[bint].length) / 10; // 1 decimal
        let id = "w" + i;
        document.getElementById(id).innerHTML = " " + perc + " %";
    });
}

function setWinDesc(str) {
    let id = "windesc";
    let s;
    if (!str) {
        s = "&nbsp;";
    } else {
        s = str;
    }
    document.getElementById(id).innerHTML = s;

}

// setup configures the board and state for a new game to start
function setup() {
    if (!playerMove) {
        // console.log("setup()");
        clearBoards();
        setWinDesc();
        gameboard = "         "; // all blank board to start
        playerMove = true;
        computerMoves = []; // empty out the computerMoves
    } else {
        console.warn("setup() called during a player turn");
    }
    if (computer_first) {
        computerMove();
    }

}

// Clear the game board.
function clearBoards() {
    for (var i = 0; i < 9; i++) {
        let id = "b" + i;
        document.getElementById(id).classList.remove("p-x", "p-o");
        document.getElementById(id).classList.add("p-space");
        id = "prev" + i;
        document.getElementById(id).classList.remove("p-x", "p-o");
        document.getElementById(id).classList.add("p-space");
        id = "min" + i;
        document.getElementById(id).classList.remove("p-x", "p-o");
        document.getElementById(id).classList.add("p-space");
    }
}

// docReady: Waits until all assets are loaded and then starts game
function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

function game() {
    init();

}

docReady(game); // call the 'game' function when everything is loaded
