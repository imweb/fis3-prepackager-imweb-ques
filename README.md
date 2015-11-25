# fis3-prepackager-imweb-ques

fis3 prepackager plugin for q components of imweb team

# 标识Ques页面

```js
fis.match('pages/**main.html', {
    isQPage: true
})
```
or

```html
<!DOCTYPE html>
<!--isQPage-->
<html lang="en">
<head></head>
<body></body>
</html>
```

# 处理过程

- components/*.{css,js,scss}

只替换`holder`成模块名

- 入口文件 pages/main.html
    - 添加components css/js依赖
    - 展开components 
    - 添加components 信息(之前ques不需要，但它需要在components js文件里注册组件，为了简化对components js的处理, 将注册组件统一移至Q.factory中，因此添加组件信息)

输入:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <link rel="stylesheet" href="/pages/start/main.css">
</head>
<body>
    <chead></chead>
    <script src="/libs/mod.js"></script>
    <script src="/libs/jquery.min.js"></script>
    <script>
        require('libs/Q.factory')();
    </script>
</body>
</html>
```

输出:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <link rel="stylesheet" href="/pages/start/main.css">
</head>
<body>
    <!-- 展开components -->
    <div q-text="text" class="component-1"></div>
    <script src="/libs/mod.js"></script>
    <script src="/libs/jquery.min.js"></script>
    <!-- components 信息 -->
    <script>var _components = {"chead":{"js":"components/chead/main","child":1,"uid":1}};</script>
    <script>
        require('libs/Q.factory')();
    </script>
</body>
</html>
```

```js
// 添加components css依赖
file.addRequire('/components/chead/main.css');
// 添加components js依赖
file.addRequire('/components/chead/main.js');
```

# 依赖 

- commonJs (包裹js成AMD)

# 配置

- `holder`: `/___|\$__/g` 占位符
- `components`: `['/components', getComp]` 组件路径

```js
function getComp(name, ret) {
    return {
        name: name,
        html: html.getContent(),
        htmlFile: html,
        js: js && js.getContent() || null,
        jsFile: js || null,
        css: css && css.getContent() || null,
        cssFile: css || null
    }
}
```

# 问题

- components是否支持与scss集成
    - 支持, component的样式文件按main.css, main.scss, main.less的顺序查找
    - 使用main.scss main.less时占位符`holder`请勿使用`$__`, `$`对scss会报错, 可以使用3个下划线`___`
- 如何使用查找到lego下的component
    - 配置components中传入查找函数，想怎么找就怎么找

