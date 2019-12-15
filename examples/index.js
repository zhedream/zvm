import { Zvm } from '../src/zvm'

var vm = new Zvm({
    el: '#app',
    data: {
        msg: 'hello',
        obj: {
            name: "zhedream",
            age: 18,
        },

    },
    methods: {
        hello: function () {
            console.log(this.obj);
            this.obj.name = 'newName'
            this.say();
        },
        say(){
            console.log(this.obj.name);
        }
    }
})