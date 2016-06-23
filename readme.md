# Nice Popup

一款简单的弹出层组件，支持队列式弹出，对读屏软件有较好支持。

[Demo 演示](https://ajccom.github.io/nicePopup)

-----------------------------------------------

## 使用说明

Nice Popup 支持 alert/confirm/dialog 三种弹出层。

#### Alert 弹出层

Alter 弹出层默认拥有一个 “确定” 按钮，点击后关闭。弹出层中的文案（支持 HTML）可以通过 API 指定。

```javascript
nicePopup.alert.open('我是疯儿你是傻')
```

当然，我们也可以为 alter 弹出层指定类型。

```javascript
nicePopup.alert.open('缠缠绵绵到天涯', 'success')
```

此时 alert 弹出层会显示一个 `type-icon` 元素。

<br />

#### Confirm 弹出层

Confirm 弹出层默认拥有两个按钮，“确定” 和 “取消”。点击取消会关闭弹出层，点击确定则执行一个指定的回调函数。

```javascript
nicePopup.confirm.open('你确定要演唱吗？', function (popup) {
  console.log('I will rock you!')
  //关闭弹出层
  popup.close()
})
```

<br />

#### Dialog 弹出层

Dialog 弹出层需要页面上存在对应的 DOM 元素才能使用。为需要的元素添加类 `nice-popup` ：

```HTML
<div id="popupEntity" class="nice-popup">弹出层展示内容</div>
```

在 Nice Popup 初始化后，就可以通过两种方式弹出 dialog。

```javascript
//首先进行初始化
nicePopup.init()

//第一种方式，通过 selector 字符串弹出 dialog
nicePopup.dialog.open('#popupEntity')

//第二种方式，通过 DOMElement 对象弹出 dialog
nicePopup.dialog.open(document.getElementById('popupEntity'))
``` 

<br />

## 配置说明

参数 | 默认值 | 说明
---- | ---- | ----
autoClose | false | 是否自动关闭，可以填写自动关闭的延时毫秒数
effect | 'popin' | 弹出层显示/隐藏效果
modal | true | 是否是模态框，模态框会有一个遮罩层显示
closeable | true | 是否显示关闭按钮

Alert, confirm 弹出层遵循以上配置。Dialog 弹出层可以通过 `nicePoup.dialog.open` 方法动态指定该弹出层实例的配置。

<br />

#### 修改配置

Nice Popup 提供修改默认配置方法。

```javascript
nicePoup.config({
  closeable: false
})
```

通过 `nicePoup.config` 方法修改的配置将会成为新的默认配置

<br />

## API 说明

### nicePoup

非模块化加载时，Nice Popup 的命名空间是 `nicePoup`。

属性/方法 | 参数 | 说明
---- | ---- | ----
alert | - | 属性，alert 弹出层
confirm | - | 属性，confirm 弹出层
dialog | - | 属性，dialog 弹出层
config | Config:Object | 方法，修改默认配置
close | - | 方法，关闭当前一个弹出层
init | - | 方法，初始化弹出层

<br />

#### alert 属性

Alert 属性下面包含 alert 弹出层相关 API。

属性/方法 | 参数 | 说明
---- | ---- | ----
open | Text:String[, Type:String] | 弹出一个 alert 弹出层

**注意 alert 并没有 `close` 方法，可以使用 `nicePoup.close` 方法关闭。**

`open` 方法的第二个参数 Type 可以为空。而除了 `success/fail/wraning/wrong` 四种状态之外，用户可以使用任意字符串作为参数，产生更多的状态，但需要在 CSS 中配置对应样式。

<br />

#### confirm 属性

Confirm 属性下面包含 confirm 弹出层相关 API。Confirm 与 alert 不同之处在于它拥有两个按钮，“确定” 与 “取消”。而当用户点击 “确定” 时则会执行用户指定的方法。

属性/方法 | 参数 | 说明
---- | ---- | ----
open | Text:String[, Fn:Function] | 弹出一个 confirm 弹出层

**注意 confirm 也没有 `close` 方法。但是在 Fn 函数中会传入一个拥有 `close` 方法的弹出层对象，它是一个 Popup 类的实例。**

<br />

#### dialog 属性

Dialog 与 alert 和 confirm 不太相同。没有过多的默认样式，只能调用已存在的拥有 `nice-popup` 类的元素。

属性/方法 | 参数 | 说明
---- | ---- | ----
open | Selector:String|DOMElement:Object[, Config:Object] | 指定一个元素作为 dialog 内容弹出
close | - | 关闭当前一个弹出层

**Dialog 的 `close` 的作用等同于 `nicePopup.close`。**

当 nicePopup 初始化的时候会寻找此时文档中所有拥有 `nice-popup` 类的元素并为其一一生成对应的 Popup 实例。

<br />

## 自定义弹出动画

如果不需要动画，可以设置默认参数中的 `effect` 为空。

```javascript
nicePopup.config({
  effect: ''
})
```

如果需要更换弹出动画，可以指定一个其他的 `effect` 之后配置 CSS，比如：

```javascript
nicePopup.config({
  effect: 'fade'
})
```

```CSS
.nice-popup.fade {
  animation-name: fadeIn;
  opacity: 1; top: 50%
}
.nice-popup.fade.reverse {
  animation-name: fadeOut;
  opacity: 0; top: -200%
}
@keyframes fadein {
  0% {top: 0px; opacity: 0;}
  100% {top: 0px; opacity: 1;}
}
@keyframes fadeout {
  0% {top: 0px; opacity: 1;}
  99% {top: 0px; opacity: 0;}
  100% {top: -5000px; opacity: 0;}
}
```

### 居中的实现

居中实现使用了 `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)`。

所以当你处理样式的时候，需要对此谨慎。

<br />

## Thanks

<br />















