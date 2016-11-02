var JS_Snake = {};

JS_Snake.equalCoordinates = function (coord1, coord2) {
    return coord1[0] === coord2[0] && coord1[1] === coord2[1];
}

JS_Snake.checkCoordinateInArray = function (coord, arr) {
    var isInArray = false;
    $.each(arr, function (index, item) {
        if (JS_Snake.equalCoordinates(coord, item)) {
            isInArray = true;
        }
    });
    return isInArray;
};

JS_Snake.game = (function () {
    var canvas, ctx;
    JS_Snake.width = 500;
    JS_Snake.height = 500;
    JS_Snake.blockSize = 15;
    JS_Snake.widthInBlocks = JS_Snake.width / JS_Snake.blockSize;
    JS_Snake.heightInBlocks = JS_Snake.height / JS_Snake.blockSize;
    var frameLength = 100; //new frame every 100ms
    var snake;
    var apple;
    var score;
    var highscore = localStorage.getItem("highscore");
    var timeout;

    function init() {
        $('body').append('<canvas id="jsSnake">');
        var $canvas = $("#jsSnake");
        $canvas.attr("width", 500);
        $canvas.attr("height", 500);
        var canvas = $canvas[0];
        ctx = canvas.getContext("2d");
        score = 0;
        snake = JS_Snake.snake();
        apple = JS_Snake.apple();
        bindEvents();
        gameLoop();
    }

    function gameLoop() {
        ctx.clearRect(0, 0, JS_Snake.width, JS_Snake.height);
        snake.advance(apple);
        draw();

        if (snake.checkCollision()) {
            snake.draw(ctx);
            gameOver();
        } else {
            timeout = setTimeout(gameLoop, frameLength);
        }
    }

    function draw() {
        snake.draw(ctx);
        apple.draw(ctx);
        drawScore();
    }


    function drawScore() {
        ctx.save();
        ctx.font = "bold 100px cursive";
        ctx.fillStyle = 'rgba(0,0,0, 0.25)';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centerX = JS_Snake.width / 2;
        var centerY = JS_Snake.height / 2;
        /*highscore = 0;
        if (score > highscore && snake.checkCollision()) {
            highscore = score;
            alert("You got the high score: " + highscore);
            localStorage.setItem("highscore", score);
        } else {*/
        ctx.fillText(score.toString(), centerX, centerY);
        //}
        ctx.restore();
    }

    function gameOver() {
        ctx.save();
        ctx.font = "bold 50px monospace";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineWidth = 2;
        var centerX = JS_Snake.width / 2;
        var centerY = JS_Snake.height / 2;
        ctx.fillText("Game Over", centerX, centerY - 75);
        ctx.font = "bold 20px monospace";
        ctx.fillText("Press space to restart", centerX, centerY + 75);
        //highscore = 0;
        if (score > highscore && snake.checkCollision()) {
            highscore = score;
            localStorage.setItem("highscore", score);
            ctx.font = "bold 50px serif";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.fillText("High Score!!!", centerX, centerY - 150);
        }
        ctx.restore();
    }

    function bindEvents() {
        var keysToDirections = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        $(document).keydown(function (event) {
            var key = event.which;
            var direction = keysToDirections[key];

            if (direction) {
                snake.setDirection(direction);
                event.preventDefault();
            } else if (key === 32) {
                location.reload();
            }

        });
        $(JS_Snake).bind('appleEaten', function (event, snakePositions) {
            apple.setNewPosition(snakePositions);
            score++;
            frameLength *= 0.99;
        });
        $(canvas).click(function () {
            location.reload();
        })
    }

    return {
        init: init
    };
})();

JS_Snake.apple = function () {

    var randomX = generateRandomNumber();
    var randomY = generateRandomNumber();
    var position = [randomX, randomY];
    //function to have apple spawn at random position when game starts
    function generateRandomNumber() {
        var randomNumber = Math.floor(Math.random() * 30) + 1;
        return randomNumber;
    }

    function draw(ctx) {
        ctx.save();
        ctx.fillStyle = "red";
        ctx.beginPath();
        var radius = JS_Snake.blockSize / 2;
        var x = position[0] * JS_Snake.blockSize + radius;
        var y = position[1] * JS_Snake.blockSize + radius;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function random(low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }
    //find a random position within the canvas
    function getRandomPosition() {
        var x = random(1, JS_Snake.widthInBlocks - 2);
        var y = random(1, JS_Snake.heightInBlocks - 2);
        return [x, y];
    }

    function setNewPosition(snakeArray) {
        var newPosition = getRandomPosition();
        //if new position is already covered by the snake,
        //call the function again until that is no longer the case
        if (JS_Snake.checkCoordinateInArray(newPosition, snakeArray)) {
            return setNewPosition(snakeArray);
        } else {
            position = newPosition;
        }
    }

    function getPosition() {
        return position;
    }
    return {
        draw: draw,
        setNewPosition: setNewPosition,
        getPosition: getPosition
    };
};

JS_Snake.snake = function () {
    var previousPosArray;
    var posArray = [];
    posArray.push([6, 4]);
    posArray.push([5, 4]);
    posArray.push([4, 4]);
    posArray.push([3, 4]);
    posArray.push([2, 4]);
    posArray.push([1, 4]);
    var direction = 'right';
    var nextDirection = direction;

    function setDirection(newDirection) {
        var allowedDirections;

        switch (direction) {
        case 'left':
        case 'right':
            allowedDirections = ["up", "down"];
            break;
        case 'up':
        case 'down':
            allowedDirections = ["left", "right"];
            break;
        default:
            throw ("Invalid direction");
        }
        if (allowedDirections.indexOf(newDirection) > -1) {
            nextDirection = newDirection;
        }
    }

    function drawSection(ctx, position) {
        var x = JS_Snake.blockSize * position[0];
        var y = JS_Snake.blockSize * position[1];
        ctx.fillRect(x, y, JS_Snake.blockSize, JS_Snake.blockSize);
    }

    function draw(ctx) {
        ctx.save();
        ctx.fillStyle = 'green';
        for (var i = 0; i < posArray.length; i++) {
            drawSection(ctx, posArray[i]);
        }
        ctx.restore();
    }

    function checkCollision() {
        var wallCollision = false;
        var snakeCollision = false;
        var head = posArray[0]; //just the head of the snake
        var rest = posArray.slice(1) //rest of the snake (from the 1 index to the end)
        var snakeX = head[0];
        var snakeY = head[1];
        var minX = 1;
        var minY = 1;
        var maxX = JS_Snake.widthInBlocks - 1;
        var maxY = JS_Snake.heightInBlocks - 1;
        var outsideHorizantalBounds = snakeX < minX || snakeX >= maxX;
        var outsideVerticalBounds = snakeY < minY || snakeY >= maxY;

        if (outsideHorizantalBounds || outsideVerticalBounds) {
            wallCollision = true;
        }
        //check if snake head collides with rest of snake
        snakeCollision = JS_Snake.checkCoordinateInArray(head, rest);
        return wallCollision || snakeCollision;
    }

    function advance(apple) {
        //copy head of snake otherwise changes below affect head of the snake
        var nextPosition = posArray[0].slice();
        //nextPosition[0] += 1; //add 1 to the x position
        direction = nextDirection;
        switch (direction) {
        case 'left':
            nextPosition[0] -= 1;
            break;
        case 'up':
            nextPosition[1] -= 1;
            break;
        case 'right':
            nextPosition[0] += 1;
            break;
        case 'down':
            nextPosition[1] += 1;
            break;
        default:
            throw ("Invalid direction");
        }
        previousPosArray = posArray.slice();
        //add the new position to the beginning of the array
        posArray.unshift(nextPosition);
        if (isEatingApple(posArray[0], apple)) {
            $(JS_Snake).trigger('appleEaten', [posArray])
        } else {
            //remove the last position of the snake array
            posArray.pop();
        }
    }

    function isEatingApple(head, apple) {
        return JS_Snake.equalCoordinates(head, apple.getPosition());
    }
    return {
        draw: draw,
        advance: advance,
        setDirection: setDirection,
        checkCollision: checkCollision
    };
};


$(document).ready(function () {
    JS_Snake.game.init();
});
