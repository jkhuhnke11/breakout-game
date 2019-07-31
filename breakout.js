// --------------------------------------------------
// Grabs Canvas Element
// --------------------------------------------------
var canvas = document.getElementById("myCanvas"); 
var ctx = canvas.getContext("2d"); 

// --------------------------------------------------
// Defines Position of Ball
// --------------------------------------------------
var x = canvas.width/2; 
var y = canvas.height-30; 
var dx = null; 
var dy = null; 
var ballRadius = 10; 

// --------------------------------------------------
// Defines Paddle
// --------------------------------------------------
var paddleHeight = 10; 
var paddleWidth = 75; 
var paddleX = (canvas.width-paddleWidth)/2; 

// --------------------------------------------------
// Defines Bricks 
// --------------------------------------------------
var brickRowCount = 3; 
var brickColumnCount = 5; 
var brickWidth = 75; 
var brickHeight = 20; 
var brickPadding = 10; 
var brickOffsetTop = 30; 
var brickOffsetLeft = 30; 
var bricks = []; 
for(var c = 0; c < brickColumnCount; c++){
    bricks[c] = []; 
    for(var r = 0; r < brickRowCount; r++){
        bricks[c][r] = { x: 0, y: 0, status: 1}; 
    }
}

// --------------------------------------------------
// Sets Score
// --------------------------------------------------
var score = 0; 

// --------------------------------------------------
// Number of Lives
// --------------------------------------------------
var lives = 3; 

// --------------------------------------------------
// Keypress Information
// --------------------------------------------------
var rightPressed = false, 
    leftPressed  = false; 

// --------------------------------------------------
// Header Buttons
// --------------------------------------------------
var resetButton = document.querySelector("#reset"),
    modeButtons = document.querySelectorAll(".mode");

// --------------------------------------------------
// Initializes Game & Sets Up Difficulty Buttons
// --------------------------------------------------

resetButton.addEventListener("click", function() {
    document.location.reload();  
});

setUpModeButtons(); 

function setUpModeButtons(){
    for(var i = 0; i < modeButtons.length; i++){
        modeButtons[i].addEventListener("click", function(){
            modeButtons[0].classList.remove("selected"); 
            modeButtons[1].classList.remove("selected");
            modeButtons[2].classList.remove("selected"); 
            this.classList.add("selected");
            //Sets level difficulty 
            if(this.textContent === "Easy"){
                dx = 2; dy = -2; 
            } else if(this.textContent === "Normal"){
                dx = 3; dy = -3; 
            } else {
                dx = 4; dy = -4;  
            } 
        }); 
    }
}

// --------------------------------------------------
// Drawing Functions
// --------------------------------------------------
function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#66A7C5";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath(); 
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight); 
    ctx.fillStyle = "#6C7476"; 
    ctx.fill(); 
    ctx.closePath(); 
}

function drawBricks(){
    for(var c = 0; c < brickColumnCount; c++){
        for(var r = 0; r < brickRowCount; r++){
            if(bricks[c][r].status == 1){
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#EE3233";
                ctx.fill();
                ctx.closePath(); 
            } 
        }
    }
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawBricks(); 
    drawBall();  
    drawPaddle(); 
    drawScore(); 
    drawLives(); 
    collisionDetection(); 
    x += dx; 
    y += dy; 

    // Ball Collision with Edges of Canvas
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    } 

    if(y + dy < ballRadius){
        dy = -dy; 
    } else if(y + dy > canvas.height - ballRadius){
        if(x > paddleX && x < paddleX + paddleWidth){
            dy = -dy; 
        } else {
            lives--; 
            if(!lives){
                resetButton.textContent = "Try Again?" 
                document.location.reload();  
            } else {
                x = canvas.width/2; 
                y = canvas.height - 30; 
                paddleX = (canvas.width - paddleWidth)/2; 
            }
        }
    }

    // Paddle Motion & Collision with Edge of Canvas 
    if(rightPressed && paddleX < canvas.width - paddleWidth){
        paddleX += 7; 
    } else if(leftPressed && paddleX > 0) {
        paddleX -= 7; 
    }

    requestAnimationFrame(draw); 
}

// --------------------------------------------------
// Keypress Functions
// --------------------------------------------------
function keyDownHandler(e){
    if(e.key== "Right" || e.key == "ArrowRight"){
        rightPressed = true; 
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true; 
    }
}

function keyUpHandler(e){
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    } 
}

// --------------------------------------------------
// Collision Detection Function
// --------------------------------------------------
function collisionDetection(){
    for(var c = 0; c < brickColumnCount; c++){
        for(var r = 0; r < brickRowCount; r++){
            var b = bricks[c][r];
            if(b.status == 1){
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0; 
                    score++; 
                    if(score == brickRowCount * brickColumnCount){
                        resetButton.textContent = "Play Again?"; 
                        dx = 0; dy = 0;  
                    }
                }
            }
        }
    }
}

// --------------------------------------------------
// Creates and Updates the Score 
// --------------------------------------------------
function drawScore(){
    ctx.font = "16px Arial"; 
    ctx.fillStyle = "#6C7476"; 
    ctx.fillText("Score: " + score, 8, 20); 
}

// --------------------------------------------------
// Lives Counter
// --------------------------------------------------
function drawLives(){
    ctx.font = "16px Arial"; 
    ctx.fillStyle = "#6C7476"; 
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20); 
}

// --------------------------------------------------
// Adds Paddle Motion to Mouse Motion
// --------------------------------------------------
function mouseMoveHandler(e){
    var relativeX = e.clientX - canvas.offsetLeft; 
    if(relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - paddleWidth/2; 
    }
}

document.addEventListener("keydown", keyDownHandler, false); 
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false); 
draw(); 
