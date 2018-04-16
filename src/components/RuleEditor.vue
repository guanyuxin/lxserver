<template>
  <div class="editArea">
    <div class="rulePanel" v-for="(rule,index) in rules">
      <select v-on:change="editRule($event, index)">
        <option value="default" selected>规则{{(index+1)}}</option>
        <option v-if="index > 0" value="moveup">向上移动</option>
        <option v-if="index < rules.length-1" value="movedown">向下移动</option>
        <option value="delete">删除</option>
      </select>:应用于<select v-model="rule.env">
        <option value="all">全部</option>
        <option v-for="env in ENVS" :value="env">{{env}}</option>
      </select>
      <div v-for="(cond, index) in rule.conds">
        {{index == 0 ? "要求" : "或者"}}
        <span v-if="RULES[cond.type].paramA && RULES[cond.type].paramB">
          <select v-model="cond.paramA">
            <option value="origin">原文</option>
            <option value="dest">译文</option>
          </select>
          与
          <select v-model="cond.paramB">
            <option value="origin">原文</option>
            <option value="dest">译文</option>
          </select>
          中
        </span>
        <span v-else-if="RULES[cond.type].paramA">
          <select v-model="cond.paramA">
            <option value="origin">原文</option>
            <option value="dest">译文</option>
          </select>
          中
        </span>
        <select v-model="cond.type">
          <option :value="key" v-for="(RULE, key) in RULES">{{RULE.title}}</option>
        </select>
        <select v-model="cond.datatype">
          <option :value="key" v-for="(c, key) in files">{{c.name}}</option>
          <option value="empty">空</option>
          <option value="br">换行</option>
          <option value="custom">以下内容</option>
        </select>
        
        <div class="rule-data" v-if="cond.datatype == 'custom'">
          <Xeditor v-model="cond.data"></Xeditor>
        </div>
      </div>
      <div class="addCond" v-on:click="addCond(rule)">+或者</div>
      <label><input v-model="rule.removeMatched" class="nck" type="checkbox">之后的检测忽略匹配到的内容</label>

      <div>
        否则<select v-model="rule.act">
          <option value="displayError">提示：</option>
          <option value="exit">结束检测</option>
        </select>
        <div class="rule-data">
          <Xeditor v-model="rule.errMessage"></Xeditor>
        </div>
      </div>
    </div>
    <div v-on:click="addRule" class="addBtn">新增规则</div>
  </div>
</template>

<script>
import Xeditor from './Xeditor'
import { mapState } from 'vuex'

export default {
  name: 'RuleEditor',
  data () {
    return {
      
    }
  },
  components: {
    Xeditor
  },
  computed: mapState([
    'rules',
    'files'
  ]),
  methods: {
    editRule(e, i) {
      var act = e.target.value;
      if (act == "delete" && confirm("确认删除此规则？")) {
        this.rules.splice(i, 1);
      }
      if (act == 'movedown' && i < this.rules.length - 1) {
        var tmp = this.rules[i];
        this.rules[i] = this.rules[i + 1]
        this.rules[i + 1] = tmp;
        this.$forceUpdate();
      }
      if (act == 'moveup' && i > 0) {
        var tmp = this.rules[i];
        this.rules[i] = this.rules[i - 1]
        this.rules[i - 1] = tmp;
        this.$forceUpdate();
      }
      e.target.value = "default";
    },
    addCond(t) {
      t.conds.push({
        "type":"contain",
        "data":"",
        "datatype": "custom",
        "paramA":"dest",
      });
    },
    addRule() {
      this.rules.push({
        "errMessage":"新的要求",
        "act": "displayError",
        "conds":[{
          "type":"contain",
          "data":"",
          "datatype": "custom",
          "paramA":"dest",
        }]
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.rule-data {
  margin: 10px;
}
#rules select {
  color: inherit;
  font-size: inherit;
  -webkit-appearance: none;
  border: none;
  border-bottom: 1px dashed;
  border-radius: 0;
  background: none;
  height: 30px;
  cursor: pointer;
}
#rules select:hover {
  background: rgba(0,0,0,.2);
}
#rules select:focus {
  outline: none;
}
.addBtn {
  height: 30px;
  border-radius: 9px;
  background: #34a1ff;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  box-shadow: 0px 0px 4px rgba(0,0,0,.4);
  margin: 10px;
  flex: 1;
  cursor: pointer;
}
.addBtn:hover {
  background: #44b1ff;
}

.nck {
  display: inline-block;
  -webkit-appearance: none;
  width: 1.4em;
  height: 1.4em;
  background: #fff;
  border: none;
  border-radius: 50%;
  vertical-align: middle;
}
label:hover .nck {
  box-shadow: inset 0 0 11px #0b09a0;
}
.nck:checked {
  border: 3px solid #fff;
  background: #4a4aff;
}

.addCond {
  border: 1px dashed #fff;
  display: block;
  margin: 10px 0;
  width: 70px;
  text-align: center;
  cursor: pointer;
  border-radius: 10px;
}
.addCond:hover {
  background: rgba(0,0,0,.2);
}
.editArea {
  color: #fff;
  width: 500px;
  background: #4A90E2;
  border-right: 1px solid #aeaee6;
  border-left: 1px solid #aeaee6;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
  z-index: 10;
}
</style>
