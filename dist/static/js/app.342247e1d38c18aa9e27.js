webpackJsonp([0],{"/qvH":function(e,t){},AjLZ:function(e,t){},FbOZ:function(e,t){},G8xZ:function(e,t){function s(e){var t=e.split("\n"),s={src:[],dest:[],regRules:[]};for(var a in t){var[r,n=""]=t[a].split("#");if(r=r.trim(),n=n.trim(),r)if(-1!==r.indexOf(">>>")){if((o=r.split(">>>")).length<2)continue;c=(c=o[0].trim()).split("__");for(var i=0;i<c.length;i++){'"'==(l=c[i].trim()).charAt(0)&&'"'==l.charAt(l.length-1)&&(l=l.substr(1,l.length-2)),c[i]=l}s.src.push(c),u=(u=o[1].trim()).split("__");for(i=0;i<u.length;i++){var l;'"'==(l=u[i].trim()).charAt(0)&&'"'==l.charAt(l.length-1)&&(l=l.substr(1,l.length-2)),u[i]=l}s.dest.push(u)}else if(-1!==r.indexOf(">REG>")){var o;if((o=r.split(">REG>")).length<2)continue;var c=o[0].trim(),u=o[1].trim();s.regRules.push({src:new RegExp(c,"g"),dest:new RegExp(u,"g"),comment:n})}}return s}function a(e){for(var t={},s=0;s<e.length;s++){for(var a=e[s],r=t,n=0;n<a.length;n++)r[a[n]]||(r[a[n]]={}),r=r[a[n]];r.match=a}return t}function r(e){for(var t={},s=0;s<e.length;s++)for(var a=e[s],r=0;r<a.length;r++){for(var n=a[r],i=t,l=0;l<n.length;l++)i[n[l]]||(i[n[l]]={}),i=i[n[l]];i.match=s}return t}function n(e,t,s){for(var a=s,r=e[t.charAt(a)];r&&a<t.length;){if(r.match)return{match:r.match,begin:s,end:a+1};a++,r=r[t.charAt(a)]}return!1}function i(e,t){for(var s={},a=0;a<t.length;a++)for(var r=a,n=e[t.charAt(r)];n&&r<t.length;){if(void 0!==n.match){void 0===s[n.match]&&(s[n.match]=[]),s[n.match].push({match:n.match,begin:a,end:r+1}),a=r;break}r++,n=n[t.charAt(r)]}return s}function l(e){if("undefined"==typeof document)return e;var t=document.createElement("div");return t.appendChild(document.createTextNode(e)),t.innerHTML}function o(e,t){for(var s="",a=0,r=0;r<t.length;r++)s+=l(e.substring(a,t[r].begin)),s+="<b>"+l(e.substring(t[r].begin,t[r].end))+"</b>",a=t[r].end;return s+=l(e.substring(a))}function c(e,t,s=1e5){for(var a="",r=0,n=0;n<t.length&&n<s;n++){a+=e.substring(r,t[n].begin);for(var i=t[n].begin;i<t[n].end;i++)a+="*";r=t[n].end}return a+=e.substring(r)}var u={origin:"原文",dest:"译文"},d={match:{title:"一一对应",paramA:!0,paramB:!0,initRule:function(e){var t=s(e);return{srcRaw:t.src,destRaw:t.dest,src:r(t.src),dest:r(t.dest),regRules:t.regRules}},valid:function(e,t,s,a){var r=e.paramA,n=e.paramB,l=i(t.src,r),d=i(t.dest,n),v=[];for(var p in l){var m=l[p]||[],f=d[p]||[];m.length!==f.length&&v.push({message:`${u[a.paramA]}中的（${t.srcRaw[p]}）的数量与${u[a.paramB]}中的（${t.destRaw[p]}）数量不匹配， = ${m.length}:${f.length}`,messageShort:`【${t.srcRaw[p][0]}】= ${m.length}:${f.length}`,srcDiff:o(r,m),destDiff:o(n,f)})}for(var p in d){m=l[p]||[],f=d[p]||[];0==m.length&&0!==f.length&&v.push({message:`${u[a.paramA]}中的（${t.srcRaw[p]}）的数量与${u[a.paramB]}中的（${t.destRaw[p]}）数量不匹配， = ${m.length}:${f.length}`,messageShort:`【${t.srcRaw[p][0]}】= ${m.length}:${f.length}`,srcDiff:o(r,m),destDiff:o(n,f)})}for(var p in t.regRules){var h,g=t.regRules[p];for(m=[],f=[];h=g.src.exec(r);)m.push({begin:h.index,end:h.index+h[0].length,match:h[0]});for(;h=g.dest.exec(n);)f.push({begin:h.index,end:h.index+h[0].length,match:h[0]});l[p]=m,d[p]=f,m.length!==f.length&&v.push({message:`${u[a.paramA]}中的（${g.src.source}）的数量与${u[a.paramB]}中的（${g.dest.source}）数量不匹配， = ${m.length}:${f.length}`,messageShort:`【${g.comment||g.src.source}】= ${m.length}:${f.length}`,srcDiff:o(r,m),destDiff:o(n,f)})}if(s){var _=r,A=n;for(var p in l)_=c(_,l[p]);for(var p in d)A=c(A,d[p]);_=_.replace(/\*/g,""),A=A.replace(/\*/g,"")}return{pass:0==v.length,errors:v,paramA:_,paramB:A,message:""}}},matchA2B:{title:"原文对应译文",paramA:!0,paramB:!0,initRule:function(e){var t=s(e);return{srcRaw:t.src,destRaw:t.dest,src:r(t.src),dest:r(t.dest)}},valid:function(e,t,s,a){var r=e.paramA,n=e.paramB,l=i(t.src,r),d=i(t.dest,n),v=[];for(var p in l){var m=l[p]||[],f=d[p]||[];m.length>f.length&&v.push({message:`${u[a.paramA]}中的（${t.srcRaw[p]}）的数量小于${u[a.paramB]}中的（${t.destRaw[p]}）数量， = ${m.length}:${f.length}`,messageShort:`【${t.srcRaw[p][0]}】= ${m.length}:${f.length}`,srcDiff:o(r,m),destDiff:o(n,f)})}if(s){var h=r,g=n;for(var p in l)h=c(h,l[p]),d[p]&&(g=c(g,d[p],l[p].length));h=h.replace(/\*/g,""),g=g.replace(/\*/g,"")}return{pass:0==v.length,errors:v,paramA:h,paramB:g,message:""}}},contain:{title:"不包含",paramA:!0,initRule:function(e){return a(e=e.split(/[\n]/))},valid:function(e,t,s,a){for(var r=e.paramA,i=[],l=0;l<r.length;l++){var d=n(t,r,l);d&&i.push(d)}if(i.length)var v=[{message:u[a.paramA]+`不能包含${i.map(e=>e.match).join(",")}`,messageShort:`${i.map(e=>"【"+e.match+"】(第"+(e.begin+1)+")").join(" ")}`,destDiff:o(r,i)}];if(s){var p=r;for(var m in i)p=c(p,i[m]);p=p.replace(/\*/g,"")}return{pass:0==i.length,errors:v,paramB:p}}},onlyContain:{title:"只包含",paramA:!0,initRule:function(e){return a(e=e.split(/[\n,]/))},valid:function(e,t,s,a){for(var r=e.paramA,i=[],l=0;l<r.length;l++){n(t,r,l)||i.push({begin:l,end:l+1,match:r.charAt(l)})}if(i.length)var c=[{message:`${u[a.paramA]}中例外的字符${i.map(e=>e.match).join(",")}`,messageShort:`${i.map(e=>"【"+e.match+"】(第"+(e.begin+1)+")").join(" ")}`,destDiff:o(r,i)}];return{pass:0==i.length,errors:c}}},endWith:{title:"结尾匹配",paramA:!0,initRule:function(e){return a(e.split("").reverse().join("").split(/[\n,]/))},valid:function(e,t,s,a){var r=n(t,e.paramA.split("").reverse().join(""),0),i=[],o=[];return r?o.push({message:`${u[a.paramA]}结尾包含了`+r.match.split("").reverse().join(""),messageShort:`${r.match.split("").reverse().join("")}`,srcDiff:function(e,t){for(var s="",a=0,r=e.length,n=t.length-1;n>=0;n--)s+=l(e.substring(a,r-t[n].end)),s+="<b>"+l(e.substring(r-t[n].end,r-t[n].begin))+"</b>",a=r-t[n].begin;return s+=l(e.substring(a))}(e.paramA,[r])}):i.push({message:`${u[a.paramA]}没有结尾要求内容`,messageShort:""}),{pass:!!r,matches:o,errors:i}}},startWith:{title:"开头不匹配",paramA:!0,initRule:function(e){return a(e=e.split("\n"))},valid:function(e,t){var s=e.paramA,a=[],r=n(t,s,0);r&&a.push(r);var i=[{message:`不能以${a.map(e=>e.match).join(",")}开头`,messageShort:`${a.map(e=>e.match).join(" ")}`,destDiff:o(s,a)}];return{pass:0==i.length,errors:i}}},matchReg:{title:"符合正则表达式",paramA:!0,initRule:function(e){return{reg:new RegExp(e)}},valid:function(e,t,s,a){var r=[];return e.paramA.match(t.reg)||r.push(`${u[a.paramA]} 的内容`),{pass:0==r.length,errors:r}}},notMatchReg:{title:"不符合正则表达式",paramA:!0,initRule:function(e){return{reg:new RegExp(e)}},valid:function(e,t,s,a){var r=[];return e.paramA.match(t.reg)&&r.push(`${u[a.paramA]} 的内容`),{pass:0==r.length,errors:r}}}};function v(e,t){for(var s in this.conds=[],this.errMessage=e.errMessage,this.removeMatched=e.removeMatched,this.act=e.act,this.env=e.env,e.conds){var a=e.conds[s];if("br"==a.datatype)var r={"\n":{match:"\n"}};else if("empty"==a.datatype)r="";else if("custom"==a.datatype)r=d[a.type].initRule.call(a,a.data);else r=d[a.type].initRule.call(a,t[a.datatype].data);this.conds.push({cond:a,parsed:r})}}d.notEndWith={title:"结尾不匹配",invert:!0,paramA:!0,initRule:d.endWith.initRule,valid:d.endWith.valid},v.prototype.valid=function(e){var t=null;for(var s in this.conds){var a=this.conds[s].cond,r=this.conds[s].parsed,n=d[a.type].valid({paramA:e[a.paramA],paramB:e[a.paramB]},r,this.removeMatched,a);if(this.removeMatched&&(e[a.paramA]=n.paramA,e[a.paramB]=n.paramB),t=n,n.pass)return t.errMessage=this.errMessage,t}return t.errMessage=this.errMessage,t};var p=[];function m(){for(var e=0;e<f.length;e++)f[e]&&f[e]()}var f=[];t={env:"all",RULES:d,BuildRules:function(e,t,s){for(var a in p=[],s=s,e)p.push(new v(e[a],t));m()},validData:function(e,s,a){for(var r={origin:e,dest:s},n=[],i=0;i<p.length;i++){var l=p[i];if("all"===l.env||t.env===l.env){var o=l.valid(r);if(0==o.pass&&"exit"==l.act){o.pass="结束检测",n.push(o);break}if(0==o.pass&&a)return-1;n.push(o)}}return a?1:n},onRuleChange:function(e){f.push(e)},setEnv(e){t.env=e,m()}};e.exports=t},NHnr:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=s("7+uW"),r=s("mvHQ"),n=s.n(r),i={name:"Xeditor",model:{prop:"data"},props:{data:String},mounted:function(){this.autoHeight()},methods:{autoHeight:function(){var e=this.$refs.r;e.style.height="0px",e.style.height=e.scrollHeight+"px"},input:function(e){this.autoHeight(),this.$emit("input",e.target.value)}}},l={render:function(){var e=this.$createElement;return(this._self._c||e)("textarea",{ref:"r",staticClass:"xeditor",attrs:{spellcheck:"false"},on:{input:this.input}},[this._v(this._s(this.data))])},staticRenderFns:[]};var o=s("VU/8")(i,l,!1,function(e){s("qYi2")},null,null).exports,c=s("NYxO"),u={name:"RuleEditor",data:function(){return{}},components:{Xeditor:o},computed:Object(c.b)(["rules","files"]),methods:{editRule:function(e,t){var s=e.target.value;if("delete"==s&&confirm("确认删除此规则？")&&this.rules.splice(t,1),"movedown"==s&&t<this.rules.length-1){var a=this.rules[t];this.rules[t]=this.rules[t+1],this.rules[t+1]=a,this.$forceUpdate()}if("moveup"==s&&t>0){a=this.rules[t];this.rules[t]=this.rules[t-1],this.rules[t-1]=a,this.$forceUpdate()}e.target.value="default"},addCond:function(e){e.conds.push({type:"contain",data:"",datatype:"custom",paramA:"dest"})},addRule:function(){this.rules.push({errMessage:"新的要求",act:"displayError",conds:[{type:"contain",data:"",datatype:"custom",paramA:"dest"}]})}}},d={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"editArea"},[e._l(e.rules,function(t,a){return s("div",{staticClass:"rulePanel"},[s("select",{on:{change:function(t){e.editRule(t,a)}}},[s("option",{attrs:{value:"default",selected:""}},[e._v("规则"+e._s(a+1))]),e._v(" "),a>0?s("option",{attrs:{value:"moveup"}},[e._v("向上移动")]):e._e(),e._v(" "),a<e.rules.length-1?s("option",{attrs:{value:"movedown"}},[e._v("向下移动")]):e._e(),e._v(" "),s("option",{attrs:{value:"delete"}},[e._v("删除")])]),e._v(":应用于"),s("select",{directives:[{name:"model",rawName:"v-model",value:t.env,expression:"rule.env"}],on:{change:function(s){var a=Array.prototype.filter.call(s.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.$set(t,"env",s.target.multiple?a:a[0])}}},[s("option",{attrs:{value:"all"}},[e._v("全部")]),e._v(" "),e._l(e.ENVS,function(t){return s("option",{domProps:{value:t}},[e._v(e._s(t))])})],2),e._v(" "),e._l(t.conds,function(t,a){return s("div",[e._v("\n      "+e._s(0==a?"要求":"或者")+"\n      "),e.RULES[t.type].paramA&&e.RULES[t.type].paramB?s("span",[s("select",{directives:[{name:"model",rawName:"v-model",value:t.paramA,expression:"cond.paramA"}],on:{change:function(s){var a=Array.prototype.filter.call(s.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.$set(t,"paramA",s.target.multiple?a:a[0])}}},[s("option",{attrs:{value:"origin"}},[e._v("原文")]),e._v(" "),s("option",{attrs:{value:"dest"}},[e._v("译文")])]),e._v("\n        与\n        "),s("select",{directives:[{name:"model",rawName:"v-model",value:t.paramB,expression:"cond.paramB"}],on:{change:function(s){var a=Array.prototype.filter.call(s.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.$set(t,"paramB",s.target.multiple?a:a[0])}}},[s("option",{attrs:{value:"origin"}},[e._v("原文")]),e._v(" "),s("option",{attrs:{value:"dest"}},[e._v("译文")])]),e._v("\n        中\n      ")]):e.RULES[t.type].paramA?s("span",[s("select",{directives:[{name:"model",rawName:"v-model",value:t.paramA,expression:"cond.paramA"}],on:{change:function(s){var a=Array.prototype.filter.call(s.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.$set(t,"paramA",s.target.multiple?a:a[0])}}},[s("option",{attrs:{value:"origin"}},[e._v("原文")]),e._v(" "),s("option",{attrs:{value:"dest"}},[e._v("译文")])]),e._v("\n        中\n      ")]):e._e(),e._v(" "),s("select",{directives:[{name:"model",rawName:"v-model",value:t.type,expression:"cond.type"}],on:{change:function(s){var a=Array.prototype.filter.call(s.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.$set(t,"type",s.target.multiple?a:a[0])}}},e._l(e.RULES,function(t,a){return s("option",{domProps:{value:a}},[e._v(e._s(t.title))])})),e._v(" "),s("select",{directives:[{name:"model",rawName:"v-model",value:t.datatype,expression:"cond.datatype"}],on:{change:function(s){var a=Array.prototype.filter.call(s.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.$set(t,"datatype",s.target.multiple?a:a[0])}}},[e._l(e.files,function(t,a){return s("option",{domProps:{value:a}},[e._v(e._s(t.name))])}),e._v(" "),s("option",{attrs:{value:"empty"}},[e._v("空")]),e._v(" "),s("option",{attrs:{value:"br"}},[e._v("换行")]),e._v(" "),s("option",{attrs:{value:"custom"}},[e._v("以下内容")])],2),e._v(" "),"custom"==t.datatype?s("div",{staticClass:"rule-data"},[s("Xeditor",{model:{value:t.data,callback:function(s){e.$set(t,"data",s)},expression:"cond.data"}})],1):e._e()])}),e._v(" "),s("div",{staticClass:"addCond",on:{click:function(s){e.addCond(t)}}},[e._v("+或者")]),e._v(" "),s("label",[s("input",{directives:[{name:"model",rawName:"v-model",value:t.removeMatched,expression:"rule.removeMatched"}],staticClass:"nck",attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.removeMatched)?e._i(t.removeMatched,null)>-1:t.removeMatched},on:{change:function(s){var a=t.removeMatched,r=s.target,n=!!r.checked;if(Array.isArray(a)){var i=e._i(a,null);r.checked?i<0&&e.$set(t,"removeMatched",a.concat([null])):i>-1&&e.$set(t,"removeMatched",a.slice(0,i).concat(a.slice(i+1)))}else e.$set(t,"removeMatched",n)}}}),e._v("之后的检测忽略匹配到的内容")]),e._v(" "),s("div",[e._v("\n      否则"),s("select",{directives:[{name:"model",rawName:"v-model",value:t.act,expression:"rule.act"}],on:{change:function(s){var a=Array.prototype.filter.call(s.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.$set(t,"act",s.target.multiple?a:a[0])}}},[s("option",{attrs:{value:"displayError"}},[e._v("提示：")]),e._v(" "),s("option",{attrs:{value:"exit"}},[e._v("结束检测")])]),e._v(" "),s("div",{staticClass:"rule-data"},[s("Xeditor",{model:{value:t.errMessage,callback:function(s){e.$set(t,"errMessage",s)},expression:"rule.errMessage"}})],1)])],2)}),e._v(" "),s("div",{staticClass:"addBtn",on:{click:e.addRule}},[e._v("新增规则")])],2)},staticRenderFns:[]};var v=s("VU/8")(u,d,!1,function(e){s("orFZ")},null,null).exports,p=s("n7dY"),m=s.n(p),f=s("G8xZ"),h=s.n(f),g={name:"SingleTest",data:function(){return{srcCode:"步骤1.2.2、根据步骤1.1.2中得到的有效路径和步骤1.2.1中得到的信道估计，由信道冲激响应器生成信道冲激响应H＝(h<sub>1</sub>，h<sub>2</sub>，Λ，h<sub>T</sub>)，其长度T表示系统支持的最大时延，该信道冲激响应有效路径位置上的值为该路径上的信道估计值，非有效路径位置上的值为零，即：",destCode:"ステップ1.2.2とステップ1.1.2で得られた有効パスとステップ1.2.1で得られたチャネル推定値はチャネルインパルス応答からチャネルインパルス応答生成H=(h1である，h2である，ΛはhT)，その長さTシステムによってサポートされる最大遅延を示す，チャネルインパルス有効パス位置応答上の値は、その経路上のチャネル推定値である，非有効パス位置上の値はゼロであり即：",cmpResult:[]}},components:{Xeditor:o},mounted:function(){var e=this;h.a.onRuleChange(function(){return e.cmp()}),this.cmp()},watch:{destCode:function(){this.cmp()},srcCode:function(){this.cmp()}},methods:{cmp:function(){this.cmpResult=h.a.validData(this.srcCode,this.destCode)}}},_={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{attrs:{id:"tests"}},[s("div",{staticClass:"textPanel"},[s("div",[s("h5",[e._v("原文:")]),s("xeditor",{model:{value:e.srcCode,callback:function(t){e.srcCode=t},expression:"srcCode"}})],1),e._v(" "),s("div",[s("h5",[e._v("译文:")]),s("xeditor",{model:{value:e.destCode,callback:function(t){e.destCode=t},expression:"destCode"}})],1)]),e._v(" "),e._l(e.cmpResult,function(t,a){return s("div",{class:t.pass?"respanel pass":"respanel error"},[e._v("\n    规则"+e._s(a+1)+":"+e._s(t.errMessage)+"\n    "),e._l(t.matches,function(t){return s("div",{staticClass:"passPanel"},[s("span",{staticClass:"passIcon"},[e._v("OK")]),e._v(" "+e._s(t.message)+"\n      "),t.srcDiff?s("div",{staticClass:"diff"},[s("div",{staticClass:"line"},[e._v("原文："),s("span",{domProps:{innerHTML:e._s(t.srcDiff)}})])]):e._e(),e._v(" "),t.destDiff?s("div",{staticClass:"diff"},[s("div",{staticClass:"line"},[e._v("译文："),s("span",{domProps:{innerHTML:e._s(t.destDiff)}})])]):e._e()])}),e._v(" "),e._l(t.errors,function(t){return s("div",{staticClass:"errpanel"},[s("span",{staticClass:"errIcon"},[e._v("X")]),e._v(" "+e._s(t.message)+"\n      "),t.srcDiff?s("div",{staticClass:"diff"},[s("div",{staticClass:"line"},[e._v("原文："),s("span",{domProps:{innerHTML:e._s(t.srcDiff)}})])]):e._e(),e._v(" "),t.destDiff?s("div",{staticClass:"diff"},[s("div",{staticClass:"line"},[e._v("译文："),s("span",{domProps:{innerHTML:e._s(t.destDiff)}})])]):e._e()])})],2)})],2)},staticRenderFns:[]};var A={name:"MutiTest",data:function(){return{tests:[{src:"哈哈哈哈",dest:"広気況沖収効決乗巻",assume:1,res:void 0},{src:"哈哈哈哈",dest:"广气况冰冲收效决乘而并卷",assume:-1,res:void 0},{src:"︱",dest:"｜",assume:1,res:void 0},{src:"︱",dest:"︱",assume:-1,res:void 0},{src:"哈哈哈a1,。",dest:"哈哈哈ａ１，。",assume:1,res:void 0},{src:"哈哈哈a1,。",dest:"哈哈哈ａ１，",assume:-1,res:void 0},{src:"&lt;",dest:"＜",assume:1,res:void 0},{src:"&lt;",dest:"哈哈",assume:-1,res:void 0},{src:"&",dest:"哈哈",assume:-1,res:void 0},{src:"&",dest:"＆",assume:1,res:void 0},{src:"&lt;",dest:"&lt;",assume:-1,res:void 0},{src:"&lt;",dest:"<",assume:-1,res:void 0},{src:"é",dest:"&eacute;",assume:1,res:void 0},{src:"é",dest:"é",assume:-1,res:void 0},{src:"é",dest:"＆ｅａｃｕｔｅ；",assume:-1,res:void 0},{src:"ü",dest:"&uuml;",assume:1,res:void 0},{src:"¦",dest:"&brkbar;",assume:-1,res:void 0},{src:"w1& +,",dest:"ｗ１＆　＋，",assume:1,res:void 0},{src:"w1& +,",dest:"w1& +,",assume:-1,res:void 0},{src:"<sub></sub><sup></sup>",dest:"<sub></sub><sup></sup>",assume:1,res:void 0},{src:"<sub></sub><sup></sup>",dest:"＜ｓｕｂ＞＜／ｓｕｂ＞＜ｓｕｐ＞＜／ｓｕｐ＞",assume:-1,res:void 0},{src:"CO<sub>2</sub>",dest:"ＣＯ<sub>２</sub>",assume:1,res:void 0},{src:"CO<sub>2</sub>",dest:"CO<sub>2</sub>",assume:-1,res:void 0},{src:"哈哈哈哈",dest:"",assume:-1,res:void 0},{src:"哈哈哈哈",dest:"哈哈\n哈哈",assume:-1,res:void 0},{src:"——",dest:"－",assume:1,res:void 0},{src:"———",dest:"－－",assume:-1,res:void 0},{src:"哈哈哈哈",dest:"がに",assume:-1,res:void 0},{src:"哈哈哈<img ……/>哈哈哈",dest:"哈哈哈【ＩＭＧ】哈哈哈",assume:-1,res:void 0},{src:"哈哈哈<img ……/>哈哈哈",dest:"哈哈哈ＡＩＭＬＩＵ哈哈哈",assume:-1,res:void 0},{src:"哈哈哈<img ……/>哈哈哈",dest:"哈哈哈哈哈哈",assume:-1,res:void 0},{src:"哈哈哈<maths …>…</maths>哈哈哈",dest:"哈哈哈【MATH】哈哈哈",assume:-1,res:void 0},{src:"哈哈哈<tables …>…</tables>哈哈哈",dest:"哈哈哈ＡＩＭＬＩＵ哈哈哈",assume:1,res:void 0}]}},components:{Xeditor:o},watch:{},methods:{cmp:function(){for(var e=0;e<this.tests.length;e++){var t=this.tests[e];t.res=h.a.validData(t.src,t.dest,1)}},check:function(e){this.$emit("check",e)},mapStatus:function(e){return 1==e?"✔":-1==e?"✘":void 0}}},R={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{attrs:{id:"mutiTest"}},[s("div",{staticClass:"addBtn",on:{click:e.cmp}},[e._v("执行测试")]),e._v(" "),e._m(0),e._v(" "),e._l(e.tests,function(t){return s("div",{staticClass:"line",class:{err:t.res&&t.assume!==t.res,pass:t.res&&t.assume===t.res}},[s("div",{staticClass:"cell cellFull"},[e._v(e._s(t.src))]),e._v(" "),s("div",{staticClass:"cell cellFull"},[e._v(e._s(t.dest))]),e._v(" "),s("div",{staticClass:"cell"},[e._v(e._s(e.mapStatus(t.assume)))]),e._v(" "),s("div",{staticClass:"cell"},[e._v(e._s(e.mapStatus(t.res)))]),e._v(" "),s("div",{staticClass:"cell"},[s("div",{staticClass:"smallbtn",on:{click:function(s){e.check(t)}}},[e._v("检测")])])])})],2)},staticRenderFns:[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"line"},[s("div",{staticClass:"cell cellFull"},[e._v("原文")]),e._v(" "),s("div",{staticClass:"cell cellFull"},[e._v("译文")]),e._v(" "),s("div",{staticClass:"cell"},[e._v("预期")]),e._v(" "),s("div",{staticClass:"cell"},[e._v("结果")]),e._v(" "),s("div",{staticClass:"cell"},[e._v("功能")])])}]};var $={name:"App",data:function(e){return{fileId:0,ruleId:0,editing:"rule",testing:"single"}},components:{RuleEditor:v,SingleTest:s("VU/8")(g,_,!1,function(e){s("AjLZ")},null,null).exports,MutiTest:s("VU/8")(A,R,!1,function(e){s("FbOZ")},null,null).exports,Xeditor:o},computed:Object(c.b)(["rules","files"]),methods:{save:function(){var e=n()({rules:this.rules,files:this.files});m.a.POSTStr("//"+location.hostname+":3000/config",e,function(e){alert("保存成功")})},test:function(e){this.testing=e},addFile:function(){this.files.push({name:"新增数据",data:""}),this.editing="file",this.fileId=this.files.length-1},editFile:function(e){this.editing="file",this.fileId=e},editItem:function(e){this.editing="rule",this.ruleId=e},setEnv:function(e){h.a.setEnv(e.target.value)},check:function(e){this.testing="single",this.$refs.single.srcCode=e.src,this.$refs.single.destCode=e.dest}}},b={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{attrs:{id:"rules"}},[s("div",{staticClass:"sidebar"},[s("div",{staticClass:"item",class:{active:"rule"==e.editing&&0==e.ruleId},on:{click:function(t){e.editItem(0)}}},[e._v("P")]),e._v(" "),e._l(e.files,function(t,a){return s("div",{staticClass:"item file",class:{active:"file"==e.editing&&e.fileId==a},on:{click:function(t){e.editFile(a)}}},[e._v(e._s(t.name))])}),e._v(" "),s("div",{staticClass:"item file new",on:{click:function(t){e.addFile()}}},[e._v("+")]),e._v(" "),s("div",{staticClass:"item save",on:{click:function(t){e.save()}}},[e._v("保存")])],2),e._v(" "),e._l(e.files,function(t,a){return"file"==e.editing&&e.fileId==a?s("div",{staticClass:"fileArea"},[s("h4",[e._v("名称")]),e._v(" "),s("Xeditor",{model:{value:t.name,callback:function(s){e.$set(t,"name",s)},expression:"file.name"}}),e._v(" "),s("h4",[e._v("内容")]),e._v(" "),s("Xeditor",{model:{value:t.data,callback:function(s){e.$set(t,"data",s)},expression:"file.data"}})],1):e._e()}),e._v(" "),"rule"==e.editing?s("RuleEditor"):e._e(),e._v(" "),s("div",{staticClass:"testArea"},[s("select",{on:{change:function(t){e.setEnv(t)}}},e._l(e.ENVS,function(t){return s("option",{domProps:{value:t}},[e._v(e._s(t))])})),e._v(" "),s("SingleTest",{directives:[{name:"show",rawName:"v-show",value:"single"==e.testing,expression:"testing=='single'"}],ref:"single"}),e._v(" "),s("MutiTest",{directives:[{name:"show",rawName:"v-show",value:"muti"==e.testing,expression:"testing=='muti'"}],on:{check:e.check}})],1),e._v(" "),s("div",{staticClass:"sidebar"},[s("div",{staticClass:"item",class:{active:"single"==e.testing},on:{click:function(t){e.test("single")}}},[e._v("自定义测试")]),e._v(" "),s("div",{staticClass:"item",class:{active:"muti"==e.testing},on:{click:function(t){e.test("muti")}}},[e._v("完全测试")])])],2)},staticRenderFns:[]};var C=s("VU/8")($,b,!1,function(e){s("/qvH")},null,null).exports;a.a.use(c.a),a.a.config.productionTip=!1;var y=new c.a.Store({state:{rules:[],files:[]},getters:{getRules:function(e){return e.rules}},mutations:{setRuleAndFile:function(e,t){var s=t.rules,a=t.files;e.rules=s,e.files=a,h.a.BuildRules(e.rules,e.files)}}});y.watch(function(e){return e.rules},function(e,t){h.a.BuildRules(y.state.rules,y.state.files)},{deep:!0}),y.watch(function(e){return e.files},function(e,t){h.a.BuildRules(y.state.rules,y.state.files)},{deep:!0}),m.a.GET("//"+location.hostname+":3000/config",function(e){for(var t=0;t<e.rules.length;t++)e.rules[t].env=e.rules[t].env||"all";y.commit("setRuleAndFile",e),new a.a({el:"#app",store:y,components:{App:C},template:"<App/>"})}),a.a.prototype.ENVS=["P-上","P-下","IP-上","IP-下"],a.a.prototype.RULES=h.a.RULES},n7dY:function(e,t){function s(e,t,s,a){var r=new XMLHttpRequest;r.open(e,t),"POST"==e&&r.setRequestHeader("Content-type","application/x-www-form-urlencoded");var n=[];for(var i in s)n.push(encodeURIComponent(i)+"="+encodeURIComponent(s[i]));r.onreadystatechange=function(){if(4==r.readyState){if(200==r.status){var e=JSON.parse(r.responseText);a(e)}r.onreadystatechange=null}},r.send(n.join("&"))}e.exports={GET:function(e,t){s("GET",e,{},t)},POST:function(e,t,a){s("POST",e,t,a)},POSTStr:function(e,t,s){var a=new XMLHttpRequest;a.open("POST",e),a.onreadystatechange=function(){if(4==a.readyState){if(200==a.status){var e=JSON.parse(a.responseText);s(e)}a.onreadystatechange=null}},a.send(t)}}},orFZ:function(e,t){},qYi2:function(e,t){}},["NHnr"]);
//# sourceMappingURL=app.342247e1d38c18aa9e27.js.map