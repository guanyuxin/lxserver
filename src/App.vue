<template>
  <div id="rules">
    <div class="sidebar">
      <div class="item" :class="{active:editing=='rule' && ruleId==0}"  v-on:click="editItem(0)">P</div>
      <div class="item file" :class="{active:editing=='file' && fileId==key}" v-on:click="editFile(key)" v-for="(file, key) in files">{{file.name}}</div>
      <div class="item file new" v-on:click="addFile()">+</div>
      <div class="item save" v-on:click="save()">保存</div>
    </div>

    <div class="fileArea"  v-for="(file, key) in files" v-if="editing=='file' && fileId==key">
      <h4>名称</h4>
      <Xeditor v-model="file.name"></Xeditor>
      <h4>内容</h4>
      <Xeditor v-model="file.data"></Xeditor>
    </div>
    <RuleEditor v-if="editing=='rule'"/>
    <div class="testArea">
      <select v-on:change="setEnv($event)">
        <option v-for="env in ENVS" :value="env">{{env}}</option>
      </select>
      <SingleTest ref="single" v-show="testing=='single'"></SingleTest>
      <MutiTest v-show="testing=='muti'" v-on:check="check"></MutiTest>
    </div>
    <div class="sidebar">
      <div class="item" :class="{active:testing=='single'}"  v-on:click="test('single')">自定义测试</div>
      <div class="item" :class="{active:testing=='muti'}"  v-on:click="test('muti')">完全测试</div>
    </div>
  </div>
</template>

<script>
import RuleEditor from './components/RuleEditor'
import XHR from './xhr'
import strm from './strm'
import Xeditor from './components/Xeditor'
import SingleTest from './components/SingleTest'
import MutiTest from './components/MutiTest'
import { mapState } from 'vuex'


export default {
  name: 'App',
  data: function data (argument) {
    return {
      fileId: 0,
      ruleId: 0,
      editing: "rule",
      testing: 'single'
    }
  },
  components: {
    RuleEditor,
    SingleTest,
    MutiTest,
    Xeditor
  },
  computed: mapState([
    'rules',
    'files'
  ]),
  methods: {
    save() {
      var data = JSON.stringify({
        rules: this.rules,
        files: this.files,
      });
      XHR.POSTStr('//'+location.hostname+':3000/config', data, function (e) {
        alert('保存成功');
      })
    },
    test(id) {
      this.testing = id;
    },
    addFile() {
      this.files.push({
        name: "新增数据",
        data: ""
      })
      this.editing = "file";
      this.fileId = this.files.length - 1;
    },
    editFile(key) {
      this.editing = "file";
      this.fileId = key
    },
    editItem(key) {
      this.editing = "rule";
      this.ruleId = key;
    },
    setEnv(e) {
      strm.setEnv(e.target.value);
    },
    check(e) {
      this.testing = 'single';
      this.$refs.single.srcCode = e.src
      this.$refs.single.destCode = e.dest
    }
  }
}
</script>

<style>
body {
  font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
  font-size: 18px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #34495e;
  margin: 0;
  background:#728EB2;
}
h5 {
  margin-bottom: 3px;
  margin-top: 10px;
  font-size: 19px;
}
#rules {
  display: flex;
  position: relative;
}
.testArea {
  flex: 1;
}
.sidebar .item {
  position: relative;
  right: -1px;
  font-size: 13px;
  width: 23px;
  height: 81px;
  margin: 4px;
  margin-right: 0;
  border-top-left-radius: 11px;
  background: #d0d0d0;
  border-bottom-left-radius: 12px;
  writing-mode: vertical-lr;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -1px 1px 3px rgba(0,0,0,.4);
  cursor: pointer;
}
.sidebar .item.file {
  background: #e0e0e0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.sidebar .item.file.new {
  height: 30px;
  font-weight: bold;
  font-size: 20px;
  writing-mode: initial;
  align-items: flex-start;
}
.sidebar .item.save {
  background: #d22222;
  color: #fff;
  left: 0;
  margin-top: 30px;
  font-size: 16px;
  position: fixed;
  bottom: 10px;
}
.sidebar .item.save:hover {
  background: #e33333;
}
.sidebar .item:hover{
  background: #8fadd2
}
.sidebar .item.active {
  z-index: 20;
  color: #fff;
  background: #4b90e2;
}
.fileArea {
  padding: 10px;
  color: #fff;
  background: #4A90E2;
  border-right: 1px solid #aeaee6;
  border-left: 1px solid #aeaee6;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
  width: 500px;
}
</style>
