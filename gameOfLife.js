const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startStopButton = document.getElementById('startStopButton');
const nextButton = document.getElementById('nextButton');
const resetButton = document.getElementById('resetButton');
const randomButton = document.getElementById('randomButton');
const addNameButton = document.getElementById('addNameButton');
const speedSlider = document.getElementById('speedSlider');
const zoomSlider = document.getElementById('zoomSlider');
const stepsCounter = document.getElementById('stepsCounter');

const initialCellSize = 20;
let cellSize = initialCellSize;
let rows = Math.floor(canvas.height / cellSize);
let cols = Math.floor(canvas.width / cellSize);
let grid = createEmptyGrid();
let isRunning = false;
let intervalId;
let steps = 0;

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    grid[row][col] = grid[row][col] ? 0 : 1;
    drawGrid();
});

startStopButton.addEventListener('click', () => {
    if (isRunning) {
        clearInterval(intervalId);
        startStopButton.textContent = 'Start';
    } else {
        intervalId = setInterval(step, 1000 - speedSlider.value);
        startStopButton.textContent = 'Stop';
    }
    isRunning = !isRunning;
});

nextButton.addEventListener('click', () => {
    if (!isRunning) {
        step();
    }
});

resetButton.addEventListener('click', () => {
    if (isRunning) {
        clearInterval(intervalId);
        isRunning = false;
        startStopButton.textContent = 'Start';
    }
    grid = createEmptyGrid();
    steps = 0;
    stepsCounter.textContent = steps;
    drawGrid();
});

randomButton.addEventListener('click', () => {
    grid = createRandomGrid();
    drawGrid();
});

addNameButton.addEventListener('click', () => {
    addNameToGrid();
});

speedSlider.addEventListener('input', () => {
    if (isRunning) {
        clearInterval(intervalId);
        intervalId = setInterval(step, speedSlider.value);
    }
});

zoomSlider.addEventListener('input', () => {
    cellSize = parseInt(zoomSlider.value);
    rows = Math.floor(canvas.height / cellSize);
    cols = Math.floor(canvas.width / cellSize);
    drawGrid();
});

function createEmptyGrid() {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function createRandomGrid() {
    const randomGrid = createEmptyGrid();
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            randomGrid[row][col] = Math.random() > 0.7 ? 1 : 0;
        }
    }
    return randomGrid;
}

function addNameToGrid() {
    const startRow = Math.floor(rows / 2) - 3;
    const startCol = Math.floor(cols / 2) - 2;
    const aPattern = [
        { row: startRow, col: startCol + 1 }, { row: startRow, col: startCol + 2 },
        { row: startRow + 1, col: startCol }, { row: startRow + 1, col: startCol + 3 },
        { row: startRow + 2, col: startCol }, { row: startRow + 2, col: startCol + 3 },
        { row: startRow + 3, col: startCol }, { row: startRow + 3, col: startCol + 3 },
        { row: startRow + 3, col: startCol + 1 }, { row: startRow + 3, col: startCol + 2 },
        { row: startRow + 4, col: startCol }, { row: startRow + 4, col: startCol + 3 },
        { row: startRow + 5, col: startCol }, { row: startRow + 5, col: startCol + 3 },
    ];

    aPattern.forEach(point => {
        grid[point.row][point.col] = 1;
    });
    drawGrid();
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.fillStyle = grid[row][col] ? 'black' : 'white';
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }
}

function step() {
    const newGrid = createEmptyGrid();
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const livingNeighbors = countLivingNeighbors(row, col);
            if (grid[row][col] === 1) {
                if (livingNeighbors < 2 || livingNeighbors > 3) {
                    newGrid[row][col] = 0;
                } else {
                    newGrid[row][col] = 1;
                }
            } else {
                if (livingNeighbors === 3) {
                    newGrid[row][col] = 1;
                }
            }
        }
    }
    grid = newGrid;
    steps++;
    stepsCounter.textContent = steps;
    drawGrid();
}

function countLivingNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                count += grid[newRow][newCol];
            }
        }
    }
    return count;
}

drawGrid();
