var board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

const HUMAN = -1;
const COMP = +1;

/* Function to heuristic evaluation of state. */
function evaluate(state) {
    if (gameOver(state, COMP)) {
        return +1;
    } else if (gameOver(state, HUMAN)) {
        return -1;
    } else {
        return 0;
    }
}

/* Function to check if a specific player wins */
function gameOver(state, player) {
    const winState = [
        [state[0][0], state[0][1], state[0][2]],
        [state[1][0], state[1][1], state[1][2]],
        [state[2][0], state[2][1], state[2][2]],
        [state[0][0], state[1][0], state[2][0]],
        [state[0][1], state[1][1], state[2][1]],
        [state[0][2], state[1][2], state[2][2]],
        [state[0][0], state[1][1], state[2][2]],
        [state[2][0], state[1][1], state[0][2]],
    ];

    for (let i = 0; i < 8; i++) {
        const line = winState[i];
        const filled = line.reduce((count, cell) => (cell === player ? count + 1 : count), 0);

        if (filled === 3) {
            return true;
        }
    }
    return false;
}

/* Function to check if the human or computer wins */
function gameOverAll(state) {
    return gameOver(state, HUMAN) || gameOver(state, COMP);
}

function emptyCells(state) {
    const cells = [];
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            if (state[x][y] === 0) {
                cells.push([x, y]);
            }
        }
    }
    return cells;
}

/* Function to check if a move is valid */
function validMove(x, y) {
    const empties = emptyCells(board);
    try {
        return board[x][y] === 0;
    } catch (e) {
        return false;
    }
}

/* Function to set the move on the board if the coordinates are valid */
function setMove(x, y, player) {
    if (validMove(x, y)) {
        board[x][y] = player;
        return true;
    } else {
        return false;
    }
}

/* AI function that chooses the best move using the minimax algorithm */
function minimax(state, depth, player) {
    let best;

    if (player === COMP) {
        best = [-1, -1, -1000];
    } else {
        best = [-1, -1, +1000];
    }

    if (depth === 0 || gameOverAll(state)) {
        const score = evaluate(state);
        return [-1, -1, score];
    }

    emptyCells(state).forEach(([x, y]) => {
        state[x][y] = player;
        const score = minimax(state, depth - 1, -player);
        state[x][y] = 0;
        [score[0], score[1]] = [x, y];

        if (player === COMP) {
            if (score[2] > best[2]) {
                best = score;
            }
        } else {
            if (score[2] < best[2]) {
                best = score;
            }
        }
    });

    return best;
}

/* Function to handle AI's turn */
function aiTurn() {
    let x, y;
    let move;
    let cell;

    if (emptyCells(board).length === 9) {
        x = parseInt(Math.random() * 3);
        y = parseInt(Math.random() * 3);
    } else {
        move = minimax(board, emptyCells(board).length, COMP);
        [x, y] = [move[0], move[1]];
    }

    if (setMove(x, y, COMP)) {
        cell = document.getElementById(`${x}${y}`);
        cell.innerHTML = "O";
    }
}

/* Main function to handle user's move */
function clickedCell(cell) {
    const button = document.getElementById("bnt-restart");
    button.disabled = true;

    const conditionToContinue = !gameOverAll(board) && emptyCells(board).length > 0;

    if (conditionToContinue) {
        const [x, y] = cell.id.split("");
        const move = setMove(x, y, HUMAN);
        if (move && conditionToContinue) {
            cell.innerHTML = "X";
            aiTurn();
        }
    }

    if (gameOver(board, COMP)) {
        highlightWinningCells(board, COMP);
        setMessage("You lose!");
    }

    if (emptyCells(board).length === 0 && !gameOverAll(board)) {
        setMessage("Draw!");
    }

    if (gameOverAll(board) || emptyCells(board).length === 0) {
        button.value = "Restart";
        button.disabled = false;
    }
}

/* Function to highlight the winning cells */
function highlightWinningCells(state, player) {
    const winLines = getWinningLines(state, player);
    for (const line of winLines) {
        for (const [x, y] of line) {
            const cell = document.getElementById(`${x}${y}`);
            cell.style.color = "red";
        }
    }
}

/* Function to get the winning lines */
function getWinningLines(state, player) {
    const winState = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[2, 0], [1, 1], [0, 2]],
    ];

    const winningLines = winState.filter((line) => line.every(([x, y]) => state[x][y] === player));
    return winningLines;
}

/* Function to set the message */
function setMessage(message) {
    const msg = document.getElementById("message");
    msg.innerHTML = message;
}

/* Function to restart the game */
function restartBtn(button) {
    if (button.value === "Start AI") {
        aiTurn();
        button.disabled = true;
    } else if (button.value === "Restart") {
        resetGame();
    }
}

/* Function to reset the game */
function resetGame() {
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            board[x][y] = 0;
            const htmlBoard = document.getElementById(`${x}${y}`);
            htmlBoard.style.color = "#444";
            htmlBoard.innerHTML = "";
        }
    }

    const button = document.getElementById("bnt-restart");
    button.value = "Start AI";

    setMessage("");
}
