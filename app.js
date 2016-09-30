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

    function init() {
        $('body').append('<canvas id="jsSnake">');
        var $canvas = $("#jsSnake");
        $canvas.attr("width", 500);
        $canvas.attr("height", 500);
        var canvas = $canvas[0];
        ctx = canvas.getContext("2d");
        snake = JS_Snake.snake();
        bindEvents();
        gameLoop();
    }

    function gameLoop() {
        //xPos += 2;
        //yPos += 4;
        ctx.clearRect(0, 0, JS_Snake.width, JS_Snake.height);
        snake.advance();
        snake.draw(ctx);
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


        })

    }

    return {
        init: init
    };
})();

JS_Snake.snake = function () {
    var posArray = [];
    posArray.push([6, 4]);
    posArray.push([5, 4]);
    posArray.push([4, 4]);
    var direction = 'right';

    function set

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
        nextPosition[0] += 1; //add 1 to the x position
        //add the new position to the beginning of the array
        posArray.unshift(nextPosition);
        //and remove the last position
        posArray.pop();
    }
    return {
        draw: draw,
        advance: advance
    };
};


$(document).ready(function () {
    JS_Snake.game.init();
});
