// types
import { zvmInterface } from '../types/zvmInterface'
// lib
import { Compile } from "./compile";
import { Observe } from "./observe";

export class Zvm implements zvmInterface {
    $options: Options;
    $el: HTMLElement | null;
    $data: Object | CallableFunction | undefined;
    $methods: Object | undefined;
    $observe: Observe;
    constructor(options: Options) {
        this.$options = options;
        this.$methods = options.methods;

        if (typeof options.data === 'function') {
            this.$data = options.data();
        } else this.$data = options.data;

        if (typeof options.el === 'string')
            this.$el = document.querySelector(options.el)
        else this.$el = options.el;

        this.$observe = new Observe(this.$data); // 劫持数据
        new Compile(this.$el as HTMLElement, this); // 编译 dom

        this.$proxyData(); // 代理数据
        this.$proxyMethods(); // 代理方法
    }

    $proxyData() {
        let data = this.$data as Object;
        Object.keys(data).forEach(key => {
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

    $set(obj: any, key: any, val: any) {
        this.$observe.defineReactive(obj, key, val);
    }

}