import { Zvm } from "../src/zvm";

window.vm = new Zvm({
  el: "#app",
  data() {
    return {
      msg: "hello",
      btnName: '点击',
      obj: {
        name: "zhedream",
        age: 18,
      },
    }
  },
  methods: {
    hello: function () {
      this.say();
    },
    hello1(a, b, c) {
      console.log(a, b, c);

    },
    input() {
      console.log('input');
    },
  },
});
