
import { Observer, Subject } from "rxjs";

export class Observe {
    data: any;
    static count = 1;
    static target: Observer<any> | null;
    constructor(data: any) {
        this.data = data;
        this.walk(data);
    }

    walk(data: any) {
        if (!data || typeof data != 'object')
            return
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key]); // 劫持
            this.walk(data[key]); // 递归
        })
    }

    /**
     * 劫持数据 
     * @param obj 数据
     * @param key 键值
     * @param value 
     */
    defineReactive(obj: any, key: string, value: any) {

        let that = this;
        let Ob = new Subject<any>()
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                if (Observe.target) {
                    Ob.subscribe(Observe.target); // 新的订阅
                }
                return value;
            },
            set(newValue) {
                if (value === newValue) {
                    return
                }
                value = newValue; // 闭包变量
                that.walk(newValue); // 新数据 劫持
                Ob.next(newValue); // 推送新的值
            }
        })
    }

}