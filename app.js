
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');


canvas.width = canvas.height = 600;
canvas.style.width = '600px';
canvas.style.height = '600px';
canvas.style.border = '1px solid black';

const CELL_SIZE = 30;
const WORLD_WIDTH = Math.floor(canvas.width / CELL_SIZE);
const WORLD_HEIGHT = Math.floor(canvas.height / CELL_SIZE);
const MOVE_INTERVAL = 200;
const FOOD_SPAN_INTERVAL = 2500;



let input;
let snake;
let foods;
let foodSpawnElpsed;
let gameOver;
let score;

function reset() {
    input={};
    snake = {
        moveElapsed: 0,
        length: 4,
        parts: [{
            x: 0,
            y: 0,
        }],
        direction: null,

        newDirection: {

            x: 1,
            y: 0
        }

    }

    foods = [{
        x: 10,
        y: 0,
    }];
    foodSpawnElpsed = 0;
    gameOver = false;
    score = 0;
}


function update(delta) {
    if (gameOver) {
        if(input[' ']){
            reset();
        };
        return
    }
    if (input.ArrowLeft && snake.direction.x !== 1) {
        snake.newDirection = { x: -1, y: 0 }
    }
    else if (input.ArrowUp && snake.direction.y !== 1) {
        snake.newDirection = { x: 0, y: -1 }
    }
    else if (input.ArrowRight && snake.direction.x !== -1) {
        snake.newDirection = { x: 1, y: 0 }
    }
    else if (input.ArrowDown && snake.direction.y !== -1) {
        snake.newDirection = { x: 0, y: 1 }
    }



    snake.moveElapsed += delta;

    if (snake.moveElapsed > MOVE_INTERVAL) {
        snake.direction = snake.newDirection;
        snake.moveElapsed -= MOVE_INTERVAL;
        const newSnakePart = {
            x: snake.parts[0].x + snake.direction.x,
            y: snake.parts[0].y + snake.direction.y
        };
        snake.parts.unshift(newSnakePart);
        if (snake.parts.length > snake.length) {
            snake.parts.pop();
        }

        const head = snake.parts[0];
        const foodEatenIndex = foods.findIndex(f => f.x === head.x && f.y === head.y)
        if (foodEatenIndex >= 0) {
            snake.length++;
            score++;
            foods.splice(foodEatenIndex, 1);
        };
        const worldIntersect = head.x < 0 || head.x >= WORLD_WIDTH || head.y < 0 || head.y >= WORLD_HEIGHT;
        if (worldIntersect) {
            gameOver = true;
            return
        }

        const snakePartIntersect = snake.parts.some((part, index) => index !== 0 && head.x === part.x && head.y === part.y);

        if (snakePartIntersect) {
            gameOver = true;
        }
    };

    foodSpawnElpsed += delta;
    if (foodSpawnElpsed > FOOD_SPAN_INTERVAL) {
        foodSpawnElpsed -= FOOD_SPAN_INTERVAL;
        foods.push({
            x: Math.floor(Math.random() * WORLD_WIDTH),
            y: Math.floor(Math.random() * WORLD_HEIGHT),
        });
    }





};

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = "middle";

    ctx.fillStyle = "brown";
    foods.forEach(({ x, y }) => {
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
    
    ctx.fillStyle = "green";
    snake.parts.forEach(({ x, y }, index) => {
        if (index === 0) {
            ctx.fillStyle = "darkgreen";
        }
        else {
            ctx.fillStyle = "green";
        }
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });



    ctx.fillStyle = 'orange';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, CELL_SIZE / 2);

    if (gameOver) {

        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('HÁT EZT BESZOPTAD KONCZ', canvas.width / 2, canvas.height / 2)

        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('TE JÓ ISTEN HOGY BESZOPTAD', canvas.width / 2, canvas.height / 2+50)

        ctx.fillStyle = 'red';
        ctx.font = '15px Arial';
        ctx.fillText(`MÉG EGY KURVA SNAKE JÁTÉKBAN SEM TUDSZ ELÉRNI TÖBB MINT ${score} pontot`, canvas.width / 2, canvas.height / 2+100)

        ctx.fillStyle = 'black';
        ctx.font = '40px Arial';
        ctx.fillText('GRATULÁLOK BAZDMEG', canvas.width / 2, canvas.height / 2+150)

        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Press SPACE to restart!', canvas.width / 2, canvas.height / 2+200)
    }
};

let lastLoopTime = Date.now();



function gameLoop() {
    const now = Date.now();
    const delta = now - lastLoopTime;
    lastLoopTime = now;
    update(delta);
    render();

    window.requestAnimationFrame(gameLoop);
};

reset(); 
gameLoop();

window.addEventListener('keydown', (event) => {
    input[event.key] = true;
})

window.addEventListener('keyup', (event) => {
    input[event.key] = false;
})