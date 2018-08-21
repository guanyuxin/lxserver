var MASK = "*";
// 将 k >>> v 解析
// 输入：多行文本
// k >>> v  #注释  完全匹配
// k >REG> v  #注释  正则匹配
// #注释
// 输出 res
function parsePairFile(text) {
  var lines = text.split('\n');
  var res = {
    src: [],  // k
    dest: [],  // v 与k一一对应
    regRules: [] // 正则，包含src，dest和comment
  }
  for (var key in lines) {
    var [mean, comment=""] = lines[key].split('#');
    mean = mean.trim();
    comment = comment.trim();

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
          comment: comment
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
  var c = str.charAt(init);
  if (c == MASK) {
    return -1;
  }
  var currentNode = tree[c];
  while (currentNode && init < str.length) {
    if (currentNode.match) {
      return {
        match: currentNode.match,
        begin: i,
        end: init+1
      };
    }
    init++
    var c = str.charAt(init);
    if (c == MASK) {
      break;
    }
    currentNode = currentNode[c]
  }
  return false;
}

//找到 str在匹配所有的子串
function MatchTreeAllByGroup(tree, str) {
  var matches = {};
  for (var i = 0; i < str.length; i++) {
    var init = i;
    var c = str.charAt(init);
    if (c == MASK) {
      continue;
    }
    var currentNode = tree[c];
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
      c = str.charAt(init);
      if (c == MASK) {
        break;
      }
      currentNode = currentNode[c];
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

function markMatches(str, matches) {
  var dest = '';
  var low = 0;
  for (var i = 0; i < matches.length; i++) {
    dest += str.substring(low, matches[i].begin);
    for (var j = matches[i].begin; j < matches[i].end; j++) {
      dest += MASK;
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
    valid: function (data, rule, cond) {
      var a = data.paramA;
      var b = data.paramB;
      var matchesA = MatchTreeAllByGroup(rule.src, a);
      var matchesB = MatchTreeAllByGroup(rule.dest, b);
      var resA = '';
      var resB = '';
      var message = '';
      var matches = [];
      var errors = [];

      for (var key in matchesA) {
        var matchA = matchesA[key] || [];
        var matchB = matchesB[key] || [];
        
        matches.push({
          matchA,
          matchB
        })
        if (matchA.length !== matchB.length) {
          errors.push({
            message: `${lang[cond.paramA]}中的（${rule.srcRaw[key]}）的数量与${lang[cond.paramB]}中的（${rule.destRaw[key]}）数量不匹配， = ${matchA.length}:${matchB.length}`,
            messageShort: `【${rule.srcRaw[key][0]}】= ${matchA.length}:${matchB.length}`,
            srcDiff: highlightMatches(a, matchA),
            destDiff: highlightMatches(b, matchB),
            matchA,
            matchB
          })
        }
      }

      // B中出现而A中没有的
      for (var key in matchesB) {
        var matchA = matchesA[key] || [];
        var matchB = matchesB[key] || [];
        
        if (matchA.length == 0 && matchB.length !== 0) {
          matches.push({
            matchA,
            matchB
          })
          errors.push({
            message: `${lang[cond.paramA]}中的（${rule.srcRaw[key]}）的数量与${lang[cond.paramB]}中的（${rule.destRaw[key]}）数量不匹配， = ${matchA.length}:${matchB.length}`,
            messageShort: `【${rule.srcRaw[key][0]}】= ${matchA.length}:${matchB.length}`,
            srcDiff: highlightMatches(a, matchA),
            destDiff: highlightMatches(b, matchB),
            matchA,
            matchB
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
          if (t[0].length == 0) {
            break;
          }
        }
        regRule.src.lastIndex = 0;
        while(t = regRule.dest.exec(b)) {
          matchB.push({
            begin: t.index,
            end: t.index + t[0].length,
            match: t[0]
          })
          if (t[0].length == 0) {
            break;
          }
        }
        regRule.dest.lastIndex = 0;
        matchesA[key] = matchA;
        matchesB[key] = matchB;

        matches.push({
          matchA,
          matchB
        })
        if (matchA.length !== matchB.length) {
          errors.push({
            message: `${lang[cond.paramA]}中的（${regRule.src.source}）的数量与${lang[cond.paramB]}中的（${regRule.dest.source}）数量不匹配， = ${matchA.length}:${matchB.length}`,
            messageShort: `【${regRule.comment || regRule.src.source}】= ${matchA.length}:${matchB.length}`,
            srcDiff: highlightMatches(a, matchA),
            destDiff: highlightMatches(b, matchB),
            matchA,
            matchB
          })
        }
      }
      
      return {
        pass: errors.length == 0,
        errors: errors,
        matches,
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
    valid: function (data, config, cond) {
      var a = data.paramA;
      var b = data.paramB;
      var matchesA = MatchTreeAllByGroup(config.src, a);
      var matchesB = MatchTreeAllByGroup(config.dest, b);
      var resA = '';
      var resB = '';
      var message = '';
      var errors = [];
      var matches = [];

      for (var key in matchesA) {
        var matchA = matchesA[key] || [];
        var matchB = matchesB[key] || [];

        if (matchA.length > matchB.length) {
          errors.push({
            message: `${lang[cond.paramA]}中的（${config.srcRaw[key]}）的数量小于${lang[cond.paramB]}中的（${config.destRaw[key]}）数量， = ${matchA.length}:${matchB.length}`,
            messageShort: `【${config.srcRaw[key][0]}】= ${matchA.length}:${matchB.length}`,
            srcDiff: highlightMatches(a, matchA),
            destDiff: highlightMatches(b, matchB),
            matchA,
            matchB
          })
        } else {
          // A中出现的B中也需要出现，如果B中出现的更多，则多余的不需要替换
          matchB.splice(matchA.length, 1000000);
        }
        matches.push({
          matchA,
          matchB
        })
      }
      
      return {
        pass: errors.length == 0,
        errors: errors,
        message: message,
        matches
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
    valid: function (data, config, cond) {
      var b = data.paramA;
      var matches = [];
      var str = "";
      for (var i = 0; i < b.length; i++) {
        var res = MatchTree(config, b, i);
        if (res && res.match) {
          matches.push(res);
        }
      }

      if (matches.length) {
        var errors = [{
          message: lang[cond.paramA] + `不能包含${matches.map(data=>data.match).join(',')}`,
          messageShort: `${matches.map(data => '【' + data.match + '】(第' + (data.begin+1) + ")").join(' ')}`,
          destDiff: highlightMatches(b, matches),
        }];
      }
      return {
        pass: matches.length == 0,
        errors: errors,
        matches: matches
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
    valid: function (data, config, cond) {
      var b = data.paramA;
      var matches = [];
      var str = "";
      for (var i = 0; i < b.length; i++) {
        var res = MatchTree(config, b, i);
        if (res == false) {
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
          messageShort: `${matches.map(data => '【' + data.match + '】(第' + (data.begin+1) + ")").join(' ')}`,
          destDiff: highlightMatches(b, matches),
          matchA: matches
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
    valid: function (data, config, cond) {
      var str = data.paramA.split('').reverse().join('');
      var res = MatchTree(config, str, 0);
      
      var errors = [];
      var matches = [];
      if (res) {
        matches.push({
          message: `${lang[cond.paramA]}结尾包含了` + res.match.split('').reverse().join(''),
          messageShort: `${res.match.split('').reverse().join('')}`,
          srcDiff: highlightMatchesRev(data.paramA, [res]),
          matchA: [res]
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
      var regs = config.split('\n');
      var res = [];
      for (var i = 0; i < regs.length; i++) {
        res.push(new RegExp(regs[i], 'g'));
      }
      return {
        reg: res
      }
    },
    valid: function (data, config, cond) {
      var a = data.paramA;
      var errors = [];
      var res;
      var matches = [];
      var t;
      a = a;
      for (var i = 0; i < config.reg.length; i++) {
        if (t = config.reg[i].exec(a)) {
          config.reg[i].lastIndex = 0
          res = {
            begin: t.index,
            end: t.index + t[0].length,
            match: t[0],
          }
          break;
        }
      }
      if (res) {
        matches.push({
          message: `${lang[cond.paramA]}匹配了` + res.match.split('').reverse().join(''),
          messageShort: `${res.match.split('').reverse().join('')}`,
          srcDiff: highlightMatchesRev(data.paramA, [res]),
          matchA: [res]
        })
      } else {
        errors.push({
          message: `${lang[cond.paramA]}没有要求内容`,
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
  notMatchReg: {
    title: "不符合正则表达式",
    paramA: true,
    initRule: function (config) {
      config = config.split('#');
      var reg = new RegExp(config[0].trim(), 'g');
      return {
        reg: reg,
        comment: (config[1] || reg.source).trim()
      }
    },
    valid: function (data, config, cond) {
      var a = data.paramA;
      var matches = [];
      var errors = [];
      var t;
      if (config.reg.source) {
        while(t = config.reg.exec(a)) {
          matches.push({
            begin: t.index,
            end: t.index + t[0].length,
            match: t[0],
          })
          if (t[0].length == 0) {
            break;
          }
        }
        config.reg.lastIndex = 0;
      }
      if (matches.length !== 0) {
        errors.push({
          message: "正则表达式" + config.comment,
          messageShort: "【" + config.comment + "】",
          destDiff: highlightMatches(a, matches),
          matchA: matches
        })
      }
      return {
        pass: matches.length == 0,
        errors
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
    var result = RULES[cond.type].valid({
      paramA: line[cond.paramA],
      paramB: line[cond.paramB],
    }, parsed, cond);
    
    if (Array.isArray(result.matches)) {
      for (var i = 0; i < result.matches.length; i++) {
        var match = result.matches[i];
        if (this.removeMatched) {
          if (match.matchA) {
            line[cond.paramA] = markMatches(line[cond.paramA], match.matchA);
            line[cond.paramB] = markMatches(line[cond.paramB], match.matchB);
          } else {
            line[cond.paramA] = markMatches(line[cond.paramA], match);
          }
        }
      }
    }

    lastTest = result;
    // 或者的关系
    if (result.pass) {
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
