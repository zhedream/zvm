
import { zvmInterface } from '../types/zvmInterface'
import { fromEvent } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { exprFromData, exprToData } from './util'
import { Watcher } from './watcher'

export class Compile {
    el: HTMLElement
    vm: zvmInterface
    constructor(el: HTMLElement, vm: zvmInterface) {
        this.el = el
        this.vm = vm
        // 1. dom 到 内存
        let fragment = this.node2fragment(this.el)
        // 2. 编译解析
        console.log('=====编译解析(节点订阅数据) Start');
        this.compile(fragment);
        console.log('=====编译解析(节点订阅数据) End');
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

        fragment.append(...Array.from(element.childNodes)); // 不需要递归.
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
            if (this.isTextNode(node)) this.comlileText(node as HTMLElement); // 文本节点
            if (this.isElementNode(node)) this.compileEmement(node as HTMLElement); // 标签节点
            if (node.childNodes && node.childNodes.length > 0) this.compile(node); // 递归
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
            console.log('文本节点:', node);
            let expr = RegExp.$1
            let val = exprFromData(expr, this.vm.$data); // 广播数据
            node.textContent = text.replace(reg, val)
            new Watcher(this.vm, expr, (newValue: any, oldValue: any) => {
                console.log(node, `${expr}: 有新的消息 `);
                node.textContent = newValue
            })
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
            let attrName = attr.name;
            // 判断指令
            if (this.isDirective(attrName)) {
                let type = attrName.slice(2) // 如: v-on:click, v-text
                let attrValue = attr.value
                if (this.isEventDirective(type)) {
                    // 事件指令
                    let eventType = type.split(':')[1];
                    CompileUtil.handleEnevt(node, this.vm, eventType, attrValue);
                } else if (type == 'for') {
                    (CompileUtil as any)[type].call(this, node, this.vm, attrValue)
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
    // v-text
    text(node: HTMLElement, vm: zvmInterface, expr: string) {
        console.log(`text指令`, node);
        node.textContent = exprFromData(expr, vm.$data);
        new Watcher(vm, expr, (newValue: any, oldValue: any) => {
            console.log(node, `${expr}: 有新的消息 `);
            node.textContent = newValue
        })
    },
    // v-html
    html(node: HTMLElement, vm: zvmInterface, expr: string) {
        console.log(`html指令`, node);
        node.innerHTML = exprFromData(expr, vm.$data);
        new Watcher(vm, expr, (newValue: any, oldValue: any) => {
            console.log(node, `${expr}: 有新的消息 `);
            node.innerHTML = newValue;
        })
    },
    ['for'](node: HTMLElement, vm: zvmInterface, expr: string) {
        // debugger

        node.removeAttribute('v-for'); // 死循环
        let n = node.cloneNode(true) as HTMLElement;
        n.setAttribute('id', '123');
        (this as any).compile(n);
        node.after(n);
        (this as any).compile(node); // 编译本身
    },
    /**
     * v-model
     * @param node 
     * @param vm 
     * @param expr 
     */
    model(node: HTMLElement, vm: zvmInterface, expr: string) {
        (node as HTMLInputElement).value = exprFromData(expr, vm.$data);
        console.log(`model指令`, node);
        fromEvent(node, 'input').pipe(
            debounceTime(100)
        ).subscribe(e => {
            let value = (e.target as HTMLInputElement).value
            exprToData(expr, value, vm.$data)
        })
        new Watcher(vm, expr, (newValue: any, oldValue: any) => {
            console.log(node, `${expr}: 有新的消息 `);
            (node as HTMLInputElement).value = newValue;
        })
    },
    /**
     * 
     * @param node 节点
     * @param vm 实例
     * @param eventType 事件类新
     * @param expr 属性 表达式
     */
    handleEnevt(node: HTMLElement, vm: zvmInterface, eventType: string, expr: string) {

        expr = expr.trim();
        let pattern1 = /^([a-zA-Z\$_][a-zA-Z\d_]*)(\(.+\))?$/, // 合法函数 fn   fn(12,3)
            str = expr;
        const [flag, fnName, paramsStr] = [pattern1.test(str), RegExp.$1, RegExp.$2];
        if (!flag) throw new Error(`Invalid pattern ${expr}`);
        let pattern2 = /^\((.+)\)$/;

        let params = [] as any[];
        if (paramsStr) {
            console.log('有参数');

            const [flag1, paramsStr1] = [pattern2.test(paramsStr), RegExp.$1];
            if (!flag1) throw new Error(`Invalid pattern params ${paramsStr}`);
            params = paramsStr1.split(',').map(e => {
                e = e.trim();
                var 合法变量 = /^[a-zA-Z\$_][a-zA-Z\d_]*$/;
                var 合法数值 = /^(-?\d+)(\.\d+)?$/;
                var 字符串1 = /^\'(.+)\'$/;
                var 字符串2 = /^\"(.+)\"$/;
                var 表达式 = /\s/; // 存在空格 可能是表达式
                if (字符串1.test(e) || 字符串2.test(e)) return RegExp.$1;
                if (合法变量.test(e)) return exprFromData(e, vm.$data);
                if (合法数值.test(e)) return e;
            })
            console.log(params);
        }

        if (vm.$methods && vm.$methods.hasOwnProperty(fnName) === true) {
            console.log(`on指令`, node);
            fromEvent(node, eventType).subscribe(vm.$methods[fnName].bind(vm, ...params))
        } else console.error(`不存在 ${expr} 方法`, node);
    }

}