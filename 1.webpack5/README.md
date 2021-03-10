# React+Typescirpt+Webpack5从零配置

什么你告诉我 create-react-app 就能搞定? 我选择拒绝, 从零配置, 看看 webpack 又整啥幺蛾子.

## 初始化项目
```
// 初始化一个npm项目
npm init -y

// 安装react, react-dom
npm i react react-dom -S

// 安装webpack
npm i webpack webpack-cli -D
```
问题来了, 我要使用webpack, 为什么要装一个webpack-cli呢? 原来webpack4以后, [把命令行插件从webpack中移除了](https://stackoverflow.com/questions/51948057/install-webpack-vs-install-webpack-cli/51948245#:~:text=1%20Answer&text=Since%20webpack%20version%204%2C%20the,interface%2C%20webpack%20%3D%20main%20functionalities.), 哦. 懂了~

试了不装, 果然:

```
You need to install 'webpack-cli' to use webpack via CLI.
```

既然要使用ts 
```
npm i ts-loader -D
```

什么, 你说babel? 都2021年了, ES6都出来6年了, 还要编译成ES5, 我自己用, 不装又能怎样?

将打包的js插入html, 需要htmlwebpackplugin
```
npm i html-webpack-plugin -D
```

根目录下新建 src 文件夹, 并添加一个 index.tsx, 弄个最简单的显示一下就行:

```typescript
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<div>hello webpack</div>, document.getElementById("app"));

```

## 配置webpack
```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  resolve: {
    extensions: ["*", ".js", "jsx", "ts", "tsx"],
  },
  module: {
    rules: [
      {
        test: /(\.js|\.jsx|\.tsx|\.ts)$/,
        exclude: /node_modules/,
        use: [
          "ts-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./template.html",
    }),
  ],
};
```
我们不希望每个文件都写后缀, 所以配置resolve.extensions, 指定一下html-webpack-plugin的template 文件.

听说webpack5有很多默认配置, 那么我不写入口会怎样?

```
Module not found: Error: Can't resolve './src' in '/Users/chenbaiwei/Desktop/wheels'
resolve './src' in '/Users/chenbaiwei/Desktop/wheels'
```

看来是不把 `index.tsx` 当入口啊, 乖乖填上`entry: './src/index.tsx'`,

运行一下webpack, 咦?

```
zsh: command not found: webpack
```

找不到 webpack 命令? 哈哈, 我没有全局安装 webpack, 失误了. 似乎记得以前官方不建议全局安装, 好的, 我懂的, 配置到 `package.json` 即可.
```
  "scripts": {
    "build": "webpack --mode production",
    "start": "webpack-dev-server --mode development --open"
  },
```

目前还不想打包, 所以只需要启动webpack-dev-server即可.然而:

```
Error: Cannot find module 'webpack-cli/bin/config-yargs'
```

怎么肥四, 不对啊, 再次使用亲爱到Google. 又转到了亲爱到[stackoverflow](https://stackoverflow.com/questions/40379139/cannot-find-module-webpack-bin-config-yargs).

哈, 我又火星了, webpack4以后就不用webpack-dev-server啦...

遂改称`webpack serve`. 目前配置文件全文:

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './index.tsx',
  resolve: {
    extensions: ["*", ".js", "jsx", "ts", "tsx"],
  },
  module: {
    rules: [
      {
        test: /(\.js|\.jsx|\.tsx|\.ts)$/,
        exclude: /node_modules/,
        use: [
          "ts-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./template.html",
    }),
  ],
};
```
正当我满心欢喜地打开运行`npm run start`, 啪, 按下回车, 网页就如同我的大脑一样, 一片空白. 打开`console`.

```
Uncaught Error: Module parse failed: Unexpected token (5:30)
File was processed with these loaders:
 * ./node_modules/ts-loader/index.js
You may need an additional loader to handle the result of these loaders.
| var react_1 = require("react");
| var react_dom_1 = require("react-dom");
> react_dom_1["default"].render(<div>hello webpack</div>, document.getElementById("app"));
| 
    at eval (index.tsx:1)
    at Object../src/index.tsx (main.js:170)
    at __webpack_require__ (main.js:365)
    at main.js:406
    at main.js:409
```

继续google, 哦, 忘了配置`tsconfig.json`. 网上的配置一大堆, 我只需要必须的. 跑起来就行, 不了解的东西我先不碰.
```
{
  "compilerOptions": {
    "jsx": "react",
    "esModuleInterop": true
  }
}
```

解释一下:

esModuleInterop: commonjs没有default这个概念, 所以这个配置为了兼容commonjs

jsx: 在tsx文件中支持jsx

哦耶~

![运行成功](./imgs/success.png)

## 未完待续