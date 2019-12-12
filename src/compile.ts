
import { zvmInterface } from '../types/zvmInterface'
import { fromEvent } from 'rxjs'
import { types } from 'util'

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
        let text = node.textContent as string;
        let reg = /\{\{(.+)\}\}/;
        if (reg.test(text) === true) {
            let expr = RegExp.$1
            node.textContent = text.replace(reg, (this.vm.$data as any)[expr])
        }

    }
    /**
     * 处理元素/标签节点
     * @param node
     */
    compileEmement(node: HTMLElement) {
        // console.log('元素节点', node);
        node.childNodes
        let attributes = node.attributes;
        // 判断 属性中的指令
        Array.from(attributes).forEach(attr => {
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                let type = attrName.slice(2) // 如: v-on:click
                let attrValue = attr.value
                if (this.isEventDirective(type)) {
                    let eventType = type.split(':')[1];
                    CompileUtil.handleEnevt(node, this.vm, eventType, attrValue);
                } else {
                    if (CompileUtil.hasOwnProperty(type) === true)
                        (CompileUtil as any)[type](node, this.vm, attrValue)
                    else console.error(`不存在 v-${type} 指令`, node);
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
    /**
     * 是否 指令 v-
     * @param attrName 
     */
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

/**
 * 编译的方法
 */
const CompileUtil = {
    text(node: HTMLElement, vm: zvmInterface, expr: string) {
        node.textContent = vm.$data[expr];
    },
    html(node: HTMLElement, vm: zvmInterface, expr: string) {
        node.innerHTML = vm.$data[expr];
    },
    model(node: HTMLElement, vm: zvmInterface, expr: string) {
        (node as HTMLInputElement).value = vm.$data[expr];
    },
    handleEnevt(node: HTMLElement, vm: zvmInterface, eventType: string, expr: string) {
        if (vm.$methods && vm.$methods.hasOwnProperty(expr) === true)
            fromEvent(node, eventType).subscribe(vm.$methods[expr].bind(vm))
        else console.error(`不存在 ${expr} 方法`, node);
    }

}