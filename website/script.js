const grid = [
    ['S', '0', '0', '0', 'W', '0', '0', 'V', 'V', 'V', '0', '0'],
    ['0', 'W', 'W', '0', 'W', '0', '0', '0', 'W', '0', '0', 'V'],
    ['0', '0', '0', '0', '0', 'V', '0', '0', 'W', '0', '0', 'V'],
    ['0', '0', '0', '0', '0', '0', '0', '0', 'W', 'W', '0', '0'],
    ['W', 'W', '0', 'W', 'W', '0', 'V', 'V', 'V', '0', '0', '0'],
    ['0', '0', 'V', '0', '0', '0', '0', '0', '0', 'W', '0', 'V'],
    ['0', '0', '0', '0', '0', 'V', '0', '0', '0', 'W', '0', 'V'],
    ['V', 'V', '0', 'W', '0', '0', '0', 'W', '0', '0', '0', '0']
];

const directions = {
    'U': [-1, 0],
    'D': [1, 0],
    'L': [0, -1],
    'R': [0, 1]
};

let carPositions = [];
const parkingGrid = document.getElementById("parkingGrid");

function renderGrid(grid, paths = []) {
    parkingGrid.innerHTML = "";
    grid.forEach((row, i) => {
        row.forEach((cell, j) => {
            const slot = document.createElement("div");
            slot.classList.add("slot");
            if (cell === 'S') slot.classList.add("start");
            else if (cell === 'W') slot.classList.add("blocked");
            else if (cell === 'V') slot.classList.add("vacant");

            paths.forEach((path) => {
                if (path.some(([x, y]) => x === i && y === j)) {
                    slot.classList.add("path");
                }
            });

            if (carPositions.some(([x, y]) => x === i && y === j)) {
                slot.classList.add("car");
                slot.textContent = "Car";
            } else {
                slot.textContent = cell;
            }

            parkingGrid.appendChild(slot);
        });
    });
}

function bfs(grid, start) {
    const queue = [[start]];
    const visited = new Set();
    visited.add(start.toString());

    while (queue.length > 0) {
        const path = queue.shift();
        const [currentRow, currentCol] = path[path.length - 1];

        if (grid[currentRow][currentCol] === 'V') {
            grid[currentRow][currentCol] = 'O';
            return path;
        }

        for (const [_, [dr, dc]] of Object.entries(directions)) {
            const nextRow = currentRow + dr;
            const nextCol = currentCol + dc;

            if (
                nextRow >= 0 &&
                nextRow < grid.length &&
                nextCol >= 0 &&
                nextCol < grid[0].length &&
                !visited.has([nextRow, nextCol].toString()) &&
                grid[nextRow][nextCol] !== 'W' &&
                grid[nextRow][nextCol] !== 'O'
            ) {
                queue.push([...path, [nextRow, nextCol]]);
                visited.add([nextRow, nextCol].toString());
            }
        }
    }

    return null;
}

function moveCar(path, carIndex) {
    if (!path || path.length === 0) return;

    let step = 0;
    const interval = setInterval(() => {
        if (step < path.length) {
            carPositions[carIndex] = path[step];
            renderGrid(grid, carPositions.map((_, i) => carPositions[i] === path ? path : []));
            step++;
        } else {
            clearInterval(interval);
            if (carIndex === carPositions.length - 1) {
                alert("All cars have been parked!");
            }
        }
    }, 500);
}

function addCar() {
    const start = [0, 0];
    const path = bfs(grid, start);
    if (path) {
        carPositions.push(path[0]);
        moveCar(path, carPositions.length - 1);
    } else {
        alert("No vacant slot available!");
    }
}

function resetSimulation() {
    carPositions = [];
    grid.forEach((row, i) => {
        grid[i] = row.map((cell) => (cell === 'O' ? 'V' : cell));
    });
    renderGrid(grid);
}

renderGrid(grid);
