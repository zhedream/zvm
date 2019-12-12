
import { zvmInterface } from '../types/zvmInterface'
import { fromEvent } from 'rxjs'

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
        this.el.appendChild(fragment);
    }
    /**
     * 将 dom 放内存中 , 转成 DocumentFragment
     * @param node HTMLElement
     */
    node2fragment(element: HTMLElement) {
        let fragment = document.createDocumentFragment();
        // console.log(element.childNodes);

        fragment.append(...Array.from(element.childNodes))
        // element.childNodes.forEach(node => fragment.appendChild(node)) // 有什么区别 , childNodes 伪数组
        // Array.from(element.childNodes).forEach(node => fragment.appendChild(node))
        return fragment;
    }
    /**
     * 编译 dom
     * @param fragment DocumentFragment
     */
    compile(fragment: DocumentFragment | ChildNode) {
        let childNodes = fragment.childNodes;
        Array.from(childNodes).forEach((node) => {
            if (this.isTextNode(node)) this.comlileText(node as HTMLElement)
            if (this.isElementNode(node)) this.compileEmement(node as HTMLElement)
            if (node.childNodes && node.childNodes.length > 0) this.compile(node)
        })
    }
    /**
     * 处理文本节点
     * @param node 
     */
    comlileText(node: HTMLElement) {
        // console.log('文本节点', node);
    }
    /**
     * 处理元素节点
     * @param node
     */
    compileEmement(node: HTMLElement) {
        // console.log('元素节点', node);
        node.childNodes
        let attributes = node.attributes;
        Array.from(attributes).forEach(attr => {
            let attrName = attr.name
            if (this.isDirective(attr.name)) {
                let type = attrName.slice(2)
                let attrValue = attr.value
                if (type === 'text') {
                    node.textContent = this.vm.$data[attrValue];
                }
                if (type === 'html') {
                    node.innerHTML = this.vm.$data[attrValue];
                }
                if (type === 'model') {
                    (node as HTMLInputElement).value = this.vm.$data[attrValue];
                }

                if (this.isEventDirective(type)) {
                    let eventType = type.split(':')[1];
                    fromEvent(node, eventType).subscribe(this.vm.$methods[attrValue].bind(this.vm))

                }
            }

        })

    }
    /**
     * 是否 元素节点
     * @param node
     */
    isElementNode(node: ChildNode) {
        return node.nodeType === 1
    }
    /**
     * 是否 文本节点
     * @param node
     */
    isTextNode(node: ChildNode) {
        return node.nodeType === 3
    }

    isDirective(attrName: string) {
        return attrName.startsWith('v-')
    }
    /**
     * 是否 事件指令(部分) on:click <= v-on:click 
     * @param type 
     */
    isEventDirective(type: string) {
        return type.split(':')[0] === 'on'
    }

}