const gridSize = 5;
const colors = ["red", "blue", "green", "yellow"];
const gameContainer = document.getElementById("game-container");
const scoreElem = document.getElementById("score");
// const slideButton = document.getElementById("slide"); // This button is no longer on the front page
let slideMoves = 0;
let score = 0;
let startDot = null;
let draggedDot = null;
let isMouseDown = false;
let initialMousePosition;
let grid = [];
//const dot = document.getElementById("dot");

//dot.addEventListener("transitionend", resetOpacity);

function resetOpacity(dot) {
  dot.style.opacity = 1;
}

function addTransitionEndEventListeners() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot) => {
    //dot.addEventListener("transitionend", resetOpacity);
    resetOpacity(dot);
  });
}

//function initiateSlideMove(event) {
//    if (slideMoves > 0) {
//        draggedDot = event.target;
//        draggedDot.classList.add("dragging");
//        window.addEventListener("mousemove", handleMouseMove);
//				window.addEventListener("mouseup", handleMouseUp);

  //  }
//}

function initiateSlideMove(event) {
    if (slideMoves > 0) {
        isMouseDown = true;
        initialMousePosition = { x: event.clientX, y: event.clientY };
        initialDot = event.target;
        draggedDot = event.target;
        draggedDot.classList.add("dragging");
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    }
}


function handleEliminateDotClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const color = event.target.style.backgroundColor;

    if (!startDot) {
        startDot = { dotElem: event.target, row, col, color }; console.log("startDot has just been set!");
    } else {
    		console.log("Just about to initiate CHECKMATCH (ie this isn't the startdot)");
        if (checkMatch(startDot, { dotElem: event.target, row, col, color })) {
            removeMatchedDots(startDot, { dotElem: event.target, row, col, color });
            updateScore(1);
            //if (slideMoves === 0) {
              //  slideButton.disabled = false;
            //}
            updateSlideMoves(1);
            
            // Should we Reattach the event listeners?
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        startDot = null;
    }
}


// there's a new handleDotClick function below
function handleDotClick(event) {

	console.log("This is the new, short handleDotClick which redirects to slidemove or eliminate");

    if (event.shiftKey) {
        initiateSlideMove(event);
    } else {
        handleEliminateDotClick(event);
    }
}


function handleDotMouseDown(event) {

console.log("this is handledotmousedown");

    if (event.shiftKey && slideMoves > 0) {
    		console.log("This is inside the if-shift-key & slidemoves>0 statement");
        isMouseDown = true;
        initialMousePosition = { x: event.clientX, y: event.clientY };
        initialDot = event.target;
        draggedDot = event.target;
        draggedDot.classList.add("dragging");
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    } else {
        handleDotClick(event);
    }
}


function handleMouseMove(event) {
    if (isMouseDown) {
        event.preventDefault(); // this line seems pointless?
        const row = parseInt(initialDot.dataset.row);
        const col = parseInt(initialDot.dataset.col);

        const xDiff = event.clientX - initialMousePosition.x;
        const yDiff = event.clientY - initialMousePosition.y;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            // Horizontal movement
            for (let i = 0; i < gridSize; i++) {
                const dot = gameContainer.children[row * gridSize + i];
                dot.style.left = `${xDiff}px`;
            }
        } else {
            // Vertical movement
            for (let i = 0; i < gridSize; i++) {
                const dot = gameContainer.children[i * gridSize + col];
                dot.style.top = `${yDiff}px`;
            }
        }
    }
}

function handleMouseUp(event) {

console.log("this is handlemouseup");



    if (isMouseDown && event.target.classList.contains("dot")) {
        isMouseDown = false;
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        const xDiff = event.clientX - initialMousePosition.x;
        const yDiff = event.clientY - initialMousePosition.y;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            // Horizontal movement
            const steps = Math.round(xDiff / 40);
            const direction = steps > 0 ? "right" : "left";
            performSlideMove(direction, row, Math.abs(steps));
        } else {
            // Vertical movement
            const steps = Math.round(yDiff / 40);
            const direction = steps > 0 ? "down" : "up";
            performSlideMove(direction, col, Math.abs(steps));
        }

        // Reset positions
        for (let i = 0; i < gridSize * gridSize; i++) {
            const dot = gameContainer.children[i];
            dot.style.left = "";
            dot.style.top = "";
        }
        
        // Remove the "dragging" class
        event.target.classList.remove("dragging");

        updateSlideMoves(-1);
        //if (slideMoves === 0) {
          //  slideButton.disabled = true;
        //}

        // Clear the startDot variable
        startDot = null;

        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);


    }
}

function generateGrid() {
    grid = new Array(gridSize).fill(null).map(() => new Array(gridSize).fill(null));
    gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, 40px)`;
    gameContainer.style.gridTemplateRows = `repeat(${gridSize}, 40px)`;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const dot = document.createElement("div");
            dot.className = "dot";
            dot.dataset.row = i;
            dot.dataset.col = j;
            dot.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            //dot.addEventListener("click", handleDotClick);
            dot.addEventListener("mousedown", handleDotMouseDown);
            grid[i][j] = dot;
        }
    }
    renderGrid();
}

function renderGrid() {
    gameContainer.innerHTML = "";
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            gameContainer.appendChild(grid[i][j]);
        }
    }
    addTransitionEndEventListeners(); //not sure this line is actually needed here?
}



const slideMovesElem = document.getElementById("slide-moves");

function updateSlideMoves(value) {
    slideMoves += value;
    slideMovesElem.textContent = slideMoves;
}


/*
function handleDotClick(event) {
		if (draggedDot) {
 		   draggedDot = null;
	     startDot = null;
    	 return;
		}
    
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const color = event.target.style.backgroundColor;

	console.log("This is handleDotClick");

    if (!startDot) {
        startDot = { dotElem: event.target, row, col, color };
    } else {
        if (checkMatch(startDot, { dotElem: event.target, row, col, color })) {
            removeMatchedDots(startDot, { dotElem: event.target, row, col, color });
            updateScore(1);
            if (slideMoves === 0) {
                slideButton.disabled = false;
            }
            updateSlideMoves(1);

            // Reattach the event listeners
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        startDot = null;
    }
}
*/


function checkMatch(dot1, dot2) {
    const rowDiff = Math.abs(dot1.row - dot2.row);
    const colDiff = Math.abs(dot1.col - dot2.col);


		console.log("Dot1.row:",dot1.row, "dot1.col:", dot1.col, "Dot1 color:", dot1.color, "Dot2.row:",dot2.row, "dot2.col:", dot2.col,"Dot2 color:", dot2.color);

    if (dot1.color !== dot2.color) {
        return false;
    }

    if ((rowDiff === 2 && colDiff === 0) || (rowDiff === 0 && colDiff === 2)) {
        const middleRow = (dot1.row + dot2.row) / 2;
        const middleCol = (dot1.col + dot2.col) / 2;
        const middleDot = gameContainer.children[middleRow * gridSize + middleCol];
        console.log("MIddle dot (this is a row or column):", middleDot.style.backgroundColor);
        return middleDot.style.backgroundColor === dot1.color;
    }

    if (rowDiff === 2 && colDiff === 2) {
        const middleRow = (dot1.row + dot2.row) / 2;
        const middleCol = (dot1.col + dot2.col) / 2;
        const middleDot = gameContainer.children[middleRow * gridSize + middleCol];
        console.log("MIddle dot (this is a diagonal):", middleDot.style.backgroundColor);
        return middleDot.style.backgroundColor === dot1.color;
    }

    return false;
}

function generateRandomDotColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}


function removeMatchedDots(dot1, dot2) {
    const rowDiff = Math.abs(dot1.row - dot2.row);
    const colDiff = Math.abs(dot1.col - dot2.col);

		console.log("CURRENTLY REMOVING a 3-in-a-row!");

    dot1.dotElem.style.backgroundColor = generateRandomDotColor();
    dot2.dotElem.style.backgroundColor = generateRandomDotColor();

    const middleRow = (dot1.row + dot2.row) / 2;
    const middleCol = (dot1.col + dot2.col) / 2;
    gameContainer.children[middleRow * gridSize + middleCol].style.backgroundColor = generateRandomDotColor();
}

function updateDotDataAttributes() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const dot = grid[i][j];
            dot.dataset.row = i;
            dot.dataset.col = j;
        }
    }
}




function performSlideMove(direction, index, steps) {
    if (direction === "left" || direction === "right") {
        const row = index;
        for (let i = 0; i < steps; i++) {
            if (direction === "left") {
                const firstDot = grid[row][0];
                for (let j = 0; j < gridSize - 1; j++) {
                    grid[row][j] = grid[row][j + 1];
                }
                grid[row][gridSize - 1] = firstDot;
            } else {
                const lastDot = grid[row][gridSize - 1];
                for (let j = gridSize - 1; j > 0; j--) {
                    grid[row][j] = grid[row][j - 1];
                }
                grid[row][0] = lastDot;
            }
        }
    } else {
        const col = index;
        for (let i = 0; i < steps; i++) {
            if (direction === "up") {
                const firstDot = grid[0][col];
                for (let j = 0; j < gridSize - 1; j++) {
                    grid[j][col] = grid[j + 1][col];
                }
                grid[gridSize - 1][col] = firstDot;
            } else {
                const lastDot = grid[gridSize - 1][col];
                for (let j = gridSize - 1; j > 0; j--) {
                    grid[j][col] = grid[j - 1][col];
                }
                grid[0][col] = lastDot;
            }
        }
    }

    renderGrid();
    addTransitionEndEventListeners();
    updateDotDataAttributes();

}




function updateScore(points) {
    score += points;
    scoreElem.textContent = score;
}


//slideButton.addEventListener("click", () => {
//    const direction = prompt("Enter slide direction (up, down, left, right):");
//    const index = parseInt(prompt("Enter the index of the row or column to slide (0-based index):"));
//    const steps = parseInt(prompt("Enter the number of steps to slide:"));

//    if (direction && index >= 0 && steps > 0) {
//        performSlideMove(direction, index, steps);
//        updateSlideMoves(-1);
//        if (slideMoves === 0) {
//           slideButton.disabled = true;
 //       }
//    } else {
//        alert("Invalid input. Please try again.");
//    }

//    slideMoves--;
//    if (slideMoves === 0) {
//        slideButton.disabled = true;
//    }
//});

generateGrid();
