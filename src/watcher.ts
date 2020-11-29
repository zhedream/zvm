
import { Observer } from "rxjs";
import { zvmInterface } from "../types/zvmInterface";
import { exprFromData } from "./util";
import { Observe } from "./observe";

export class Watcher implements Observer<any> {
    vm: zvmInterface;
    expr: string;
    cb: CallableFunction;
    oldValue: any; // oldValue , 左右就只有 触发 getter 新增订阅了
    constructor(vm: zvmInterface, expr: string, cb: CallableFunction) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        console.log(`订阅数据: ${expr}`);
        // 依赖收集
        Observe.target = this; // 数据劫持者, 报道. Observe 静态成员
        this.oldValue = exprFromData(expr, this.vm.$data); // 触发 getter 进行订阅 , 对 expr (数据) 进行订阅
        Observe.target = null;

    }

    next(newValue: any) {
        let oldValue = this.oldValue
        if (oldValue !== newValue) {
            this.oldValue = newValue;
            this.cb(newValue, oldValue);
        }
    }
    error() { }
    complete() { }
}