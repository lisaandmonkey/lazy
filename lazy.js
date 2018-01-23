/**
 * Author: SunJingKe
 * Email: uninge@qq.com
 * Date: 2018.01.18
 * Time: 16:24
 */

(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory(global)
    } else if (typeof define === 'function' && define.amd) {
        define(factory)
    } else {
        global.Lazy = factory(global)
    }
})(this, function (global) {
    // 全局变量，所有方法在此对象上扩展
    var Lazy = {};
    // 计时器
    var timer = null;
    // 防抖延迟时间
    var delay = 150;
    // 是否开启防抖
    var throttle = true;
    // 是否开启图片懒加载图片的重载。解释一下：就是图片离开懒加载区域要把图片状态复原，再次进入懒加载区域要在视觉上呈现懒加载效果
    // 先呵呵一下这个功能，正常的我肯定想不到这么个抽风的需求，谁让我曾经碰到过一个抽风的产品经理呢，实现不难，这里也顺便实现一下
    var unload = false;
    // 回掉函数
    var callback = function () {};
    // 元素相对于视窗的位置集合
    var boxRect = {};
    /**
     * 判断目标元素是否可见
     * https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/offsetParent
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    var isHidden = function (element) {
        return element.offsetParent === null;
    };
    /**
     * 判断目标元素是否进入懒加载区域
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    var canLoadImg = function (element) {
        if (isHidden(element)) return false;
        var eleRect = element.getBoundingClientRect();
        return (eleRect.top <= boxRect.b && eleRect.right >= boxRect.l && eleRect.bottom >= boxRect.t && eleRect.left <= boxRect.r);
    };
    /**
     * 防抖函数
     */
    var onThrottleRender = function () {
        if (!throttle) {
            Lazy.render();
        } else {
            clearTimeout(timer);
            timer = setTimeout(function () {
                Lazy.render();
                timer = null;
            }, delay);
        }
    };

    /**
     * 始化方法，外部直接调用，配置参数在此接收
     * @param {Object} options
     * @param {String} options.root - 图片滚动区域根元素选择器
     * @param {Number} options.offset - 懒加载阈值，当没有上下左右有4个值时将以此为准
     * @param {Number} options.offsetTop - 懒加载阈值【上】
     * @param {Number} options.offsetRight - 懒加载阈值【右】
     * @param {Number} options.offsetBottom - 懒加载阈值【下】
     * @param {Number} options.offsetLeft - 懒加载阈值【左】
     * @param {Boolean} options.throttle - 是否开启函数防抖
     * @param {Number} options.delay - 函数防抖时间阈值
     * @param {Boolean} options.unload - 图片重载
     * @param {Function} options.callback - 懒加载操作完成时的回掉函数
     */
    Lazy.init = function (options) {
        options = options || {};
        global = document.querySelector(options.root) || global;
        throttle = options.throttle !== false;
        delay = options.delay || delay;
        unload = options.unload || unload;
        callback = options.callback || callback;
        // 懒加载区域，写的虽然有点长但是不难理解
        boxRect = {
            t: 0 - (options.offsetTop || options.offset || 0),
            r: (global.innerWidth || document.documentElement.clientWidth) + (options.offsetRight || options.offset || 0),
            b: (global.innerHeight || document.documentElement.clientHeight) + (options.offsetBottom || options.offset || 0),
            l: 0 - (options.offsetLeft || options.offset || 0)
        };
        // 这里提前调用一次，因为如果throttle为true，load之后会有最低250ms的延迟
        Lazy.render();
        // 绑定事件
        if (global.addEventListener) {
            global.addEventListener('load', onThrottleRender, false);
            global.addEventListener('scroll', onThrottleRender, false);
        } else {
            global.attachEvent('onload', onThrottleRender);
            global.attachEvent('onscroll', onThrottleRender);
        }
    };
    /**
     * 懒加载实现
     * @param {HTMLElement} element
     */
    Lazy.render = function (element) {
        var nodes = (element || document).querySelectorAll('[data-lazy], [data-lazy-background]');
        var len = nodes.length;
        for (var i = 0; i < len; i++) {
            var node = nodes[i];
            // 目标元素在懒加载区域和不在懒加载区域
            if (canLoadImg(node)) {
                // 懒加载图片需要重载
                if (unload && node.src && !node.getAttribute('data-lazy-placeholder')) {
                    node.setAttribute('data-lazy-placeholder', node.src);
                }
                // 图片的懒加载
                var src = node.getAttribute('data-lazy');
                if (src !== null && node.src !== src) {
                    node.src = src;
                }
                // 背景的懒加载
                var bgUrl = node.getAttribute('data-lazy-background');
                if (bgUrl !== null && node.style.backgroundImage !== bgUrl) {
                    node.style.backgroundImage = 'url(' + bgUrl + ')';
                }
                // 如果图片不需要重载，懒加载完成移除data-lazy属性
                if (!unload) {
                    node.removeAttribute('data-lazy');
                }
                // 懒加载完成移除data-lazy-background
                node.removeAttribute('data-lazy-background');
                // 懒加载完成触发回掉
                callback(node, 'load');
            } else {
                // 当图片不在懒加载区域时做重载处理
                var placeholder = node.getAttribute('data-lazy-placeholder');
                if (unload && placeholder !== null) {
                    node.src = placeholder;
                    node.removeAttribute('data-lazy-placeholder');
                    // 重载完成触发回掉
                    callback(node, 'unload');
                }
            }
        }
        // 如果没有懒加载的元素，销毁Lazy.init添加的事件
        if (len === 0) {
            Lazy.destroy();
        }
    };
    /**
     * 不满足懒加载条件时移除绑定的事件，重置定时器引用
     */
    Lazy.destroy = function () {
        if (document.removeEventListener) {
            global.removeEventListener('scroll', onThrottleRender);
        } else {
            global.detachEvent('onscroll', onThrottleRender);
        }
        clearTimeout(timer);
    };
    return Lazy;
});