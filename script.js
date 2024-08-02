document.addEventListener("DOMContentLoaded", () => {
    const board = Array(9).fill(0);
    const cells = document.querySelectorAll(".cell");
    const messageEl = document.getElementById("message");
    const resetButton = document.getElementById("reset");

    let currentPlayer = -1; // X's turn
    let gameActive = true;

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            const index = cell.getAttribute("data-index");
            if (board[index] === 0 && gameActive) {
                board[index] = currentPlayer;
                cell.textContent = currentPlayer === -1 ? "X" : "O";
                if (checkWinner()) {
                    gameActive = false;
                    messageEl.textContent = currentPlayer === -1 ? "X Wins!!!" : "O Wins!!!";
                } else if (board.every(cell => cell !== 0)) {
                    gameActive = false;
                    messageEl.textContent = "Draw!!!";
                } else {
                    currentPlayer *= -1;
                    if (currentPlayer === 1) {
                        setTimeout(computerMove, 500);
                    }
                }
            }
        });
    });

    resetButton.addEventListener("click", resetGame);

    function resetGame() {
        board.fill(0);
        cells.forEach(cell => {
            cell.textContent = "";
        });
        currentPlayer = -1;
        gameActive = true;
        messageEl.textContent = "";
    }

    function computerMove() {
        let bestScore = -Infinity;
        let bestMove;
        for (let i = 0; i < 9; i++) {
            if (board[i] === 0) {
                board[i] = 1;
                let score = minimax(board, 0, false);
                board[i] = 0;
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        board[bestMove] = 1;
        cells[bestMove].textContent = "O";
        if (checkWinner()) {
            gameActive = false;
            messageEl.textContent = "O Wins!!!";
        } else if (board.every(cell => cell !== 0)) {
            gameActive = false;
            messageEl.textContent = "Draw!!!";
        } else {
            currentPlayer = -1;
        }
    }

    function minimax(board, depth, isMaximizing) {
        let scores = {
            1: 10,
            '-1': -10,
            0: 0
        };

        let result = analyzeBoard();
        if (result !== 0 || board.every(cell => cell !== 0)) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === 0) {
                    board[i] = 1;
                    let score = minimax(board, depth + 1, false);
                    board[i] = 0;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === 0) {
                    board[i] = -1;
                    let score = minimax(board, depth + 1, true);
                    board[i] = 0;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function analyzeBoard() {
        for (let combo of winningCombinations) {
            const [a, b, c] = combo;
            if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return 0;
    }

    function checkWinner() {
        return winningCombinations.some(combo => {
            const [a, b, c] = combo;
            return board[a] !== 0 && board[a] === board[b] && board[a] === board[c];
        });
    }
});
