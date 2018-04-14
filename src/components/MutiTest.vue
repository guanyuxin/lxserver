<template>
  <div id="mutiTest">
    <div v-on:click="cmp" class="addBtn">执行测试</div>
    <div class="line">
      <div class="cell cellFull">原文</div>
      <div class="cell cellFull">译文</div>
      <div class="cell">预期</div>
      <div class="cell">结果</div>
      <div class="cell">功能</div>
    </div>
    <div class="line" v-for="testCase in tests" :class="{'err':testCase.res && testCase.assume !== testCase.res,'pass':testCase.res && testCase.assume === testCase.res}">
      <div class="cell cellFull">{{testCase.src}}</div>
      <div class="cell cellFull">{{testCase.dest}}</div>
      <div class="cell">{{mapStatus(testCase.assume)}}</div>
      <div class="cell">{{mapStatus(testCase.res)}}</div>
      <div class="cell"><div class="smallbtn" v-on:click="check(testCase)">检测</div></div>
    </div>
  </div>
</template>
<script>
import Xeditor from './Xeditor';
import strm from '../strm';
export default {
  name: 'MutiTest',
  data () {
    return {
      tests: [
        {
          src: "哈哈哈哈",
          dest: "広気況沖収効決乗巻",
          assume: 1,
          res: undefined
        },{
          src: "哈哈哈哈",
          dest: "广气况冰冲收效决乘而并卷",
          assume: -1,
          res: undefined
        },{
          src: "︱",
          dest: "｜",
          assume: 1,
          res: undefined
        },{
          src: "︱",
          dest: "︱",
          assume: -1,
          res: undefined
        },{
          src: "哈哈哈a1,。",
          dest: "哈哈哈ａ１，。",
          assume: 1,
          res: undefined
        },{
          src: "哈哈哈a1,。",
          dest: "哈哈哈ａ１，",
          assume: -1,
          res: undefined
        },{
          src: "&lt;",
          dest: "＜",
          assume: 1,
          res: undefined
        },{
          src: "&lt;",
          dest: "哈哈",
          assume: -1,
          res: undefined
        },{
          src: "&",
          dest: "哈哈",
          assume: -1,
          res: undefined
        },{
          src: "&",
          dest: "＆",
          assume: 1,
          res: undefined
        },{
          src: "&lt;",
          dest: "&lt;",
          assume: -1,
          res: undefined
        },{
          src: "&lt;",
          dest: "<",
          assume: -1,
          res: undefined
        },{
          src: "é",
          dest: "&eacute;",
          assume: 1,
          res: undefined
        },{
          src: "é",
          dest: "é",
          assume: -1,
          res: undefined
        },{
          src: "é",
          dest: "＆ｅａｃｕｔｅ；",
          assume: -1,
          res: undefined
        },{
          src: "ü",
          dest: "&uuml;",
          assume: 1,
          res: undefined
        },{
          src: "¦",
          dest: "&brkbar;",
          assume: -1,
          res: undefined
        },{
          src: "w1& +,",
          dest: "ｗ１＆　＋，",
          assume: 1,
          res: undefined
        },{
          src: "w1& +,",
          dest: "w1& +,",
          assume: -1,
          res: undefined
        },{
          src: "<sub></sub><sup></sup>",
          dest: "<sub></sub><sup></sup>",
          assume: 1,
          res: undefined
        },{
          src: "<sub></sub><sup></sup>",
          dest: "＜ｓｕｂ＞＜／ｓｕｂ＞＜ｓｕｐ＞＜／ｓｕｐ＞",
          assume: -1,
          res: undefined
        },{
          src: "CO<sub>2</sub>",
          dest: "ＣＯ<sub>２</sub>",
          assume: 1,
          res: undefined
        },{
          src: "CO<sub>2</sub>",
          dest: "CO<sub>2</sub>",
          assume: -1,
          res: undefined
        },{
          src: "哈哈哈哈",
          dest: '',
          assume: -1,
          res: undefined
        },{
          src: "哈哈哈哈",
          dest: `哈哈
哈哈`,
          assume: -1,
          res: undefined
        },{
          src: "——",
          dest: "－",
          assume: 1,
          res: undefined
        },{
          src: "———",
          dest: "－－",
          assume: -1,
          res: undefined
        },{
          src: "哈哈哈哈",
          dest: "がに",
          assume: -1,
          res: undefined
        },{
          src: "哈哈哈<img ……/>哈哈哈",
          dest: "哈哈哈【ＩＭＧ】哈哈哈",
          assume: -1,
          res: undefined
        },{
          src: "哈哈哈<img ……/>哈哈哈",
          dest: "哈哈哈ＡＩＭＬＩＵ哈哈哈",
          assume: -1,
          res: undefined
        },{
          src: "哈哈哈<img ……/>哈哈哈",
          dest: "哈哈哈哈哈哈",
          assume: -1,
          res: undefined
        },{
          src: "哈哈哈<maths …>…</maths>哈哈哈",
          dest: "哈哈哈【MATH】哈哈哈",
          assume: -1,
          res: undefined
        },{
          src: "哈哈哈<tables …>…</tables>哈哈哈",
          dest: "哈哈哈ＡＩＭＬＩＵ哈哈哈",
          assume: 1,
          res: undefined
        }
      ]
    }
  },
  components: {
    Xeditor
  },
  watch: {
  },
  methods: {
    cmp() {
      var res = [];
      for (var i = 0; i < this.tests.length; i++) {
        var testCase = this.tests[i];
        testCase.res = strm.validData(testCase.src, testCase.dest, 1);
      }
    },
    check(e) {
      this.$emit('check', e)
    },
    mapStatus(a) {
      if (a == 1) {
        return "✔";
      }
      if (a == -1) {
        return "✘";
      }
    }
  }
}
</script>
<style>

#mutiTest {
  font-size:12px;
}
.line {
  display: flex;
}

.cell {
  background: #fff;
  margin: 2px;
  width: 30px;
  text-align: center;
}
.line.err .cell{
  background: #faa;
}
.line.pass .cell{
  background: #afa;
}
.cellFull {
  flex: 1;
  text-align: left;
}
</style>