document.addEventListener("DOMContentLoaded", () => {
  const width = 10;
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  let nextSquares = Array.from(document.querySelectorAll(".next div"));
  let score = 0;
  const ScoreDisplay = document.querySelector("#score");
  const StartButton = document.querySelector("#start-button");
  let timerId;
  const colors = ["orange", "red", "purple", "green", "blue"];

  //The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  function getRandom() {
    return Math.floor(Math.random() * theTetrominoes.length);
  }

  let currentRandom = getRandom();
  let nextRandom = getRandom();
  let currentTetro = theTetrominoes[currentRandom][0];
  let nextTetro = theTetrominoes[nextRandom][0];

  //draw the tetromino
  function draw() {
    currentTetro.forEach((i) => {
      squares[currentPosition + i].classList.add("tetromino");
      squares[currentPosition + i].style.backgroundColor =
        colors[currentRandom];
    });
  }

  function drawNext() {
    nextTetro.forEach((i) => {
      nextSquares[Math.floor(i / width) * 4 + (i % width)].classList.add(
        "tetromino"
      );
      nextSquares[
        Math.floor(i / width) * 4 + (i % width)
      ].style.backgroundColor = colors[nextRandom];
    });
  }

  function undraw() {
    currentTetro.forEach((i) => {
      squares[currentPosition + i].classList.remove("tetromino");
      squares[currentPosition + i].style.backgroundColor = "";
    });
  }

  function undrawNext() {
    nextSquares.forEach((i) => {
      i.classList.remove("tetromino");
      i.style.backgroundColor = "";
    });
  }

  //move tetromino down every second
  // const timerId = setInterval(moveDown, 500);

  //assign functions to keyCode
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }

  document.addEventListener("keyup", control);

  function moveDown() {
    undraw();
    undrawNext();
    currentPosition += width;
    draw();
    drawNext();
    freeze();
  }

  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation >= currentTetro.length) {
      currentRotation = 0;
    }
    currentTetro = theTetrominoes[currentRandom][currentRotation];
    draw();
  }

  //freeze
  function freeze() {
    if (
      currentTetro.some((i) =>
        squares[currentPosition + i + width].classList.contains("taken")
      )
    ) {
      currentTetro.forEach((i) =>
        squares[currentPosition + i].classList.add("taken")
      );

      //start new tetromino
      currentTetro = [...nextTetro];
      currentRandom = nextRandom;
      nextRandom = getRandom();
      nextTetro = theTetrominoes[nextRandom][0];
      currentPosition = 4;
      undrawNext();
      draw();
      drawNext();
      addScore();
      gameOver();
    }
  }

  //move left with screen edge detection
  function moveLeft() {
    undraw();
    const isAtLeftEdge = currentTetro.some(
      (i) => (currentPosition + i) % width === 0
    );
    if (!isAtLeftEdge) {
      currentPosition -= 1;
    }

    if (
      currentTetro.some((i) =>
        squares[currentPosition + i].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  //move right with screen edge detection
  function moveRight() {
    undraw();
    const isAtRightEdge = currentTetro.some(
      (i) => (currentPosition + i) % width === width - 1
    );
    if (!isAtRightEdge) {
      currentPosition += 1;
    }

    if (
      currentTetro.some((i) =>
        squares[currentPosition + i].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  StartButton.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 500);
    }
  });

  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((i) => squares[i].classList.contains("taken"))) {
        score += 10;
        ScoreDisplay.innerHTML = score;

        row.forEach((i) => squares[i].classList.remove("taken"));
        row.forEach((i) => squares[i].classList.remove("tetromino"));
        row.forEach((i) => (squares[i].style.backgroundColor = ""));

        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  function gameOver() {
    if (
      currentTetro.some((i) =>
        squares[currentPosition + i].classList.contains("taken")
      )
    ) {
      ScoreDisplay.innerHTML = "end";
      clearInterval(timerId);
    }
  }
});
