import { Zvm } from '../src/zvm'

new Zvm({
    el: '#app',
    data: {
        msg: 'hello',
        msg1: "msg22",
        msg2: "input",
        msg3: "<h3>msg22</h3>",
        msg4: "input2",
    },
    methods: {
        hello: function () {
            console.log(this.$data.msg2);
        }
    }
})