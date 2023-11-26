# snake_game
> rust Webassembly 开发贪吃蛇游戏


## Rust和WebAssembly中文文档
> https://rustwasm.wasmdev.cn/docs/book/reference/debugging.html


## 软件安装
```shell
1.  node.js

2. www 目录下 安装 webpack webpack-cli webpack-dev-server 
cd www
npm install --save webpack webpack-cli 
npm install --save-dev webpack-dev-server

3.  

```
## 安装依赖
webpack 安装css
https://www.robinwieruch.de/webpack-css/
webpack 安装typescript
https://webpack.js.org/guides/typescript/




```shell
终端窗口1:
cd snake_game
cargo install wasm-pack //安装wasm-pack
wasm-pack build --target web  //编译生成wasm pkg, snake_game/pkg内容

终端窗口2:
cd snake_game/www
npm install //下载node_modules
npm run build //构建
npm run dev //启动服务

访问：
http://localhost:8080
http://localhost:8080/webpack-dev-server
```

## notes
we need to compile Rust to WebAssemblu code.
WebAssembly can be excuted in the brower.
it runs at native speed.
3d apps, cad, virtual reality, system application, games.

## 



