$(document).ready(function () {
    //Setting up the canvas

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    var w = canvas.width;
    var h = canvas.height;

    var cw = 10 //cell width for snake and food
        //var direction; //direction snake is moving
    var rightPressed = true;
    var leftPressed = false;
    var downPressed = false;
    var upPressed = false;
    var food;
    var score = 0;
    //initializing the snake array
    //an array of cells to make up the snake
    var snake_array = [];

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = true;
        } else if (e.keyCode == 37) {
            leftPressed = true;
        } else if (e.keyCode == 38) {
            upPressed = true;
        } else if (e.keyCode == 40) {
            downPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = false;
        } else if (e.keyCode == 37) {
            leftPressed = false;
        } else if (e.keyCode == 38) {
            upPressed = false;
        } else if (e.keyCode == 40) {
            downPressed = false;
        }
    }

    function draw_snake() {
        var length = 5; //starting length of snake

        for (var i = length - 1; i >= 0; i--) {
            snake_array.push({
                x: i,
                y: 0
            });
            //this creates a snake starting with 5 cells
        }
    }

    function draw_food() {
        food = {
            x: Math.round(Math.random() * (w - cw) / cw),
            y: Math.round(Math.random() * (h - cw) / cw)
        };
        /*This will create a cell with x/y between 0-49, because
        there are 50 (500/10) positions across the rows/columns*/
    }

    function collision(x, y, array) {
        /*This function will check if the provided x/y coordinates exist
        in an array of cells or not*/
        for (var i = 0; i < array.length; i++) {
            if (array[i].x == x && array[i].y == y)
                return true;
        }
        return false;
    }

    function paint_cells(x, y) {
        ctx.fillStyle = "blue";
        ctx.fillRect(x * cw, y * cw, cw, cw);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x * cw, y * cw, cw, cw);
    }

    function draw_score() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "blue";
        ctx.fillText("Score: " + score, 8, 20);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw_snake();
        //draw_food();
        //The movement code for the snake to come here.
        //The logic is simple
        //Pop out the tail cell and place it infront of the head cell
        var nx = snake_array[0].x;
        var ny = snake_array[0].y;
        //These were the position of the head cell.
        //We will increment it to get the new head position
        //Lets add proper direction based movement now
        if (rightPressed) nx++;
        else if (leftPressed) nx--;
        else if (upPressed) ny--;
        else if (downPressed) ny++;

        // If the snake hits the wall or bumps into its body, you lose and the game will restart
        if (nx == -1 || nx == w / cw || ny == -1 || ny == h / cw || collision(nx, ny, snake_array)) {
            //restart game
            alert("Game Over, You Lose!");
            document.location.reload();
        }

        /*The logic for the snake eating the food:
        If the new head position matches with that of the food,
        Create a new head instead of moving the tail*/
        if (nx == food.x && ny == food.y) {
            var tail = {
                x: nx,
                y: ny
            };
            score++;
            //Create new food
            draw_food();
        } else {
            var tail = snake_array.pop(); //pops out the last cell
            tail.x = nx;
            tail.y = ny;
        }
        //The snake can now eat the food.

        snake_array.unshift(tail); //puts back the tail as the first cell

        for (var i = 0; i < snake_array.length; i++) {
            var c = snake_array[i];
            //Lets paint 10px wide cells
            paint_cells(c.x, c.y);
        }

        //Lets paint the food
        paint_cells(food.x, food.y);
        draw_score();
    }
    setInterval(draw, 60);


});
