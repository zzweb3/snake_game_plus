use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

extern crate web_sys;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

#[wasm_bindgen(module = "/www/utils/rnd.js")]
extern {
    fn rnd(max: usize) -> usize;
}

#[wasm_bindgen]
#[derive(PartialEq)]
pub enum Direction {
    Up,
    Right,
    Down,
    Left
}

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub enum GameStatus {
    Won,
    Lost,
    Played,
}

#[derive(PartialEq, Clone, Copy)]
pub struct SnakeCell(usize);

struct Snake {
    body: Vec<SnakeCell>,
    direction: Direction,
}

impl Snake {
    fn new(spawn_index: usize, size: usize) -> Snake {
        let mut body = vec!();
        for i in 0..size {
            body.push(SnakeCell(spawn_index - i));  //初始蛇头永远在最右侧
        }

        Snake {
            body,
            direction: Direction::Right,
        }
    }
}

#[wasm_bindgen]
pub struct World {
    width: usize,
    size: usize,
    snake: Snake,
    next_cell: Option<SnakeCell>,
    reward_cell: Option<usize>,
    status: Option<GameStatus>,
    points: usize,
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize, snake_idx: usize) -> World {
        let snake = Snake::new(snake_idx, 3);
        let size = width * width;
        World { 
            width,
            size,
            reward_cell: World::gen_reward_cell(size, &snake.body),
            snake,
            next_cell: None,
            status: None,
            points: 0,
         }
    }

    fn gen_reward_cell(max: usize, snake_body: &Vec<SnakeCell>) -> Option<usize> {
        let mut reward_cell;

        loop {
            reward_cell = rnd(max);
            if !snake_body.contains(&SnakeCell(reward_cell)) { break; }
        }
        Some(reward_cell)
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn points(&self) -> usize {
        self.points
    }

    pub fn reward_cell(&self) -> Option<usize> {
        self.reward_cell
    }

    pub fn size(&self) -> usize {
        self.size
    }

    /* 蛇头 */
    pub fn snake_head_idx(&self) -> usize {
        self.snake.body[0].0
    }

    pub fn start_game(&mut self) {
        self.status = Some(GameStatus::Played)
    }

    pub fn game_status(&self) -> Option<GameStatus>{
        self.status
    }

    pub fn game_status_text(&self) -> String {
        match self.status {
            Some(GameStatus::Won) => String::from("You have won!"),
            Some(GameStatus::Lost) => String::from("You have lost!"),
            Some(GameStatus::Played) => String::from("Playing"),
            None => String::from("No Status"),
        }
    }

    pub fn change_snake_dir(&mut self, direction: Direction) {
        let next_cell = self.gen_next_snake_cell(&direction);
        if self.snake.body[1].0 == next_cell.0 {
            return;
        }
        self.next_cell = Some(next_cell);
        self.snake.direction = direction;
    }

    pub fn snake_length(&self) -> usize {
        self.snake.body.len()
    }

    //*const is raw pointer
    //borrowing rules doesn't apply to it (借用规则不支持)
    pub fn snake_cells(&self) -> *const SnakeCell {
        self.snake.body.as_ptr()
    }

    pub fn snake_dir(&self) -> Direction {
        return match self.snake.direction {
            Direction::Up => Direction::Up,
            Direction::Right => Direction::Right,
            Direction::Down => Direction::Down,
            Direction::Left => Direction::Left,
        }
    }


    pub fn step(&mut self) -> Option<bool>{
        match self.status {
            Some(GameStatus::Played) => {
                let temp = self.snake.body.clone();
                match self.next_cell {
                    Some(cell) =>  {
                        self.snake.body[0] = cell;
                        self.next_cell = None;
                    },
                    None => {
                        self.snake.body[0] = self.gen_next_snake_cell(&self.snake.direction);
                    }
                }

                for i in 1..self.snake_length() {
                    self.snake.body[i] = SnakeCell(temp[i - 1].0);
                }
                //todo 蛇体包含蛇头，即蛇头撞上了蛇的身体
                if self.snake.body[1..self.snake_length()].contains(&self.snake.body[0]) {
                    self.status = Some(GameStatus::Lost);
                }
                //TODO 当蛇头吃到奖励时
                if self.reward_cell == Some(self.snake_head_idx()) {
                    if self.snake_length() < self.size() {
                        self.points += 1;
                        self.reward_cell = World::gen_reward_cell(self.size, &self.snake.body);
                    } else {
                        self.reward_cell = None;
                        self.status = Some(GameStatus::Won);
                    }
                    //self.snake.body.push(SnakeCell(self.snake.body[1].0));  //push蛇头后面第一个节点
                    self.snake.body.insert(1, SnakeCell(self.snake.body[1].0)); //push蛇头后面第一个节点插入到Vec第二个元素位置
                    return Some(true);  //返回true，蛇没吃到一次奖励，就返回true，通知前端提速。
                }
               return None;
            },
            _ => {
               return None;
            }
        }
    }

    fn gen_next_snake_cell(&self, direction: &Direction) -> SnakeCell {
        let snake_idx = self.snake_head_idx();
        let row = snake_idx / self.width;

        return match direction {
            Direction::Right => {
                let treshold = (row + 1) * self.width();
                //行的最后一个元素
                 if snake_idx + 1 == treshold {
                    SnakeCell(treshold - self.width)
                 } else {
                    SnakeCell(snake_idx + 1)
                 }
            },
            Direction::Left => {
                let treshold = row * self.width;
                if snake_idx == treshold {
                    SnakeCell(treshold + (self.width - 1))
                } else {
                    SnakeCell(snake_idx - 1)
                }
            },
            Direction::Up => {
                // let a = (snake_idx - self.width) % self.size;
                // web_sys::console::log_1(&a.to_string().into());
                // SnakeCell((snake_idx - self.width) % self.size) //第一行再向上移动呢？？？
                let treshold = snake_idx - (row * self.width);
                if snake_idx == treshold { //第一行
                    SnakeCell((self.size - self.width) + treshold)
                } else {
                    SnakeCell(snake_idx - self.width)
                }
            },
            Direction::Down => {
                let treshold = snake_idx + ((self.width - row) * self.width);
                if snake_idx + self.width == treshold { //最后一行
                    SnakeCell(treshold - ((row + 1) * self.width))
                } else {
                    SnakeCell(snake_idx + self.width)
                }
            },
        };
    }
}
//wasm-pack build --target web