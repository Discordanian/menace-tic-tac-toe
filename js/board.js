var Board = function() {
    this.toConsole = function(x) {
        let retval = "";
        let bstr = "";
        if (typeof x === "number") {
            bstr = this.toString(x);
        } else {
            bstr = x;
        }
        // making sure bstr is a string
        let barr = Array.from(bstr);
        let sep_ = " ----------- "
        let row1 = "  " + barr[0] + " | " + barr[1] + " | " + barr[2] + " "
        let row2 = "  " + barr[3] + " | " + barr[4] + " | " + barr[5] + " "
        let row3 = "  " + barr[6] + " | " + barr[7] + " | " + barr[8] + " "

        console.log(" ");
        console.log(row1);
        console.log(sep_);
        console.log(row2);
        console.log(sep_);
        console.log(row3);
    };

    // take a numeric board and convert to string.
    this.toString = function(bint) {
        let b = Array.from('         ');
        if (bint < 0 || bint >= Math.pow(3, 9)) {
            console.error("Board.toString(" + bint + ") is out of range.");
            return "         ";
        } else {
            // valid number given
            let p = [' ', 'X', 'O'];
            // let b = Array.from('         ');
            let done = false;
            let rest = bint;
            let index = 0;
            while (!done) {
                b[index] = p[rest % p.length];
                rest = Math.floor(rest / p.length);
                index++;
                if (rest === 0) {
                    done = true;
                }
            }
        }
        return b.join('');
    }; // toString(bint)

    // Convert a string to a number
    // '         ' => 0
    // 'X        ' => 1
    // 'O        ' => 2
    // ' X       ' => 3 . . .
    this.toInt = function(bstr) {
        let retval = 0;
        let barr = Array.from(bstr); // going to iterate through array.
        if (barr.length !== 9) {
            console.error("Board.toInt(" + bstr + ") has a string that isn't 9 characters.  Returning a -1.");
            return -1;
        }
        for (var i = 0; i < barr.length; i++) {
            let n = (barr[i] == "X" ? 1 : (barr[i] == "O") ? 2 : 0)
            // console.log({'i':i, 'n':n, 'c':barr[i], 't':Math.pow(3,i)*n});
            retval += Math.pow(3, i) * n;
        }
        return retval;
    }; //toInt(bstr)


    // Return public interface
    this.hasWinner = function(bin) {
        // console.log("board.hasWinner(" + bin + ")");
        let b;
        if (typeof bin === "number") {
            b = this.toString(bin).split('');
        } else {
            // b = bin.split('');
            b = Array.from(bin);
        }
        let retval = " ";

        function setRet(winner) {
            if (retval === " ") {
                retval = winner;
            }
        }
        if (retval === " " && (b[0] !== ' ')) {
            if (b[0] === b[1] && b[0] === b[2]) {
                setRet(b[0]);
            } // across
            if (b[0] === b[3] && b[0] === b[6]) {
                setRet(b[0]);
            } // down
            if (b[0] === b[4] && b[0] === b[8]) {
                setRet(b[0]);
            } // diag
        }
        if (retval === " " && (b[1] !== ' ')) {
            // b1 across is done
            if (b[1] === b[4] && b[1] === b[7]) {
                setRet(b[1]);
            } // down
        }
        if (retval === " " && (b[2] !== ' ')) {
            // b1 across is done
            if (b[2] === b[5] && b[2] === b[8]) {
                setRet(b[2]);
            } // down
            if (b[2] === b[4] && b[2] === b[6]) {
                setRet(b[2]);
            } // diag
        }
        if (retval === " " && (b[3] !== ' ')) {
            // b0 down is done
            if (b[3] === b[4] && b[3] === b[5]) {
                setRet(b[3]);
            } // across
        }
        // b[4] is done because of b1 down and the 2 diags
        // b[5] is done from b3 across and b2 down
        if (retval === " " && (b[6] !== ' ')) {
            if (b[6] === b[7] && b[6] === b[8]) {
                setRet(b[6]);
            } // across
        }
        // b[7] is done from b6 across and b1 down
        // b[8] is done from b6 across and b2 down and b0 diag

        return retval;
    }; // hasWinner

    // Given a board return true or false if the game is over
    // it is over if there is a winner or there are no more moves allowed
    this.gameOver = function(x) {
        return (this.hasWinner(x) !== ' ') || (this.validMoves(x).length === 0);
    };


    // Return array of valid moves
    this.validMoves = function(x) {
        let b;
        let retval = [];
        if (typeof x === "number") {
            b = this.toString(x);
        } else {
            b = x;
        }
        let barr = Array.from(b);
        barr.forEach((c, i) => {
            if (c === ' ') {
                retval.push(i);
            }
        });
        return retval.map((x) => x);

    };

    // Given a board and a weight number
    // Returns an array with weight number of
    // valid moves for each valid move.
    // Ex: if valid moves are [1,3,7] and weight is 2
    // returns [ 1, 1, 3, 3, 7, 7 ]
    // This function should be used to initialize a board position
    this.initBoardMoves = function(x, weights) {
        let retval = [];
        let moves = this.validMoves(x);
        let w = weights;
        if (moves.length < 6) {
            w = Math.floor(weights / 2);
        }
        if (moves.length < 3) {
            w = Math.floor(weights / 3);
        }
        moves.forEach((v) => {
            for (var i = 0; i < w; i++) {
                retval.push(v);
            }

        });
        return retval.map((k) => k); // shallow copy
    }; // this.initBoardMoves


    // 'Rotates' string clockwise around pos 4.
    // I know this is strange, but if you had it a number
    // it returns a numeric.  If you pass a string
    // it returns a string
    this.rotateBoard = function(b) {
        var barr;
        var number_in;
        if (typeof b === "number") {
            barr = Array.from(this.toString(b));
            number_in = true;
        } else {
            barr = Array.from(b);
            number_in = false;
        }

        var retval = Array.from("         "); // empty array
        retval[0] = barr[6];
        retval[1] = barr[3];
        retval[2] = barr[0];
        retval[3] = barr[7];
        retval[4] = barr[4]; // rotates around center
        retval[5] = barr[1];
        retval[6] = barr[8];
        retval[7] = barr[5];
        retval[8] = barr[2];
        // KAS - Know that this is really unusual
        // It will probably bite me in the ass, but I return
        // what I was given so the return type can change
        // console.log({'number_in':number_in, 'retvalstr':retval.join('')});
        return (number_in) ? this.toInt(retval.join('')) : retval.join('');
    }; // this.rotateBoard(b)

    // Return the minimum numeric match for the given board.
    this.minBoard = function(b) {
        var bin;
        if (typeof b === "number") {
            bin = b;
        } else {
            bin = this.toInt(b);
        }

        var r1 = this.rotateBoard(bin); // first rotation
        var r2 = this.rotateBoard(r1); // second rotation
        var r3 = this.rotateBoard(r2); // third rotation
        return Math.min(bin, r1, r2, r3);

    }; // this.minBoard(b)

    // board position p
    // The number of rotations requested
    this.positionRotate = function(p, r) {
        var retval = p;
        for (var i = 0; i < r; i++) {
            retval = this.rotatePosition(retval);
        }
        return retval;
    }; // this.positionRotate(p,r)

    // On rotation of a given position
    this.rotatePosition = function(p) {
        let rotation = [2, 5, 8, 1, 4, 7, 0, 3, 6];
        return rotation[p];
    }; // this.rotatePosition(p)



    // Returns the distance between the given brd and the target
    this.distanceTo = function(brd, tgt) {
        // Let's convert everything to string from whatever it was.
        let bstr; // given board as string
        let tstr; // target board as string
        let retval = -1;
        if (typeof brd === "number") {
            bstr = this.toString(brd);
        } else {
            bstr = brd;
        }
        if (typeof tgt === "number") {
            tstr = this.toString(tgt);
        } else {
            tstr = tgt;
        }

        // start with no rotation
        if (bstr === tstr) {
            retval = 0;
        }

        // rotation 1
        tstr = this.rotateBoard(tstr);
        if (bstr === tstr && retval === -1) {
            retval = 1;
        }

        // rotation 2
        tstr = this.rotateBoard(tstr);
        if (bstr === tstr && retval === -1) {
            retval = 2;
        }

        // rotation 2
        tstr = this.rotateBoard(tstr);
        if (bstr === tstr && retval === -1) {
            retval = 3;
        }

        return retval;
    }; // distanceTo

    return this;
}; // end Board