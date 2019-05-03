'use strict';

const USER_CHARACTER = 'X';
const AI_CHARACTER = 'O';

const BOARD = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let turnCount = 0;
let AIlevel = setAIlevel();

document.getElementById('ai-level').addEventListener('change', function () {
    AIlevel = parseInt(this.value);
    localStorage.setItem('ai-level', AIlevel);
});

document.getElementById('start-game-btn').addEventListener('click', function () {
    resetGame();
    document.getElementById('result').classList.add('hidden');
    this.classList.add('hidden');
});

document.getElementById('game-board').addEventListener('click', function (event) {
    let target = event.target;
    if (target && target.tagName !== 'TD') {
        return;
    }

    const coordinates = target.id.split('');
    const x = coordinates[0];
    const y = coordinates[1];

    if (isCellPopulated(x, y) || isGameOver()) {
        return;
    }

    populateGridCell(x, y, USER_CHARACTER);
    turnCount++;

    if (isGameOver()) {
        UIshowGameResult(hasWinner())
        return;
    } else {
        AImove();
        turnCount++;
    }

    if (isGameOver()) {
        UIshowGameResult(hasWinner());
    }

});

function setAIlevel() {
    let levelSlider = document.getElementById('ai-level');
    let level = 1;

    if (localStorage.getItem('ai-level') === null) {
        level = parseInt(levelSlider.value)
    } else {
        level = parseInt(localStorage.getItem('ai-level'));
    }

    levelSlider.value = level;
    return level;
}

function populateGridCell(x, y, character) {
    BOARD[x][y] = character;
    const element = document.getElementById(x + '' + y);
    element.innerHTML = character;
}

function UIshowGameResult(winner) {
    let element = document.getElementById('result');
    let spans = element.querySelectorAll('span');
    element.classList.remove('hidden');
    spans[0].innerHTML = winner === false ? 'Viik!' : winner === USER_CHARACTER ? 'Sina võitsid!' : 'Vastasmängija võitis!';
    spans[1].innerHTML = 'Proovi veel!';
    UIshowButton();
}

function UIshowButton() {
    document.getElementById('start-game-btn').classList.remove('hidden');
}

function hasWinner() {
    let rowWin = checkRows() || false;
    if (rowWin) {
        return rowWin;
    }

    let columnWin = checkColumns() || false;
    if (columnWin) {
        return columnWin;
    }

    let diagonalTopLeftBottomRightWin = checkDiagonal() || false;
    if (diagonalTopLeftBottomRightWin) {
        return diagonalTopLeftBottomRightWin;
    }

    let diagonalTopRightBottomLeftWin = checkDiagonal(false) || false;
    if (diagonalTopRightBottomLeftWin) {
        return diagonalTopRightBottomLeftWin;
    }

    return false;
}

function isGameOver() {
    return (turnCount === 9 || hasWinner());
}

function checkRows() {
    for (let i = 0; i < 3; i++) {
        if (BOARD[i][0] !== ''
            && BOARD[i][0] === BOARD[i][1]
            && BOARD[i][0] === BOARD[i][2]) {
            return BOARD[i][0];
        }
    }
    return null;
}

function checkColumns() {
    for (let i = 0; i < 3; i++) {
        if (BOARD[0][i] !== ''
            && BOARD[0][i] === BOARD[1][i]
            && BOARD[0][i] === BOARD[2][i]) {
            return BOARD[0][i];
        }
    }
    return null;
}

function checkDiagonal(fromTopLeft = true) {
    const character = BOARD[0][fromTopLeft ? 0 : 2];
    if (character !== ''
        && character === BOARD[1][1]
        && character === BOARD[2][fromTopLeft ? 2 : 0]) {
        return character;
    }
    return null;
}

function isCellPopulated(x, y) {
    return (BOARD[x][y] !== '');
}

function getAvailableCell(level = 1) {
    let availableCells = [];

    // Always try the middle cell
    if (level === 2 && BOARD[1][1] === '') {
        return { x: 1, y: 1 };
    }

    // Try corners
    if (level === 2) {
        const corners = [{ x: 0, y: 0 }, { x: 0, y: 2 }, { x: 2, y: 0 }, { x: 2, y: 2 }];
        const availableCorners = [];
        for (let i = 0; i < corners.length; i++) {
            let coordinates = corners[i];
            if (BOARD[coordinates.x][coordinates.y] === '') {
                availableCorners.push(corners[i]);
            }
        }
        // Return random available corner
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
    }

    // Get other available cells
    for (let i = 0; i < BOARD.length; i++) {
        let column = BOARD[i];
        for (let j = 0; j < column.length; j++) {
            let cell = BOARD[i][j];

            if (cell === '') {
                let coordinate = { x: i, y: j };

                if (level === 0) {
                    return coordinate;
                }
                availableCells.push(coordinate);
            }

        }
    }

    if (availableCells.length === 0) {
        console.log('No available cells');
        return null;
    }

    let randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    console.log('Random cell picked: ', randomCell);
    return randomCell;
}

function AImove() {
    let cell = getAvailableCell(AIlevel);
    if (cell) {
        populateGridCell(cell.x, cell.y, AI_CHARACTER);
    }
}

function resetGame() {
    turnCount = 0;

    for (let i = 0; i < BOARD.length; i++) {
        for (let j = 0; j < BOARD[i].length; j++) {
            populateGridCell(i, j, '');
        }
    }
}
