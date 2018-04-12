// 将 k >>> v 解析
function parsePairFile(text) {
  var lines = text.split('\n');
  var res = {
    src: [],
    dest: [],
    regRules: []
  }
  for (var key in lines) {
    var mean = lines[key].split('#')[0].trim();
    if (mean) {
      if (mean.indexOf('>>>') !== -1) {
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
      } else if (mean.indexOf('>REG>') !== -1) {
        var pair = mean.split('>REG>');
        if (pair.length < 2) {continue}
        var src = pair[0].trim();
        var dest = pair[1].trim();
        res.regRules.push({
          src: new RegExp(src, 'g'),
          dest: new RegExp(dest, 'g'),
        })
      }
    }
  }
  return res;
}

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
  if (typeof(document) === "undefined") {return s}
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

function markMatches(str, matches, maxCount = 100000) {
  var dest = '';
  var low = 0;
  for (var i = 0; i < matches.length && i < maxCount; i++) {
    dest += str.substring(low, matches[i].begin);
    for (var j = matches[i].begin; j < matches[i].end; j++) {
      dest += '*';
    }
    low = matches[i].end;
  }
  dest += str.substring(low);
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
    initRule: function (ruleText) {
      var cfg = parsePairFile(ruleText);
      return {
        srcRaw: cfg.src,
        destRaw: cfg.dest,
        src: BuildTreeByGroup(cfg.src),
        dest: BuildTreeByGroup(cfg.dest),
        regRules: cfg.regRules,
      };
    },
    valid: function (data, rule, removeMatched, cond) {
      var a = data.paramA;
      var b = data.paramB;
      var matchesA = MatchTreeAllByGroup(rule.src, a);
      var matchesB = MatchTreeAllByGroup(rule.dest, b);
      var resA = '';
      var resB = '';
      var message = '';
      var errors = [];

      for (var key in matchesA) {
        var matchA = matchesA[key] || [];
        var matchB = matchesB[key] || [];
        if (matchA.length !== matchB.length) {
          errors.push({
            message: `${lang[cond.paramA]}中的（${rule.srcRaw[key]}）的数量与${lang[cond.paramB]}中的（${rule.destRaw[key]}）数量不匹配， = ${matchA.length}:${matchB.length}`,
            messageShort: `【${rule.srcRaw[key][0]}】:${matchA.length}:${matchB.length}`,
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
            message: `${lang[cond.paramA]}中的（${rule.srcRaw[key]}）的数量与${lang[cond.paramB]}中的（${rule.destRaw[key]}）数量不匹配， = ${matchA.length}:${matchB.length}`,
            messageShort: `【${rule.srcRaw[key][0]}】:${matchA.length}:${matchB.length}`,
            srcDiff: highlightMatches(a, matchA),
            destDiff: highlightMatches(b, matchB),
          })
        }
      }

      for (var key in rule.regRules) {
        var regRule = rule.regRules[key];

        var matchA = [];
        var matchB = [];
        var t;

        while(t = regRule.src.exec(a)) {
          matchA.push({
            begin: t.index,
            end: t.index + t[0].length,
            match: t[0]
          })
        }
        while(t = regRule.dest.exec(b)) {
          matchB.push({
            begin: t.index,
            end: t.index + t[0].length,
            match: t[0]
          })
        }
        matchesA[key] = matchA;
        matchesB[key] = matchA;

        if (matchA.length !== matchB.length) {
          errors.push({
            message: `${lang[cond.paramA]}中的（${regRule.src.source}）的数量与${lang[cond.paramB]}中的（${regRule.dest.source}）数量不匹配， = ${matchA.length}:${matchB.length}`,
            messageShort: `【${regRule.src.source}】:${matchA.length}:${matchB.length}`,
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
  // 原文中有的A，译文中需要有对应B；但不要求译文中的B与原文的A对应（A数量<=B数量即可）
  matchA2B: {
    title: "原文对应译文",
    paramA: true,
    paramB: true,
    initRule: function (config) {
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
        if (matchA.length > matchB.length) {
          errors.push({
            message: `${lang[cond.paramA]}中的（${config.srcRaw[key]}）的数量小于${lang[cond.paramB]}中的（${config.destRaw[key]}）数量， = ${matchA.length}:${matchB.length}`,
            messageShort: `【${config.srcRaw[key][0]}】:${matchA.length}:${matchB.length}`,
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
          if (matchesB[key]) {
            replacedB = markMatches(replacedB, matchesB[key], matchesA[key].length);
          }
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
    initRule: function (config) {
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
          messageShort: `${matches.map(data => '【' + data.match + '】-' + (data.begin+1)).join(' ')}`,
          destDiff: highlightMatches(b, matches),
        }];
      }
      
      if (removeMatched) {
        var replacedB = b;
        for (var key in matches) {
          replacedB = markMatches(replacedB, matches[key]);
        }
        replacedB = replacedB.replace(/\*/g, '');
      }

      return {
        pass: matches.length == 0,
        errors: errors,
        paramB: replacedB,
      }
    }
  },
  // 只包含xx集合内的字符
  onlyContain: {
    title: "只包含",
    paramA: true,
    initRule: function (config) {
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
          messageShort: `${matches.map(data => '【' + data.match + '】-' + (data.begin+1)).join(' ')}`,
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
    initRule: function (config) {
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
          messageShort: `${res.match.split('').reverse().join('')}`,
          srcDiff: highlightMatchesRev(data.paramA, [res])
        })
      } else {
        errors.push({
          message: `${lang[cond.paramA]}没有结尾要求内容`,
          messageShort: ``,
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
    initRule: function (config) {
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
        message: `不能以${matches.map(data=>data.match).join(',')}开头`,
        messageShort: `${matches.map(data=>data.match).join(' ')}`,
        destDiff: highlightMatches(b, matches),
      }];
      return {
        pass: errors.length == 0,
        errors: errors
      }
    }
  },
  matchReg: {
    title: "符合正则表达式",
    paramA: true,
    initRule: function (config) {
      var reg = new RegExp(config);
      return {
        reg: reg
      }
    },
    valid: function (data, config, removeMatched, cond) {
      var a = data.paramA;
      var errors = [];
      if (!a.match(config.reg)) {
        errors.push(`${lang[cond.paramA]} 的内容`)
      }
      return {
        pass: errors.length == 0,
        errors: errors
      }
    }
  },
  notMatchReg: {
    title: "不符合正则表达式",
    paramA: true,
    initRule: function (config) {
      var reg = new RegExp(config);
      return {
        reg: reg
      }
    },
    valid: function (data, config, removeMatched, cond) {
      var a = data.paramA;
      var errors = [];
      if (a.match(config.reg)) {
        errors.push(`${lang[cond.paramA]} 的内容`)
      }
      return {
        pass: errors.length == 0,
        errors: errors
      }
    }
  },
}
RULES.notEndWith = {
  title: "结尾不匹配",
  invert: true,
  paramA: true,
  initRule: RULES.endWith.initRule,
  valid: RULES.endWith.valid,
}

function Rule(data, file) {
  this.conds = [];
  this.errMessage = data.errMessage;
  this.removeMatched = data.removeMatched;
  this.act = data.act;
  this.env = data.env;
  for (var key in data.conds) {
    var cond = data.conds[key];
    if (cond.datatype == "br") {
      var parsed = {"\n":{
        match: "\n"
      }}
    } else if (cond.datatype == "empty") {
      var parsed = ''
    } else if (cond.datatype == "custom") {
      var parsed = RULES[cond.type].initRule.call(cond, cond.data);
    } else {
      var parsed = RULES[cond.type].initRule.call(cond, file[cond.datatype].data);
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

var rs = []

function BuildRules(rulesConfig, files, globalConfig) {
  rs = [];
  globalConfig = globalConfig
  for (var key in rulesConfig) {
    rs.push(new Rule(rulesConfig[key], files))
  }
  runCallbacks();
}

function validData(ta, tb, simple) {
  var mmo = {
    origin: ta,
    dest: tb
  }
  var diffs = [];
  for (var i = 0; i < rs.length; i++) {
    var r = rs[i];
    if (!(r.env === 'all' || exports.env === r.env)) {
      continue;
    }
    var res = r.valid(mmo);
    if (res.pass == false && r.act == "exit") {
      res.pass = "结束检测";
      diffs.push(res);
      break;
    }
    if (res.pass == false && simple) {
      return -1
    }
    diffs.push(res);
  } 
  if (simple) {
    return 1;
  } else {
    return diffs;
  }
}

function runCallbacks() {
  for (var i = 0; i < callbacks.length; i++) {
    if (callbacks[i]) {
      callbacks[i]();
    }
  }
}

var callbacks = [];
function onRuleChange(callback) {
  callbacks.push(callback);
}
var globalConfig = {}
var exports = {
  env: 'all',
  RULES,
  BuildRules,
  validData,
  onRuleChange,
  setEnv(env) {
    exports.env = env;
    runCallbacks();
  }
}
module.exports = exports;
