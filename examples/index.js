import {Zvm} from '../src/zvm'

new Zvm({
    el:'#app',
    data:{
        msg:'hello',
        msg2:"msg2"
    },
    methods:{
        hello:function(){
            console.log('hello');
        }
    }
})