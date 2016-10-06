var JS_Snake = {};

JS_Snake.game = (function () {
    var ctx;
    //var xPos = 0;
    //var yPos = 0;
    JS_Snake.width = 500;
    JS_Snake.height = 500;
    JS_Snake.blockSize = 10;
    var frameLength = 100; //new frame every 100ms
    var snake;
    var apple;

    function init() {
        $('body').append('<canvas id="jsSnake">');
        var $canvas = $("#jsSnake");
        $canvas.attr("width", 500);
        $canvas.attr("height", 500);
        var canvas = $canvas[0];
        ctx = canvas.getContext("2d");
        snake = JS_Snake.snake();
        apple = JS_Snake.apple();
        bindEvents();
        gameLoop();
    }

    function gameLoop() {
        //xPos += 2;
        //yPos += 4;
        ctx.clearRect(0, 0, JS_Snake.width, JS_Snake.height);
        snake.advance();
        snake.draw(ctx);
        apple.draw(ctx);
        setTimeout(gameLoop, frameLength);
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

    }

    return {
        init: init
    };
})();

JS_Snake.apple = function () {
    var position = [6, 6];

    function draw(ctx) {
        ctx.save();
        ctx.fillStyle = "green";
        ctx.beginPath();
        var radius = JS_Snake.blockSize / 2;
        var x = position[0] * JS_Snake.blockSize + radius;
        var y = position[1] * JS_Snake.blockSize + radius;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    return {
        draw: draw
    };
};

JS_Snake.snake = function () {
    var posArray = [];
    posArray.push([6, 4]);
    posArray.push([5, 4]);
    posArray.push([4, 4]);
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

    function advance() {
        var nextPosition = posArray[0].slice(); //copy head of snake
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

        //add the new position to the beginning of the array
        posArray.unshift(nextPosition);
        //and remove the last position
        posArray.pop();
    }
    return {
        draw: draw,
        advance: advance,
        setDirection: setDirection
    };
};


$(document).ready(function () {
    JS_Snake.game.init();
});
