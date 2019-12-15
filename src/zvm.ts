// types
import { zvmInterface } from '../types/zvmInterface'
// lib
import { Compile } from "./compile";
import { Observe } from "./observe";

export class Zvm implements zvmInterface {
    $options: Options;
    $el: HTMLElement | null;
    $data: Object | undefined;
    $methods: Object | undefined;
    constructor(options: Options) {
        this.$options = options;
        this.$data = options.data
        this.$methods = options.methods
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
        new Observe(this.$data); // 劫持数据
        new Compile(this.$el as HTMLElement, this); // 编译 dom

        this.$proxyData(); // 代理数据
        this.$proxyMethods(); // 代理方法
    }

    $proxyData() {
        let data = this.$data;
        Object.keys(data as Object).forEach(key => {
            Object.defineProperty(this, key, {
                get: function () {
                    return this.$data[key]
                },
                set: function (newValue) {
                    console.info(`data ${key} 变更为 ${newValue}`);
                    this.$data[key] = newValue;
                }
            })
        })
    }

    $proxyMethods() {
        let data = this.$methods;
        Object.keys(data as Object).forEach(key => {
            Object.defineProperty(this, key, {
                get: function () {
                    return this.$methods[key].bind(this)
                },
                set: function (newFn) {
                    console.warn(`methods ${key} 被修改 `);
                    this.$methods[key] = newFn.bind(this);
                }
            })
        })
    }

}