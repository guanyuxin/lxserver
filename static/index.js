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
  //if (method == "POST") {
  //  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
 // }
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
  template: `<textarea ref="r" class="xeditor" v-once spellcheck="false" v-on:input="input">{{data}}</textarea>`,
  model: {
    prop: 'data',
    event: 'input'
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

// 创建字典树
function BuildTree(config) {
  var res = {};
  for (var i = 0; i < config.length; i++) {
    var str = config[i];

    var cres = res;
    for (var j = 0; j < str.length; j++) {
      if (!cres[str[j]]) {
        cres[str[j]] = {
        };
      }
      cres = cres[str[j]]
    }
    cres.match = str;
  }
  return res;
}

// 创建字典树，每个节点属于一个分组
function BuildTreeByGroup(groups) {
  var res = {};
  for (var i = 0; i < groups.length; i++) {
    var group = groups[i];
    for (var k = 0; k < group.length; k++) {
      var str = group[k];
      var cres = res;
      for (var j = 0; j < str.length; j++) {
        if (!cres[str[j]]) {
          cres[str[j]] = {
          };
        }
        cres = cres[str[j]]
      }
      cres.match = i;
    }
  }
  return res;
}

//找到 str在i位置匹配最短的一个子串
function MatchTree(tree, str, i) {
  var init = i;
  var currentNode = tree[str.charAt(init)];
  while (currentNode && init < str.length) {
    if (currentNode.match) {
      return {
        match: currentNode.match,
        begin: i,
        end: init+1
      };
    }
    init++
    currentNode = currentNode[str.charAt(init)]
  }
  return false;
}

//找到 str在i位置匹配所有的子串
function MatchTreeAllByGroup(tree, str) {
  var matches = {};
  for (var i = 0; i < str.length; i++) {
    var init = i;
    var currentNode = tree[str.charAt(init)];
    while (currentNode && init < str.length) {
      if (currentNode.match !== undefined) {
        if (matches[currentNode.match] === undefined) {
          matches[currentNode.match] = [];
        }
        matches[currentNode.match].push({
          match: currentNode.match,
          begin: i,
          end: init + 1
        });
        i = init;
        break;
      }
      init++
      currentNode = currentNode[str.charAt(init)]
    }
  }
  return matches;
}

function htmlencode(s) {
  var div = document.createElement('div');  
  div.appendChild(document.createTextNode(s));  
  return div.innerHTML;  
}

function highlightMatches(str, matches) {
  var dest = '';
  var low = 0;
  for (var i = 0; i < matches.length; i++) {
    dest += htmlencode(str.substring(low, matches[i].begin));
    dest += '<b>' + htmlencode(str.substring(matches[i].begin, matches[i].end)) + '</b>'
    low = matches[i].end;
  }
  dest += htmlencode(str.substring(low));
  return dest;
}

function markMatches(str, matches) {
  var dest = '';
  var low = 0;
  for (var i = 0; i < matches.length; i++) {
    dest += str.substring(low, matches[i].begin);
    for (var j = matches[i].begin; j < matches[i].end; j++) {
      dest += '*';
    }
    low = matches[i].end;
  }
  dest += str.substring(low);
  return dest;
}

function highlightMatchesRev(str, matches) {
  var dest = '';
  var low = 0;
  var l = str.length
  for (var i = matches.length - 1; i >= 0; i--) {
    dest += htmlencode(str.substring(low, l - matches[i].end));
    dest += '<b>' + htmlencode(str.substring(l - matches[i].end, l - matches[i].begin)) + '</b>'
    low = l - matches[i].begin;
  }
  dest += htmlencode(str.substring(low));
  return dest;
}

var lang = {
  "origin": "原文",
  "dest": "译文"
}

var RULES = {
  // a 和 b需要一一对应
  match: {
    title: "一一对应",
    paramA: true,
    paramB: true,
    initConfig: function (config) {
      var cfg = parsePairFile(config);
      return {
        srcRaw: cfg.src,
        destRaw: cfg.dest,
        src: BuildTreeByGroup(cfg.src),
        dest: BuildTreeByGroup(cfg.dest)
      };
    },
    valid: function (data, config, removeMatched, cond) {
      var a = data.paramA;
      var b = data.paramB;
      var matchesA = MatchTreeAllByGroup(config.src, a);
      var matchesB = MatchTreeAllByGroup(config.dest, b);
      var resA = '';
      var resB = '';
      var message = '';
      var errors = [];

      for (var key in matchesA) {
        var matchA = matchesA[key] || [];
        var matchB = matchesB[key] || [];
        if (matchA.length !== matchB.length) {
          errors.push({
            message: `${lang[cond.paramA]}中的（${config.srcRaw[key]}）的数量与${lang[cond.paramB]}中的（${config.destRaw[key]}）数量不匹配， = ${matchA.length}:${matchB.length}`,
            srcDiff: highlightMatches(a, matchA),
            destDiff: highlightMatches(b, matchB),
          })
        }
      }

      for (var key in matchesB) {
        var matchA = matchesA[key] || [];
        var matchB = matchesB[key] || [];
        if (matchA.length == 0 && matchB.length !== 0) {
          errors.push({
            message: `${lang[cond.paramA]}中的（${config.srcRaw[key]}）的数量与${lang[cond.paramB]}中的（${config.destRaw[key]}）数量不匹配， = ${matchA.length}:${matchB.length}`,
            srcDiff: highlightMatches(a, matchA),
            destDiff: highlightMatches(b, matchB),
          })
        }
      }
      if (removeMatched) {
        var replacedA = a;
        var replacedB = b;
        for (var key in matchesA) {
          replacedA = markMatches(replacedA, matchesA[key]);
        }
        for (var key in matchesB) {
          replacedB = markMatches(replacedB, matchesB[key]);
        }
        replacedA = replacedA.replace(/\*/g, '');
        replacedB = replacedB.replace(/\*/g, '');
      }

      
      return {
        pass: errors.length == 0,
        errors: errors,
        paramA: replacedA,
        paramB: replacedB,
        message: message
      }
    }
  },
  // 不包含xx
  contain: {
    title: "不包含",
    paramA: true,
    initConfig: function (config) {
      config = config.split(/[\n]/)
      return BuildTree(config);
    },
    valid: function (data, config, removeMatched, cond) {
      var b = data.paramA;
      var matches = [];
      var str = "";
      for (var i = 0; i < b.length; i++) {
        var res = MatchTree(config, b, i);
        if (res) {
          matches.push(res);
        }
      }

      if (matches.length) {
        var errors = [{
          message: lang[cond.paramA] + `不能包含${matches.map(data=>data.match).join(',')}`,
          destDiff: highlightMatches(b, matches),
        }];
      }
      return {
        pass: matches.length == 0,
        errors: errors
      }
    }
  },
  // 只包含xx集合内的字符
  onlyContain: {
    title: "只包含",
    paramA: true,
    initConfig: function (config) {
      config = config.split(/[\n,]/)
      return BuildTree(config);
    },
    valid: function (data, config, removeMatched, cond) {
      var b = data.paramA;
      var matches = [];
      var str = "";
      for (var i = 0; i < b.length; i++) {
        var res = MatchTree(config, b, i);
        if (res) {
        } else {
          matches.push({
            begin: i,
            end: i+1,
            match: b.charAt(i)
          });
        }
      }

      if (matches.length) {
        var errors = [{
          message: `${lang[cond.paramA]}中例外的字符${matches.map(data=>data.match).join(',')}`,
          destDiff: highlightMatches(b, matches),
        }];
      }
      return {
        pass: matches.length == 0,
        errors: errors
      }
    }
  },

  // 以xx结尾
  endWith: {
    title: "结尾匹配",
    paramA: true,
    initConfig: function (config) {
      return BuildTree(config.split('').reverse().join('').split(/[\n,]/))
    },
    valid: function (data, config, removeMatched, cond) {
      var str = data.paramA.split('').reverse().join('');
      var res = MatchTree(config, str, 0);
      
      var errors = [];
      var matches = [];
      if (res) {
        matches.push({
          message: `${lang[cond.paramA]}结尾包含了` + res.match.split('').reverse().join(''),
          srcDiff: highlightMatchesRev(data.paramA, [res])
        })
      } else {
        errors.push({
          message: `${lang[cond.paramA]}没有结尾要求内容`
        })
      }
      return {
        pass: !!res,
        matches: matches,
        errors: errors
      }
    }
  },
  // 以xx开头
  startWith: {
    title: "开头不匹配",
    paramA: true,
    initConfig: function (config) {
      config = config.split('\n')
      return BuildTree(config);
    },
    valid: function (data, config) {
      var b = data.paramA;
      var matches = [];
      var str = "";
      var res = MatchTree(config, b, 0);
      if (res) {
        matches.push(res);
      }
      var errors = [{
        message: `不能包含${matches.map(data=>data.match).join(',')}`,
        destDiff: highlightMatches(b, matches),
      }];
      return {
        pass: errors.length == 0,
        errors: errors
      }
    }
  }
}
RULES.notEndWith = {
  title: "结尾不匹配",
  invert: true,
  paramA: true,
  initConfig: RULES.endWith.initConfig,
  valid: RULES.endWith.valid,
}

function Rule(data, file) {
  this.conds = [];
  this.errMessage = data.errMessage;
  this.removeMatched = data.removeMatched;
  this.act = data.act;
  for (var key in data.conds) {
    var cond = data.conds[key];
    if (cond.datatype == "br") {
      var parsed = {"\n":{
        match: "\n"
      }}
    } else if (cond.datatype == "empty") {
      var parsed = ''
    } else if (cond.datatype == "custom") {
      var parsed = RULES[cond.type].initConfig.call(cond, cond.data);
    } else {
      var parsed = RULES[cond.type].initConfig.call(cond, file[cond.datatype].data);
    }
    this.conds.push({
      cond: cond,
      parsed: parsed
    })
  }
}

Rule.prototype.valid = function(line) {
  var lastTest = null;

  for (var key in this.conds) {
    var cond = this.conds[key].cond;
    var parsed = this.conds[key].parsed;
    var match = RULES[cond.type].valid({
      paramA: line[cond.paramA],
      paramB: line[cond.paramB],
    }, parsed, this.removeMatched, cond);

    if (this.removeMatched) {
      line[cond.paramA] = match.paramA;
      line[cond.paramB] = match.paramB;
    }

    lastTest = match;
    // 或者的关系
    if (match.pass) {
      lastTest.errMessage = this.errMessage;
      return lastTest;
    }
  }

  lastTest.errMessage = this.errMessage;
  return lastTest
}

var rs = [
]

function parsePairFile(text) {
  var lines = text.split('\n');
  var res = {
    src: [],
    dest: []
  }
  for (var key in lines) {
    var mean = lines[key].split('#')[0].trim();
    if (mean) {
      var pair = mean.split('>>>');
      if (pair.length < 2) {continue}
      var src = pair[0].trim();
      
      src = src.split('__');
      for (var i = 0; i < src.length; i++) {
        var code = src[i].trim();
        if (code.charAt(0) == '"' && code.charAt(code.length-1) == '"') {
          code = code.substr(1, code.length-2);
        }
        src[i] = code;
      }
      res.src.push(src);

      var dest = pair[1].trim();
      dest = dest.split('__')
      for (var i = 0; i < dest.length; i++) {
        var code = dest[i].trim();
        if (code.charAt(0) == '"' && code.charAt(code.length-1) == '"') {
          code = code.substr(1, code.length-2);
        }
        dest[i] = code;
      }
      res.dest.push(dest);
    }
  }
  return res;
}


function BuildRules(rulesConfig, files) {
  rs = [];
  for (var key in rulesConfig) {
    rs.push(new Rule(rulesConfig[key], files))
  }
}


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
        this.cmpResult = [];
        var ta = this.srcCode;
        var tb = this.destCode;
        var mmo = {
          origin: ta,
          dest: tb
        }
        for (var i = 0; i < rs.length; i++) {
          var r = rs[i];
          var Res = r.valid(mmo);
          if (Res.pass == false && r.act == "exit") {
            Res.pass = "结束检测";
            this.cmpResult.push(Res);
            break;
          }
          this.cmpResult.push(Res);
          
        }
      }
    }
  })
});