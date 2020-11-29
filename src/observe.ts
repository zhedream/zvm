
import { Observer, Subject } from "rxjs";

export class Observe {
    data: any;
    static count = 1;
    static target: Observer<any> | null;
    constructor(data: any) {
        this.data = data;
        console.log('=====数据劫持 Start');
        this.walk(data);
        console.log('=====数据劫持 End');
    }

    walk(data: any) {
        // debugger
        if (!data || typeof data != 'object')
            return
        Object.keys(data).forEach(key => {
            console.log(`劫持:${key}`, data[key]);
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
                    // console.log(`数据:${key} ,有新的订阅`);
                    // console.log(`数据:${key} ,新的订阅者`, Observe.target);
                    // console.log(`数据:${key} ,的专属广播`, Ob);
                    Ob.subscribe(Observe.target); // 新的订阅
                }
                return value;
            },
            set(newValue) {
                if (value === newValue) {
                    return
                }
                console.log(` ${key} 有变化, Observe开始推送`);

                value = newValue; // 闭包变量
                that.walk(newValue); // 新数据 劫持
                Ob.next(newValue); // 推送新的值
            }
        })
    }

}