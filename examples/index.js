import {Zvm} from '../src/zvm'

new Zvm({
    el:'#app',
    data:{
        msg:'hello'
    },
    methods:{
        hello:function(){
            console.log('hello');
        }
    }
})