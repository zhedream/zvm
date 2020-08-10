# ZVM

深入了解 MVVM 框架尝,试写一个 MVVM 框架. 加深对 MVVM 框架的理解

使用 rxjs 实现 观察者

主要有三个文件

observe.ts 劫持数据, 并设置对应的主题 rxjs.Subject, 以供订阅
compile.ts 编译模板, 连接 observe, watcher. 并给节点订阅数据
watcher.ts 订阅数据, 使用 rxjs 实现

实现了几个简单的指令

插值数据插值 {{}}
v-text
v-html
v-on
v-model
