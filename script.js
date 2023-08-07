const grid = document.querySelector('.grid');

let currColor = "#000000";

// buttons
const buttons = document.querySelectorAll('button');
const solidColorBtn = document.querySelector('#btn-solid');
const rainbowBtn = document.querySelector('#btn-rainbow');
const eraserBtn = document.querySelector('#btn-eraser');
const clearBtn = document.querySelector('#btn-clear');
const colorPicker = document.querySelector('#color-picker');
const slider = document.querySelector('.slider');

// variables
let mouseDown = false;
document.body.onmousedown = () => (mouseDown=true);
document.body.onmouseup = () => (mouseDown = false);

let cursorMode = 0; // 0 - solid    1 - rainbow    2 - Eraser

/**
 * Populates a size * size grid
 * @param {int} gridSize    size of the grid
 */
function generateGrid(gridSize) {
    // get grid dimension
    let gridWidth = grid.clientHeight;
    let cellSize = Math.floor(gridWidth / gridSize);

    // divide grid dimension by size: repeat(auto-fit, cellsize)
    // let gridDimensionStr = `repeat(${size}, ${cellSize}px)`;
    let gridDimStr = `repeat(auto-fill, minmax(${cellSize}px, 1fr))`;
    grid.style['grid-template-columns'] = gridDimStr;
    grid.style['grid-template-rows'] = gridDimStr;
    
    // insert the cells
    injectCells(cellSize, gridSize);

}

/**
 * Creates and appends the smaller cell div elements into the grid
 * @param {int} cellSize    size of the cells of the grid
 * @param {int} gridSize    dimension of the full grid
 */
function injectCells(cellSize, gridSize) {
    for (let i = 0; i < gridSize * gridSize; i++) {
        const div = document.createElement('div');
        div.classList.add('grid-cell');

        // add eventlistener for painting
        div.addEventListener('mousedown', changeColor);
        div.addEventListener('mouseover', changeColor);

        grid.appendChild(div);
    }
}

function destroyGrid() {
    while (grid.firstChild) {
        grid.removeChild(grid.lastChild);
    }
}

function bindElements() {
    // clear highlights
    buttons.forEach((button) => {
        button.addEventListener('click', clearButtonHighlights);
    });

    // update color
    colorPicker.addEventListener('input', () => {
        currColor = colorPicker.value;
    });

    // solids
    solidColorBtn.addEventListener('click', () => {
        cursorMode = 0;
        solidColorBtn.classList.add('active');
    });

    // rainbow
    rainbowBtn.addEventListener('click', () => {
        cursorMode = 1;
        rainbowBtn.classList.add('active');
    });

    // eraser
    eraserBtn.addEventListener('click', () => {
        cursorMode = 2;
        eraserBtn.classList.add('active');
    });

    // clear cells
    clearBtn.addEventListener('click', () => {
        const cells = document.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            cell.style['backgroundColor'] = '#FFFFFF';
        });
        cursorMode = 2;
        clearBtn.classList.add('active');
    });

    // slider value update
    slider.addEventListener('input', () => {
        document.querySelector('#slider-value').innerHTML = `${slider.value}x${slider.value}`;
    })

    // slider redraw
    slider.addEventListener('mouseup', () => {
        clearButtonHighlights();
        destroyGrid();
        init(slider.value);
    });
}

function changeColor(e) {
    if (e.type == 'mouseover' && !mouseDown) return;

    // 0 - solid 
    if (cursorMode == 0) e.target.style['backgroundColor'] = currColor;
    // 1 - rainbow
    else if (cursorMode == 1) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        e.target.style['backgroundColor'] = `rgb(${r}, ${g}, ${b})`;
    }
    // 2 - eraser
    else {
        e.target.style['backgroundColor'] = '#FFFFFF';
    }
}

function clearButtonHighlights() {
    buttons.forEach((button) => {
        button.classList.remove("active");
    })
}

function init(size) {
    cursorMode = 0;
    generateGrid(size);
    bindElements();
    solidColorBtn.classList.add('active');
}

init(16);