<template>
  <div id="tests">
    <div class="textPanel">
      <div><h5>原文:</h5><xeditor v-model="srcCode"></xeditor></div>
      <div><h5>译文:</h5><xeditor v-model="destCode"></xeditor></div>
    </div>
    
    <div :class="con.pass? 'respanel pass':'respanel error'" v-for="(con, index) in cmpResult">
      规则{{index+1}}:{{con.errMessage}}
      <div class="passPanel" v-for="errData in con.matches">
        <span class="passIcon">OK</span> {{errData.message}}
        <div class="diff" v-if="errData.srcDiff">
          <div class="line">原文：<span v-html="errData.srcDiff"></span></div>
        </div>
        <div class="diff" v-if="errData.destDiff">
          <div class="line">译文：<span v-html="errData.destDiff"></span></div>
        </div>
      </div>
      <div class="errpanel" v-for="errData in con.errors">
        <span class="errIcon">X</span> {{errData.message}}
        <div class="diff" v-if="errData.srcDiff">
          <div class="line">原文：<span v-html="errData.srcDiff"></span></div>
        </div>
        <div class="diff" v-if="errData.destDiff">
          <div class="line">译文：<span v-html="errData.destDiff"></span></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Xeditor from './Xeditor'
import strm from '../strm'
export default {
  name: 'SingleTest',
  data () {
    return {
      srcCode: "步骤1.2.2、根据步骤1.1.2中得到的有效路径和步骤1.2.1中得到的信道估计，由信道冲激响应器生成信道冲激响应H＝(h<sub>1</sub>，h<sub>2</sub>，Λ，h<sub>T</sub>)，其长度T表示系统支持的最大时延，该信道冲激响应有效路径位置上的值为该路径上的信道估计值，非有效路径位置上的值为零，即：",
      destCode: "ステップ1.2.2とステップ1.1.2で得られた有効パスとステップ1.2.1で得られたチャネル推定値はチャネルインパルス応答からチャネルインパルス応答生成H=(h1である，h2である，ΛはhT)，その長さTシステムによってサポートされる最大遅延を示す，チャネルインパルス有効パス位置応答上の値は、その経路上のチャネル推定値である，非有効パス位置上の値はゼロであり即：",
      cmpResult: []
    }
  },
  components: {
    Xeditor
  },
  mounted: function() {
    strm.onRuleChange(() => this.cmp());
    this.cmp();
  },
  watch: {
    destCode: function () {
      this.cmp();
    },
    srcCode: function () {
      this.cmp();
    },
  },
  methods: {
    cmp: function () {
      this.cmpResult = strm.validData(this.srcCode, this.destCode);
    }
  }
}
</script>
<style>

#tests {
  flex:1;
}
.rulePanel {
  margin: 10px;
  padding: 10px;
  border-bottom: 1px solid;
}
.textPanel {
  margin: 10px
}
.passIcon {
  height: 15px;
  border-radius: 15px;
  color: #fff;
  background: #070;
  vertical-align: 2px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  line-height: 15px;
  text-align: center;
}
.errIcon {
  width: 15px;
  height: 15px;
  border-radius: 15px;
  color: #fff;
  background: #f00;
  vertical-align: 2px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  line-height: 15px;
  text-align: center;
}
.errpanel b {
  color: #ff0000;
  font-weight: bold;
  display: inline-block;
  padding: 0 2px;
  text-shadow: 1px 1px rgba(146, 146, 146, 0.34);
}
.passPanel b {
  color: #39ce39;
  font-weight: bold;
  display: inline-block;
  padding: 0 2px;
  text-shadow: 1px 1px rgba(146, 146, 146, 0.34);
}
.respanel {
  background: #eee;
  margin: 10px;
  padding: 10px;
  position: relative;
  box-shadow: 0 0 2px;
}
.respanel.error {
  background: #fee;
}
.respanel.error:after {
  content: "异常";
  position: absolute;
  right: 18px;
  color: #fff;
  background: #a22;
  top: 0;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  padding: 4px 20px;
  opacity: .7;
}
.respanel.pass:after {
  content: "通过";
  position: absolute;
  right: 18px;
  color: #fff;
  background: #2a2;
  top: 0;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  padding: 4px 20px;
  opacity: .7;
}
.diff {
  margin: 10px;
  padding: 10px;
  border: 1px dashed #9e9e14;
  background: #f0fbe0;
}
</style>