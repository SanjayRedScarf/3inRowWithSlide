const gridSize = 5;
const colors = ["red", "blue", "green", "yellow"];
const gameContainer = document.getElementById("game-container");
const scoreElem = document.getElementById("score");
let slideMoves = 0;
let totalSlideMovesEarned = 0;
let score = 0;
let startDot = null;
let draggedDot = null;
let isMouseDown = false;
let initialMousePosition;
let grid = [];
let eliminationsUntilSlideMove = 1;
let eliminationCounter = 0;
const incrementForEliminationsUntilSlideMove = 3;


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


function initiateSlideMove(event) {
		console.log("This is in initiateSlideMove");
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

function updateRemainingEliminations() {
    const eliminationsCounterDisplay = document.getElementById("eliminationsCounterDisplay");
    eliminationsCounterDisplay.textContent = eliminationsUntilSlideMove - eliminationCounter;
}


function handleEliminateDotClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const color = event.target.style.backgroundColor;

		console.log("in handleeliminatedotclick, this is the value of event.target.style.backgroundColor", event.target.style.backgroundColor);

    if (!startDot) {
        startDot = { dotElem: event.target, row, col, color }; console.log("startDot has just been set!");
    } else {
    		console.log("Just about to initiate CHECKMATCH (ie this isn't the startdot)");
        if (checkMatch(startDot, { dotElem: event.target, row, col, color })) {
        		console.log("This is inside the if(checkmatch) statement in handleeliminatedotclick");
            removeMatchedDots(startDot, { dotElem: event.target, row, col, color });
            updateScore(1);
            eliminationCounter++;

						updateRemainingEliminations();

            // Grant a slide move and reset the counter if the condition is met
            if (eliminationCounter >= eliminationsUntilSlideMove) {
                updateSlideMoves(1);
                eliminationCounter = 0;
            }
            
            // I think I added these event listeners in when doing the work to stop the dot being shaded out after a shift move. I can't quite remember now.
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        startDot = null;
    }
}


//function displayGameOver() {
		//alert("Sorry, the end of the game is nigh...");
//    const gameOverMessage = document.createElement("div");
//    gameOverMessage.id = "gameOverMessage";
//    gameOverMessage.innerHTML = `<h2>Game Over</h2><p>Your score: ${score}</p>`;
//    document.body.appendChild(gameOverMessage);
//}

function displayGameOver() {
    const overlay = document.createElement("div");
    overlay.id = "overlay";

    const gameOverMessage = document.createElement("div");
    gameOverMessage.id = "gameOverMessage";
    gameOverMessage.innerHTML = `<h2>Game Over</h2><p>Your score: ${score}</p><p>You can refresh this page to play again</p>`;

    overlay.appendChild(gameOverMessage);
    document.body.appendChild(overlay);
    
    // Add a short delay before updating the opacity to trigger the fade-in effect
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 1000);    
}


function hasPossibleMoves(grid) {
		//console.log("this is the START OF hasPossibleMoves !!!!!!!!!!!!");
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            let color = grid[row][col].color;

						if (col < grid[row].length - 2){
            		//console.log("color =",color, "grid[row][col + 1].color =",grid[row][col + 1].color, "grid[row][col + 2].color =", grid[row][col + 2].color );
            }

            // Check horizontally
            if (col < grid[row].length - 2 && color === grid[row][col + 1].color && color === grid[row][col + 2].color) {
            		//console.log("hasPossibleMoves, horiz = true,  row =", row," col =", col);
                return true;
            }

            // Check vertically
            if (row < grid.length - 2 && color === grid[row + 1][col].color && color === grid[row + 2][col].color) {
                //console.log("hasPossibleMoves, vertical = true,  row =",row," col =",col);
                return true;
            }

            // Check diagonal (top-left to bottom-right)
            if (row < grid.length - 2 && col < grid[row].length - 2 && color === grid[row + 1][col + 1].color && color === grid[row + 2][col + 2].color) {
                //console.log("hasPossibleMoves, diag top L to bottom R = true,  row =",row," col =",col);
                return true;
            }

            // Check diagonal (top-right to bottom-left)
            if (row < grid.length - 2 && col > 1 && color === grid[row + 1][col - 1].color && color === grid[row + 2][col - 2].color) {
                //console.log("hasPossibleMoves, diag top R to bottom L = true,  row =",row," col =",col);
                return true;
            }
        }
    }
    return false;
}


// there's a new handleDotClick function below
function handleDotClick(event) {

	console.log("THIS IS THE SHORT handleDotClick WHICH REDIRECTS TO SLIDE MOVE OR ELIMINATE");

    if (event.shiftKey) {
    		console.log("this is in the 'if shift key' bit, wtihin handledotclick");
        initiateSlideMove(event);
    } else {
        handleEliminateDotClick(event);
    }
    
    // not sure if this is working? maybe remove this if statement?
    //if (!hasPossibleMoves(grid) && slideMoves === 0) {
    	//	displayGameOver();
		//}
    
}


function handleDotMouseDown(event) {

//console.log("this is handledotmousedown");

    if (event.shiftKey && slideMoves > 0) {
    		//console.log("This is inside the if-shift-key & slidemoves>0 statement");
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
    
    //console.log("haspossiblemoves = ",hasPossibleMoves(grid), " in handledotmousedown");
        
        if (!hasPossibleMoves(grid) && slideMoves === 0) {
    				displayGameOver();
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

//console.log("this is handlemouseup");



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
        
        //console.log("haspossiblemoves is equal to ",hasPossibleMoves(grid));
        
        if (!hasPossibleMoves(grid) && slideMoves === 0) {
    				displayGameOver();
				}

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
            const color = colors[Math.floor(Math.random() * colors.length)];            
            dot.style.backgroundColor = color;
            dot.addEventListener("mousedown", handleDotMouseDown);
            grid[i][j] = { dotElem: dot, color };
        }
    }
    renderGrid();
}

function renderGrid() {
    gameContainer.innerHTML = "";
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            gameContainer.appendChild(grid[i][j].dotElem);
        }
    }
    addTransitionEndEventListeners(); //not sure this line is actually needed here?
}



const slideMovesElem = document.getElementById("slide-moves");
const totalSlideMovesEarnedElem = document.getElementById("total-slide-moves-earned");

function updateSlideMoves(value) {
    slideMoves += value;
    slideMovesElem.textContent = slideMoves;
    
    if(value>0){
        totalSlideMovesEarned += value;
        totalSlideMovesEarnedElem.textContent = totalSlideMovesEarned;
    }
}



function checkMatch(dot1, dot2) {
    const rowDiff = Math.abs(dot1.row - dot2.row);
    const colDiff = Math.abs(dot1.col - dot2.col);


		console.log("CHECKMATCH: Dot1.row:",dot1.row, "dot1.col:", dot1.col, "Dot1 color:", dot1.color, "Dot2.row:",dot2.row, "dot2.col:", dot2.col,"Dot2 color:", dot2.color);

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

// Used to use generateRandomDotColor, but not that's been superseded by generateNewColorExcept
//function generateRandomDotColor() {
//    return colors[Math.floor(Math.random() * colors.length)];
//}

function generateNewColorExcept(color) {
    const availableColors = colors.filter(c => c !== color);
    return availableColors[Math.floor(Math.random() * availableColors.length)];
}


function removeMatchedDots(dot1, dot2) {
    const rowDiff = Math.abs(dot1.row - dot2.row);
    const colDiff = Math.abs(dot1.col - dot2.col);

		//console.log("CURRENTLY REMOVING a 3-in-a-row!");

    const newColor1 = generateNewColorExcept(dot1.color);
    const newColor2 = generateNewColorExcept(dot2.color);
    dot1.dotElem.style.backgroundColor = newColor1;
    dot2.dotElem.style.backgroundColor = newColor2;

    grid[dot1.row][dot1.col].color = newColor1;
    grid[dot2.row][dot2.col].color = newColor2;

    const middleRow = (dot1.row + dot2.row) / 2;
    const middleCol = (dot1.col + dot2.col) / 2;
    const middleDot = gameContainer.children[middleRow * gridSize + middleCol];    
    const newMiddleColor = generateNewColorExcept(dot1.color);
    middleDot.style.backgroundColor = newMiddleColor;
    grid[middleRow][middleCol].color = newMiddleColor;
}

function updateDotDataAttributes() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const dot = grid[i][j].dotElem;
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

    // Update the color property for each dot in the grid
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            grid[i][j].color = grid[i][j].dotElem.style.backgroundColor;
            //console.log("in performslidemove, grid[",i,"][",j,"].color =", grid[i][j].color);
        }
    }

    renderGrid();
    addTransitionEndEventListeners();
    updateDotDataAttributes();
    




}



function updateScore(points) {
    score += points;
    scoreElem.textContent = score;
    if(score % incrementForEliminationsUntilSlideMove === 0){
    		eliminationsUntilSlideMove++;
    }
}


generateGrid();
