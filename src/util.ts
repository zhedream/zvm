/**
 * 通过表达式 取值 data:{  }
 * @param expr 表达式 如: obj.name
 * @param data 数据 data:{name:'',...}
 */
export function exprFromData(expr: string, data: any) {
    let exprArr = expr.split('.');
    let val = data;
    exprArr.forEach(expr => {
        let reg = /(.+)(\[\d+\])+/;
        if (reg.test(expr) === true) {
            // arr[0][0]
            expr.split('[').forEach(key => {
                let k = key.split(']')[0];
                val = val[k];
            })
        } else val = val[expr] // 对象

    })
    return val;
}
/**
 * 通过表达式 写值
 * @param expr 表达式
 * @param value 值
 * @param data 原数据 对象/数组
 */
export function exprToData(expr: string, value: any, data: any, ) {
    let exprArr = expr.split('.');
    let val = data;
    exprArr.forEach((expr, index) => {
        let reg = /(.+)(\[\d+\])+/;
        if (index < exprArr.length - 1) {
            if (reg.test(expr) === true) {
                // arr[0][0]
                expr.split('[').forEach(key => {
                    let k = key.split(']')[0];
                    val = val[k];
                })
            } else val = val[expr] // 对象
        } else val[expr] = value

    })
}