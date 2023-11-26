import init, {Direction, GameStatus, World} from "snake_game"; //从pkg中导入
import {rnd} from "./utils/rnd";

//init() 页面加载时被调用
init().then(wasm => {

    let fps = 3;    //初始时刻每秒5帧
    const CELL_SIZE = 50;   //单元格大小 10个像素
    const WORLD_WIDTH = 20;
    const snakeSpawnIdx = rnd(WORLD_WIDTH * WORLD_WIDTH);   //蛇头

    const world = World.new(WORLD_WIDTH, snakeSpawnIdx);
    const worldWidth = world.width();

    const points = document.getElementById("points");
    const gameStatus = document.getElementById("game-status");
    const gameControlBtn = document.getElementById("game-control-btn");

    const canvas = <HTMLCanvasElement> document.getElementById("snake-canvas");
    const ctx = canvas.getContext("2d");

    canvas.height = worldWidth * CELL_SIZE;
    canvas.width = worldWidth * CELL_SIZE;

    //记录上一次蛇尾的位置
    let beforTailCol:number;
    let beforTailRow:number;
    let beforTailDraw: Direction;

    gameControlBtn.addEventListener("click", _ => {
        const status = world.game_status();
        if(status === undefined) {
            gameControlBtn.textContent = "Playing...";
            world.start_game();
            play();
        } else {
            location.reload();
        }
    });

    document.addEventListener("keydown", (e) => {
        switch(e.code) {
            case "ArrowUp":
            case "KeyW":
                world.change_snake_dir(Direction.Up);
                break;
            case "ArrowRight":
            case "KeyD":
                world.change_snake_dir(Direction.Right);
                break;
            case "ArrowDown":
            case "KeyS":
                world.change_snake_dir(Direction.Down);
                break;
            case "ArrowLeft":
            case "KeyA":
                world.change_snake_dir(Direction.Left);
                break;
        }
    });

    function drawWorld() {
        ctx.beginPath();
        ctx.setLineDash([1, 3]);    //虚线
        ctx.strokeStyle = '#808080';

        for(let x = 0; x < worldWidth + 1; x++) {
            ctx.moveTo(CELL_SIZE * x, 0);
            ctx.lineTo(CELL_SIZE * x, worldWidth * CELL_SIZE);
        }

        for(let y = 0; y < worldWidth + 1; y++) {
            ctx.moveTo(0, CELL_SIZE * y);
            ctx.lineTo(worldWidth * CELL_SIZE, CELL_SIZE * y);
        }
        ctx.stroke();
    }

    function drawReward() {
        const idx = world.reward_cell();
        const col = idx % worldWidth;
        const row = Math.floor(idx / worldWidth);

        ctx.beginPath();

        ctx.arc(col * CELL_SIZE + CELL_SIZE/2,row * CELL_SIZE + CELL_SIZE/2, CELL_SIZE/2.5, 0,2*Math.PI);
        ctx.fillStyle="#FF4040";
        ctx.fill();
        ctx.setLineDash([]);
        ctx.strokeStyle="#FF4040";

        ctx.stroke();
    }

    function drawSnake() {
        const snakeCells = new Uint32Array(
            wasm.memory.buffer,
            world.snake_cells(),
            world.snake_length(),
        );
        //console.log(snakeCells);
        const status = world.game_status();

        snakeCells
            .slice()
            //.filter((cellIdx, i) => !(i > 0 && cellIdx === snakeCells[0]))    //filter out duplicates 过滤重复项
            //.reverse()  //revers array 反转数组
            .forEach((cellIdx, i) => {
                //(x, y) 即 (col, row)
                const col = cellIdx % worldWidth;
                const row = Math.floor(cellIdx / worldWidth);
                if (beforTailCol === undefined){
                    beforTailCol = col;
                }
                if(beforTailRow === undefined) {
                    beforTailRow = row;
                }

                ctx.beginPath();

                //绘制蛇图，蛇头，蛇身，蛇尾
                if (i === 0) {  //蛇头
                    var img = new Image();   // 创建一个<img>元素
                    img.onload = function(){
                        ctx.drawImage(img,
                            col * CELL_SIZE,
                            row * CELL_SIZE,
                            CELL_SIZE,
                            CELL_SIZE)//绘制图片
                    }
                    //
                    const dir = world.snake_dir();
                    if (Direction.Up.valueOf() === dir) {
                        img.src = 'head-up.png'; // 设置图片源地址
                    } else if (Direction.Right.valueOf() === dir) {
                        img.src = 'head-right.png';
                    } else if (Direction.Down.valueOf() === dir) {
                        img.src = 'head-down.png';
                    } else if (Direction.Left.valueOf() === dir) {
                        img.src = 'head-left.png';
                    }

                } else if (i === snakeCells.length - 1) {
                    //TODO 原理
                    const tail = snakeCells[snakeCells.length - 1];
                    const tailBefore = snakeCells[snakeCells.length - 2];
                    //
                    if((tail > tailBefore && tailBefore === tail - worldWidth)  //
                        || (tail < tailBefore && tail === tailBefore - (worldWidth * (worldWidth - 1)))){
                        //img.src = 'tail-up.png';
                        drawSnapTail3(col * CELL_SIZE + CELL_SIZE/2, row * CELL_SIZE, CELL_SIZE/2, CELL_SIZE, Math.PI,Math.PI*0/180,Math.PI*180/180,"AB85F5");
                        //drawSnapTail2(col * CELL_SIZE + CELL_SIZE/2, row * CELL_SIZE, CELL_SIZE, Math.PI*180/180,Math.PI*0/180,"AB85F5");
                        //drawSnapTail(col * CELL_SIZE, row * CELL_SIZE,col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE, col * CELL_SIZE + CELL_SIZE/2, row * CELL_SIZE + CELL_SIZE, "#AB85F5");
                        beforTailDraw = Direction.Up;
                    } else if((tail < tailBefore && tail === tailBefore - worldWidth)
                        || (tail > tailBefore && tail - (worldWidth * (worldWidth - 1)) === tailBefore)) {
                        //img.src = 'tail-down.png';
                        drawSnapTail3(col * CELL_SIZE + CELL_SIZE/2, row * CELL_SIZE + CELL_SIZE, CELL_SIZE/2, CELL_SIZE, 0,Math.PI*0/180,Math.PI*180/180,"AB85F5");
                        //drawSnapTail2(col * CELL_SIZE + CELL_SIZE/2, row * CELL_SIZE + CELL_SIZE, CELL_SIZE, Math.PI*0/180,Math.PI*180/180,"AB85F5");
                        //drawSnapTail(col * CELL_SIZE, row * CELL_SIZE + CELL_SIZE,col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE + CELL_SIZE, col * CELL_SIZE + CELL_SIZE/2, row * CELL_SIZE, "#AB85F5");
                        beforTailDraw = Direction.Down;
                    } else if((tail > tailBefore && tail === tailBefore + 1)
                        ||(tail < tailBefore && tail + worldWidth - 1 === tailBefore)) {
                        //img.src = 'tail-left.png';
                        drawSnapTail3(col * CELL_SIZE, row * CELL_SIZE + CELL_SIZE/2, CELL_SIZE/2, CELL_SIZE, Math.PI/2,Math.PI*90/180,Math.PI*180/180,"AB85F5");
                        //drawSnapTail2(col * CELL_SIZE, row * CELL_SIZE + CELL_SIZE/2, CELL_SIZE, Math.PI*90/180,Math.PI*270/180,"AB85F5");
                        //drawSnapTail(col * CELL_SIZE, row * CELL_SIZE,col * CELL_SIZE, row * CELL_SIZE + CELL_SIZE, col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE + CELL_SIZE/2, "#AB85F5");
                        beforTailDraw = Direction.Left;
                    } else if((tail < tailBefore && tail === tailBefore - 1)
                        ||(tail > tailBefore && tail === tailBefore + worldWidth - 1)) {
                        //img.src = 'tail-right.png';
                        drawSnapTail3(col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE + CELL_SIZE/2, CELL_SIZE/2, CELL_SIZE, Math.PI/2, Math.PI*180/180,Math.PI*270/180,"AB85F5");
                        //drawSnapTail2(col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE + CELL_SIZE/2, CELL_SIZE, Math.PI*270/180,Math.PI*90/180,"AB85F5");
                        // drawSnapTail(col * CELL_SIZE, row * CELL_SIZE + CELL_SIZE/2,col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE, col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE +CELL_SIZE, "#AB85F5");
                        beforTailDraw = Direction.Right;
                    } else {
                        console.log("蛇吃果实了");
                        if(tail == tailBefore) {
                            switch(beforTailDraw){
                                case Direction.Up:
                                    drawSnapTail3(beforTailCol * CELL_SIZE + CELL_SIZE/2, beforTailRow * CELL_SIZE, CELL_SIZE/2, CELL_SIZE, Math.PI,Math.PI*0/180,Math.PI*180/180,"AB85F5");
                                    //drawSnapTail2(beforTailCol * CELL_SIZE + CELL_SIZE/2, beforTailRow * CELL_SIZE, CELL_SIZE, Math.PI*180/180,Math.PI*0/180,"AB85F5");
                                    //drawSnapTail(beforTailCol * CELL_SIZE, beforTailRow * CELL_SIZE,beforTailCol * CELL_SIZE + CELL_SIZE, beforTailRow * CELL_SIZE, beforTailCol * CELL_SIZE + CELL_SIZE/2, beforTailRow * CELL_SIZE + CELL_SIZE, "#AB85F5");
                                    break;
                                case Direction.Down:
                                    drawSnapTail3(beforTailCol * CELL_SIZE + CELL_SIZE/2, beforTailRow * CELL_SIZE + CELL_SIZE, CELL_SIZE/2, CELL_SIZE, 0,Math.PI*0/180,Math.PI*180/180,"AB85F5");
                                    //drawSnapTail2(beforTailCol * CELL_SIZE + CELL_SIZE/2, beforTailRow * CELL_SIZE + CELL_SIZE, CELL_SIZE, Math.PI*0/180,Math.PI*180/180,"AB85F5");
                                    //drawSnapTail(beforTailCol * CELL_SIZE, beforTailRow * CELL_SIZE + CELL_SIZE,beforTailCol * CELL_SIZE + CELL_SIZE, beforTailRow * CELL_SIZE + CELL_SIZE, beforTailCol * CELL_SIZE + CELL_SIZE/2, beforTailRow * CELL_SIZE, "#AB85F5");
                                    break;
                                case Direction.Left:
                                    drawSnapTail3(beforTailCol * CELL_SIZE, beforTailRow * CELL_SIZE + CELL_SIZE/2, CELL_SIZE/2, CELL_SIZE, Math.PI/2,Math.PI*90/180,Math.PI*180/180,"AB85F5");
                                    //drawSnapTail2(beforTailCol * CELL_SIZE, beforTailRow * CELL_SIZE + CELL_SIZE/2, CELL_SIZE, Math.PI*90/180,Math.PI*270/180,"AB85F5");
                                    //drawSnapTail(beforTailCol * CELL_SIZE, beforTailRow * CELL_SIZE,beforTailCol * CELL_SIZE, beforTailRow * CELL_SIZE + CELL_SIZE, beforTailCol * CELL_SIZE + CELL_SIZE, beforTailRow * CELL_SIZE + CELL_SIZE/2, "#AB85F5");
                                    break;
                                case Direction.Right:
                                    drawSnapTail3(beforTailCol * CELL_SIZE + CELL_SIZE, beforTailRow * CELL_SIZE + CELL_SIZE/2, CELL_SIZE/2, CELL_SIZE, Math.PI/2, Math.PI*180/180,Math.PI*270/180,"AB85F5");
                                    //drawSnapTail2(beforTailCol * CELL_SIZE + CELL_SIZE, beforTailRow * CELL_SIZE + CELL_SIZE/2, CELL_SIZE, Math.PI*270/180,Math.PI*90/180,"AB85F5");
                                    //drawSnapTail(beforTailCol * CELL_SIZE, beforTailRow * CELL_SIZE + CELL_SIZE/2,beforTailCol * CELL_SIZE + CELL_SIZE, row * CELL_SIZE, beforTailCol * CELL_SIZE + CELL_SIZE, beforTailRow * CELL_SIZE +CELL_SIZE, "#AB85F5");
                                    break;
                            }
                        }
                    }
                    //记录上一次蛇尾的位置
                    beforTailCol = col;
                    beforTailRow = row;
                } else { //蛇身
                    ctx.fillStyle = "#AB85F5";
                    ctx.fillRect(
                        col * CELL_SIZE,
                        row * CELL_SIZE,
                        CELL_SIZE,
                        CELL_SIZE
                    );
                }
            });
        ctx.stroke();
    }

    function drawSnapTail(x1: number, y1:number, x2:number, y2:number, x3:number, y3:number, color: string) {
        //三角形蛇尾
        ctx.moveTo(x1, y1); //三角形坐标1
        ctx.lineTo(x2, y2); //三角形坐标1
        ctx.lineTo(x3, y3); //三角形坐标3
        ctx.fillStyle = color;
        ctx.closePath();
        ctx.fill();
    }

    function drawSnapTail2(x1: number, y1:number, r:number, s:number, e:number, color:string) {
        //半圆形蛇尾 https://www.jb51.net/javascript/2964307fs.htm
        ctx.arc(x1, y1,r/2, s, e,true); //逆时针
        ctx.fillStyle = color;
        ctx.closePath();
        ctx.fill();
    }

    function drawSnapTail3(x:number, y:number, radiusX:number, radiusY:number, rotation:number, startAngle:number, endAngle:number, color: string) {
        //半椭圆蛇尾 https://www.jb51.net/javascript/2964307fs.htm
        // ctx.ellipse(425,400,25,50,0,0, Math.PI, false);
        ctx.ellipse(x,y,radiusX,radiusY,rotation,startAngle, endAngle, true);
        ctx.fillStyle = color;
        ctx.closePath();
        ctx.fill();
    }

    function drawGameStatus() {
        gameStatus.textContent = world.game_status_text();
        points.textContent = world.points().toString();
    }

    function paint() {
        drawWorld();
        drawSnake();
        drawReward();
        drawGameStatus();
    }

    function play() {
        const status = world.game_status();
        if(status == GameStatus.Won || status == GameStatus.Lost) {
            gameControlBtn.textContent = "Re-Play";
            return;
        }

        setTimeout(() => {
            //清除画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawWorld();
            //
            if(world.step()) {
                fps =fps + 1; //每吃到一次奖励就提升速度
            }
            paint();
            //the method takes a callback to invoked before the next repaint
            requestAnimationFrame(play)
        }, 1000 / fps);
    }

    paint();
})