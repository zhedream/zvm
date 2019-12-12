// types
import { zvmInterface } from '../types/zvmInterface'
// lib
import { Compile } from "./compile";

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
        new Compile(this.$el as HTMLElement, this);
        // console.log((this.$el as HTMLElement).childNodes);
    }

}