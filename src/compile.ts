
import { zvmInterface } from '../types/zvmInterface'

export class Compile {
    el: HTMLElement
    vm: zvmInterface
    constructor(el: HTMLElement, vm: zvmInterface) {
        this.el = el
        this.vm = vm
        // 1. dom 到 内存
        let fragment = this.node2fragment(this.el)
        // 2. 编译解析
        this.compile(fragment);
        // 3. 放回 dom 
        // this.el.appendChild(fragment);
    }

    node2fragment(node: HTMLElement) {
        DocumentFragment
        let fragment = document.createDocumentFragment();
        this.toArray(node.childNodes).forEach(node => {
            fragment.appendChild(node)
        })
        return fragment;
    }

    compile(fragment: DocumentFragment) {
        let childNodes = fragment.childNodes;
        this.toArray(childNodes).forEach((node:ChildNode) => {
            console.log(node);
            
        })

    }

    toArray(linkArr: any) {
        return [].slice.call(linkArr)
    }
}