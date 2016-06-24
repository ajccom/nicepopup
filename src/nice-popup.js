'use strict'
;(function () {
  var queue = [],
    entities = []
  
  /**
   * 兼容PC与移动端事件
   */
  var _mobileCheck = 'ontouchend' in document,
    _pointCheck = window.PointerEvent || window.MSPointerEvent,
    _prefixPointerEvent = function (pointerEvent) {
      return window.MSPointerEvent ? 
        'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10) : pointerEvent
    },
    ev = {
      click: 'click',
      start: _mobileCheck ? (_pointCheck ? _prefixPointerEvent('pointerdown') : 'touchstart' ) : 'click'
    }
  
  /**
   * _addClass 添加类，辅助函数
   * @param {DOMElement}
   * @param {String}
   */
  function _addClass (element, klass) {
    if (!_hasClass(element, klass)) {
      element.className += ' ' + klass
    }
  }
  
  /**
   * _removeClass 删除类，辅助函数
   * @param {DOMElement}
   * @param {String}
   */
  function _removeClass (element, klass) {
    var arr = klass.split(' '), reg = null
    arr.map(function (klass) {
      reg = new RegExp('(\s*|^)' + klass + '(\s*|$)', 'g')
      element.className = element.className.replace(reg, ' ')
    })
  }
  
  /**
   * _hasClass 判断是否含有指定类，辅助函数
   * @param {DOMElement}
   * @param {String}
   */
  function _hasClass (element, klass) {
    return element.className.indexOf(klass) > -1
  }
  
  /**
   * _extend 扩展对象，辅助函数
   * @return {Object} 扩展后的原始对象
   */
  function _extend () {
    var item = '',
      origin = arguments[0],
      extraArr = Array.prototype.slice.call(arguments, 1)
    extraArr.map(function (extra, i) {
      for (item in extra) {
        origin[item] = extra[item]
      }
    })
    
    return origin
  }
  
  /**
   * _map 遍历对象，辅助函数
   * @param {Object} arr 类数组对象
   * @param {Function} fn 每遍历一个元素的执行函数
   */
  function _map (arr, fn) {
    if (!fn) {return}
    Array.prototype.map.call(arr, function (o) {
      fn(o)
    })
  }
  
  ////////////////////mask start////////////////
  /**
   * mask 遮罩层
   * @type {Object}
   */
  var mask = (function () {
    var dom = document.createElement('div'),
      isReady = false,
      currentEffect = ''
    
    /**
     * open 显示遮罩层
     * @type {Function}
     * @param {String} 
     */
    function open () {
      if (!isReady) {
        isReady = true
        _addClass(dom, 'nice-mask')
        document.body.appendChild(dom)
        mask.close = close
        dom.addEventListener(ev.start, function () {
          queue[0].close()
        })
      }
      setTimeout(function () {
        _addClass(dom, 'show')
        _removeClass(dom, 'reverse')
      }, 0)
    }
    
    /**
     * close 关闭遮罩层
     * @type {Function}
     */
    function close () {
      if (!isReady) {return}
      _addClass(dom, 'reverse')
    }
    
    return {
      open: open
    }
  }())
  ////////////////////mask end//////////////////
  
  /**
   * defaultConfig 默认配置对象
   * @type {Object}
   */
  var defaultConfig = {
    autoClose: false,
    effect: 'popin',
    modal: true,
    closeable: true
  }
  ////////////////////Popup start/////////////////////
  /**
   * Popup 类
   * @type {Class}
   */
  function Popup (dom) {
    var wrapper = document.createElement('div'),
      that = this
    wrapper.className = 'nice-popup popup-ready'
    wrapper.innerHTML = '<a href="javascript:" class="popup-close">close</a>'
    
    this.closeFn = function () {
      that.close()
    }
    wrapper.querySelector('.popup-close').addEventListener(ev.start, this.closeFn)
    
    wrapper.appendChild(dom)
    _removeClass(dom, 'nice-popup')
    document.body.appendChild(wrapper)
    this.wrapper = wrapper
    this.dom = dom
    entities.push(this)
  }
  
  Popup.prototype = {
    open: function (args) {
      var cfg = this.cfg || defaultConfig,
        that = this
      
      if (args) {this.cfg = cfg = _extend({}, cfg, args)}
      queue[0] && queue[0].close(true)
      queue.unshift(this)
      //处理模态框
      if (cfg.modal) {
        mask.open()
      }
      
      //处理自动关闭
      if (cfg.autoClose > 0) {
        this.closeTimer = setTimeout(function () {
          that.close()
        }, cfg.autoClose)
      }
      
      //处理 effect
      //先移除 effect
      this.wrapper.className = 'nice-popup popup-ready'
      if (cfg.effect) {
        _addClass(this.wrapper, cfg.effect)
      } else {
        _addClass(this.wrapper, 'open')
      }
      _removeClass(this.wrapper, 'reverse')
      
      //处理关闭按钮的状态
      if (cfg.closeable === false) {
        this.wrapper.querySelector('.popup-close').style.display = 'none'
      } else {
        this.wrapper.querySelector('.popup-close').style.display = 'block'
      }
      
      //尝试聚焦
      var okBtn = this.dom.querySelector('.ok')
      okBtn && okBtn.focus()
    },
    close: function (isSave) {
      var cfg = this.cfg || defaultConfig
      if (cfg.modal) {
        mask.close && mask.close()
      }
      
      if (cfg.effect) {
        _addClass(this.wrapper, 'reverse')
      } else {
        _removeClass(this.wrapper, 'open')
      }
      
      //取消聚焦
      var okBtn = this.dom.querySelector('.ok')
      okBtn && okBtn.blur()
      
      if (!isSave) {
        queue.shift(this)
        //如果 `queue` 中尚有 popup，弹出第一个
        if (queue.length > 0) {
          //popup 的 open 方法会将 popup 实例加入 queue，所以这里使用 shift 剔除队列中第一个 popup，防止重复添加
          queue.shift().open()
        }
      }
    }
  }
  ////////////////////Popup end///////////////////////
  
  /**
   * 提供一个函数，方便通过 dom 对象查找对应 popup 对象
   */
  function getPopup (dom) {
    var i = 0,
      l = entities.length,
      temp = null,
      result = {}
    for (; i < l; i++) {
      temp = entities[i]
      if (temp && temp.dom === dom) {
        result = temp
        break
      }
    }
    return result
  }
  
  /**
   * init 初始化弹出层
   * @type {Function}
   */
  function init () {
    var popupList = document.querySelectorAll('.nice-popup')
    _map(popupList, function (o) {
      new Popup(o)
    })
  }
  
  /**
   * config 配置默认参数
   * @type {Function}
   * @param {Object}
   */
  function config (args) {
    _extend(defaultConfig, args)
  }
  
  //////////////alert start////////////////
  var alert = (function () {
    
    /**
     * open 打开弹出层
     * @type {Function}
     * @param {String} txt alert 弹出层提示语
     * @param {String} type alert 弹出层类型（成功、失败、警告、错误）
     */
    function open (txt, type) {
      var dom = document.createElement('div'),
        alertPopup = null
      dom.innerHTML = '<span class="type-icon"></span><span class="txt">' + txt + '</span><div class="popup-btns"><a href="javascript:" class="ok">确定</a></div>'
      _addClass(dom, 'alert-content')
      alertPopup = new Popup(dom)
      alertPopup.txtContent = alertPopup.dom.querySelector('.txt')
      
      //改写 popup 的关闭方法
      alertPopup.close = close
      
      alertPopup.okFn = function () {
        alertPopup.close()
      }
      dom.querySelector('.ok').addEventListener(ev.start, alertPopup.okFn)
      dom.className = 'alert-content'
      _addClass(dom, type || '')
      txt && (alertPopup.txtContent.innerHTML = txt)
      alertPopup.open()
      
      /**
       * close 关闭弹出层
       * @type {Function}
       * @param {Boolean} 确定是否需要保留在 queue 中
       */
      function close (isSave) {
        Popup.prototype.close.call(alertPopup, isSave)
        
        //销毁已关闭 alert 对象
        if (!isSave) {
          setTimeout(function () {
            destroy(alertPopup)
          }, 3000)
        }
      }
    }
    
    return {
      open: open
    }
  }())
  //////////////alert end//////////////////
  
  //////////////confirm start//////////////
  var confirm = (function () {  
  
    /**
     * open 打开弹出层
     * @type {Function}
     * @param {String} txt confirm 弹出层提示语
     * @param {String} fn confirm 弹出层通过后的回调函数
     */
    function open (txt, fn) {
      var confirmPopup = null,
        dom = null
      dom = document.createElement('div')
      dom.innerHTML = '<div class="confirm-tip">' + txt + '</div><div class="popup-btns"><a href="javascript:" class="ok">确定</a><a href="javascript:" class="cancel">取消</a></div>'
      _addClass(dom, 'confirm-content')
      confirmPopup = new Popup(dom)
      confirmPopup.txtContent = confirmPopup.dom.querySelector('.confirm-tip')
      
      //改写 popup 的关闭方法
      confirmPopup.close = close
      confirmPopup.okFn = function () {
        fn && fn(confirmPopup)
      }
      confirmPopup.cancelFn = function () {
        confirmPopup.close()
      }
      dom.querySelector('.ok').addEventListener(ev.start, confirmPopup.okFn)
      
      dom.querySelector('.cancel').addEventListener(ev.start, confirmPopup.cancelFn)
      txt && (confirmPopup.txtContent.innerHTML = txt)
      confirmPopup.open()
      
      /**
       * close 关闭弹出层
       * @type {Function}
       * @param {Boolean} 确定是否需要保留在 queue 中
       */
      function close (isSave) {
        Popup.prototype.close.call(confirmPopup, isSave)
        
        //销毁已关闭 alert 对象
        if (!isSave) {
          setTimeout(function () {
            destroy(confirmPopup)
          }, 3000)
        }
      }
    }
    
    return {
      open: open
    }
  }())
  //////////////confirm end////////////////
  
  /**
   * destroy 销毁 popup 对象，只有 alert、confirm 需要使用
   * @type {Function}
   * @param {Object} popup 对象
   */
  function destroy (popup) {
    if (!popup) {return}
    
    var ok = popup.dom.querySelector('.ok'),
      cancel = popup.dom.querySelector('.cancel'),
      close = popup.dom.querySelector('.popup-close')
    ok && ok.removeEventListener(ev.start, popup.okFn)
    cancel && cancel.removeEventListener(ev.start, popup.cancelFn)
    close && close.removeEventListener(ev.start, popup.closeFn)
    
    document.body.removeChild(popup.wrapper)
    
    var item = ''
    for (item in popup) {
      delete popup[item]
    }
    
  }
  
  //////////////dialog start///////////////
  var dialog = (function () {
    /**
     * open 打开弹出层
     * @type {Function}
     * @param {String|DOMElement}
     * @param {Object}
     */
    function open (klass, args) {
      var dom = typeof klass === 'string' ? document.querySelector(klass) : (typeof klass === 'object' ? klass : null),
        cfg = _extend({}, defaultConfig, args)
      if (dom) {
        getPopup(dom).open(cfg)
      }
    }
    
    return {
      open: open,
      close: close
    }
  }())
  //////////////dialog end/////////////////
  
  /**
   * close 关闭弹出层
   * @type {Function}
   */
  function close () {
    queue[0] && queue[0].close()
  }
  
  /**
   * closeAll 关闭所有弹出层
   * @type {Function}
   */
  function closeAll () {
    queue = queue.slice(0, 1)
    queue[0] && queue[0].close()
  }
  
  var nicePopup = {
    alert: alert,
    confirm: confirm,
    dialog: dialog,
    init: init,
    close: close,
    closeAll: closeAll,
    config: config
  }
  
  if(typeof define === 'function' && define.amd) {
		define([], function () {
			return nicePopup
		})
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = nicePopup
	} else {
		window.nicePopup = nicePopup
	}
}())