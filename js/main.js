document.addEventListener("DOMContentLoaded", () => {
  const cells = document.querySelectorAll(".cell");
  const winnerText = document.getElementById("winner");
  const boardDiv = document.querySelector(".board");
  const singleplayerBtn = document.getElementById("singleplayer");
  const multiplayerBtn = document.getElementById("multiplayer");

  let currentPlayer = "X";
  let gameMode = "PvP";
  let board = ["", "", "", "", "", "", "", "", ""];
  let gameActive = true;

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const handleCellClick = (event) => {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

    if (board[clickedCellIndex] !== "" || !gameActive) return;

    updateBoard(clickedCell, clickedCellIndex);
    checkResult();

    if (gameMode === "PvC" && gameActive) {
      computerMove();
    }
  };

  const updateBoard = (cell, index) => {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  };

  const checkResult = () => {
    const roundWon = winningConditions.some((condition) => {
      const [a, b, c] = condition;
      return board[a] && board[a] === board[b] && board[a] === board[c];
    });

    if (roundWon) {
      if (currentPlayer === "X") {
        winnerText.textContent = "Player X has won!";
      } else if (currentPlayer === "O") {
        winnerText.textContent = "Player O has won!";
      } else {
        winnerText.textContent = "Computer has won!";
      }
      gameActive = false;
      return;
    }

    if (!board.includes("")) {
      winnerText.textContent = "Game ended in a draw!";
      gameActive = false;
      return;
    }

    switchPlayer();
  };

  const computerMove = () => {
    let index;

    // Check for winning move
    index = checkWinningMove();
    if (index !== undefined) {
      const cell = document.querySelector(`.cell[data-index="${index}"]`);
      updateBoard(cell, index);
      checkResult();
      return;
    }

    // Check for blocking opponent's winning move
    index = checkBlockingMove();
    if (index !== undefined) {
      const cell = document.querySelector(`.cell[data-index="${index}"]`);
      updateBoard(cell, index);
      checkResult();
      return;
    }

    // Take the center if available
    if (board[4] === "") {
      const cell = document.querySelector(`.cell[data-index="4"]`);
      updateBoard(cell, 4);
      checkResult();
      return;
    }

    // If no strategic move is available, take a random available cell
    const availableCells = board
      .map((cell, index) => (cell === "" ? index : null))
      .filter((index) => index !== null);
    index = availableCells[Math.floor(Math.random() * availableCells.length)];
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    updateBoard(cell, index);
    checkResult();
  };

  // Function to check for a winning move
  const checkWinningMove = () => {
    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];
      if (
        board[a] === currentPlayer &&
        board[a] === board[b] &&
        board[c] === ""
      ) {
        return c;
      }
      if (
        board[a] === currentPlayer &&
        board[a] === board[c] &&
        board[b] === ""
      ) {
        return b;
      }
      if (
        board[b] === currentPlayer &&
        board[b] === board[c] &&
        board[a] === ""
      ) {
        return a;
      }
    }
  };

  // Function to check for blocking opponent's winning move
  const checkBlockingMove = () => {
    switchPlayer(); // Switch to opponent's player
    const index = checkWinningMove();
    switchPlayer(); // Switch back to current player
    return index;
  };

  const resetGame = () => {
    currentPlayer = "X";
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    winnerText.textContent = "";
    cells.forEach((cell) => (cell.textContent = ""));
  };

  const setGameMode = (mode) => {
    gameMode = mode;
    resetGame();
    boardDiv.classList.remove("hidden");
  };

  singleplayerBtn.addEventListener("click", () => setGameMode("PvC"));
  multiplayerBtn.addEventListener("click", () => setGameMode("PvP"));
  cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
});
