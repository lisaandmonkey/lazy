## Lazy.js

这是一个非常小巧的图片懒加载库，未压缩源码只有100行左右，写来用在了自己的一个小项目中，注释很详细，君可随意更改。

> Lazy.js的使用非常简单，只需要按照如下格式即可：

```html
<!--<div class="s-pic-wrapper pic-wrapper">-->
    <img class="img" src="./assets/loading.png" data-lazy="./assets/01.jpg">
    <div class="bg-img" data-lazy-background="./assets/02.jpg"></div>
    <img class="img" src="./assets/loading.png" data-lazy="./assets/03.jpg">
    <div class="bg-img" data-lazy-background="./assets/04.jpg"></div>
    <img class="img" src="./assets/loading.png" data-lazy="./assets/05.jpg">
    <div class="bg-img" data-lazy-background="./assets/06.jpg"></div>
    <img class="img" src="./assets/loading.png" data-lazy="./assets/07.jpg">
    <div class="bg-img" data-lazy-background="./assets/08.jpg"></div>
    <img class="img" src="./assets/loading.png" data-lazy="./assets/09.jpg">
    <div class="bg-img" data-lazy-background="./assets/10.jpg"></div>
    <img class="img" src="./assets/loading.png" data-lazy="./assets/11.jpg">
    <div class="bg-img" data-lazy-background="./assets/12.jpg"></div>
    <img class="img" src="./assets/loading.png" data-lazy="./assets/13.jpg">
    <div class="bg-img" data-lazy-background="./assets/14.jpg"></div>
    <img class="img" src="./assets/loading.png" data-lazy="./assets/15.jpg">
    <div class="bg-img" data-lazy-background="./assets/16.jpg"></div>
    <img class="img" src="./assets/loading.png" data-lazy="./assets/17.jpg">
    <div class="bg-img" data-lazy-background="./assets/18.jpg"></div>
    <img class="img" src="./assets/loading.png" data-lazy="./assets/19.jpg">
    <div class="bg-img" data-lazy-background="./assets/20.jpg"></div>
<!--</div>-->

<script src="lazy.js"></script>
<script>
    Lazy.init({
        // root: '.s-pic-wrapper', // 滚动区域根元素，默认document
        throttle: true,            // 函数防抖
        delay: 200,                // 防抖延时
        unload: false,             // 图片重载
        offset: 200,               // 懒加载距视口距离
        offsetTop: 200,            // 可选，默认offset
        offsetRight: 200,          // 可选，默认offset
        offsetBottom: 200,         // 可选，默认offset
        offsetLeft: 200,           // 可选，默认offset
        // 完成时的回掉函数
        callback: function (element, status) {
            console.log(element, status);
        }
    });
</script>
```

#### 参数说明

> Lazy.init(options)

所有配置参数在懒加载初始化`.init()`函数中接收。

* root: Type `HTMLElement`, Default: `document`

滚动区域根元素

* throttle: Type: `Boolean`, Default: `true`

是否开启函数防抖

* delay: Type `Number`, Default: `150`

防抖函数执行延时时间

* unload: Type: `Boolean`, Default: `false`

懒加载图片是否重载

* offset: Type: `Number`, Default: `0`

此参数用来控制懒加载元素距离视口的距离。

* offsetTop: Type: `Number`, Default: `offset`
   
此参数用来控制懒加载元素距离视口顶部的距离。

* offsetRight: Type: `Number`, Default: `offset`
   
此参数用来控制懒加载元素距离视口右侧的距离。

* offsetBottom: Type: `Number`, Default: `offset`
   
此参数用来控制懒加载元素距离视口底部的距离。

* offsetLeft: Type: `Number`, Default: `offset`
   
此参数用来控制懒加载元素距离视口左侧的距离。

* callback: Type: `Function`, Default: `function(){}`

> Lazy.render()

内部函数，外部不可调用。

> Lazy.destroy()

内部函数，外部不可调用。

#### html配置

请确保html部分按如下格式配置：

```html
<img src="./assets/loading.png" data-lazy="./assets/01.jpg">
<div data-lazy-background=".assets/02.jpg"></div>
```

> 本项目还有一篇对应的[博文](https://github.com/uninge/blog-post/tree/master/lazy)

