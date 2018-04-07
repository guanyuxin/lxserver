function xhr (method, url, data, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open(method, url);
  if (method == "POST") {
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  }
  var re = [];
  for (var key in data) {
    re.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
  }
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var data = JSON.parse(xhr.responseText);
        callback(data);
      }
      xhr.onreadystatechange = null;
    }
  }
  xhr.send(re.join('&'));
}
function POSTStr (url, data, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open("POST", url);
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var data = JSON.parse(xhr.responseText);
        callback(data);
      }
      xhr.onreadystatechange = null;
    }
  }
  xhr.send(data);
}
var XHR = {
  GET: function (url, callback) {
    xhr ("GET", url, {}, callback);
  },
  POST: function (url, data, callback) {
    xhr ("POST", url, data, callback);
  }
}

Vue.component('xeditor', {
  template: `<textarea ref="r" class="xeditor" spellcheck="false" v-on:input="input">{{data}}</textarea>`,
  model: {
    prop: 'data',
  },
  props: {
    'data': String
  },
  mounted() {
    this.autoHeight()
  },
  methods: {
    autoHeight() {
      var textarea = this.$refs.r;
      textarea.style.height = "0px"; /* Reset the height*/
      textarea.style.height = textarea.scrollHeight + "px";
    },
    input(e) {
      this.autoHeight();
      this.$emit('input', e.target.value)
    }
  }
})


XHR.GET('/config', function (config) {
  var v = new Vue({
    el: "#RuleEditor",
    data () {
      return {
        srcCode: "步骤1.2.2、根据步骤1.1.2中得到的有效路径和步骤1.2.1中得到的信道估计，由信道冲激响应器生成信道冲激响应H＝(h<sub>1</sub>，h<sub>2</sub>，Λ，h<sub>T</sub>)，其长度T表示系统支持的最大时延，该信道冲激响应有效路径位置上的值为该路径上的信道估计值，非有效路径位置上的值为零，即：",
        destCode: "ステップ1.2.2とステップ1.1.2で得られた有効パスとステップ1.2.1で得られたチャネル推定値はチャネルインパルス応答からチャネルインパルス応答生成H=(h1である，h2である，ΛはhT)，その長さTシステムによってサポートされる最大遅延を示す，チャネルインパルス有効パス位置応答上の値は、その経路上のチャネル推定値である，非有効パス位置上の値はゼロであり即：",
        editing: "rule",
        fileId: 0,
        ruleId: 0,
        rules: config.rules,
        files: config.files,
        RULES: RULES,
        cmpResult: []
      }
    },
    mounted: function() {
      BuildRules(this.rules, this.files);
      this.cmp();
    },
    watch: {
      destCode: function () {
        this.cmp();
      },
      srcCode: function () {
        this.cmp();
      },
      files: {
        handler: function (val, oldVal) {
          BuildRules(this.rules, this.files);
          this.cmp();
        },
        deep: true
      },
      rules: {
        handler: function (val, oldVal) {
          BuildRules(this.rules, this.files);
          this.cmp();
        },
        deep: true
      }
    },
    methods: {
      editRule(e, i) {
        var act = e.target.value;
        if (act == "delete" && confirm("确认删除此规则？")) {
          this.rules.splice(i, 1);
        }
        if (act == 'movedown' && i < this.rules.length - 1) {
          var tmp = this.rules[i];
          debugger;
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
      save() {
        var data = JSON.stringify({
          rules: v.rules,
          files: v.files,
        });
        POSTStr('/config', data, function (e) {
          alert('保存成功');
        })
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
      },
      getRULE(rule) {
        return RULES[rule.type]
      },
      cmp: function () {
        this.cmpResult = validData(this.srcCode, this.destCode);
      }
    }
  })
});