var fs = require('fs');
var strm = require('./libs/strm.js');
var config = require('./libs/config.json');
var Excel = require('exceljs');

// remind 修改了excelsjs
// /exceljs/dist/es5/xlsx/xform/sheet/cell-xform.js

/**
case 'str':
  model.type = Enums.ValueType.String;
  //model.value = utils.xmlDecode(model.value);
  model.value = (model.value);
  break;

**/


strm.BuildRules(config.rules, config.files, {
  env: "xsl"
});

var CONFIGS = {
  "P-all": {
    l1: 10,
    l2: 13,
    l3: 13,
    head: 1,
    checkDiff: false
  },
  "IP-all": {
    l1: 11,
    l2: 13,
    l3: 13,
    head: 0,
    checkDiff: true
  },
  "P-sum": {
    l1: 10,
    l2: 13,
    l3: 13,
    head: 1,
    checkDiff: false
  },
  "IP-sum": {
    l1: 10,
    l2: 13,
    l3: 13,
    head: 0,
    checkDiff: true
  }
}

var opts = {};
for (var key of process.argv.splice(2)) {
  var keys = key.split('=');
  opts[keys[0]] = keys[1];
  if (parseInt(opts[keys[0]]) + '' == opts[keys[0]]) {
    opts[keys[0]] = parseInt(opts[keys[0]]);
  } 
}
opts.head = opts.head || 0;
var fileConfig = CONFIGS[opts.group];

function checkDiff(rowOrigin, rowDest) {
  var errs = [];
  rowDest.eachCell({includeEmpty: true}, function (cellDest, i) {
    var cellOrigin = rowOrigin.getCell(i);
    if (cellOrigin.text !== cellDest.text) {

      if (i == fileConfig.l2) {
        if (cellOrigin.text) {
          errs.push({
            cellId: i,
            msg: "原稿已有翻译不能修改"
          })
        }
      } else {
        debugger;
        errs.push({
          cellId: i,
          msg: "第" + (i) + "列内容有修改\n" + cellOrigin.text + '\n' + cellDest.text+"\n"
        })
      }
    }
  })
  return errs;
}

function checkTranslate(rowDest) {
  var errs = [];
  var src = rowDest.getCell(fileConfig.l1); src = src ? src.text : ""
  var dest = rowDest.getCell(fileConfig.l2); dest = dest ? dest.text : ""
  var res = strm.validData(src, dest);
  for (var i = 0; i < res.length; i++) {
    if (!res[i].pass) {
      for (var key in res[i].errors) {
        if (res[i].errors[key].messageShort) {
          errs.push(res[i].errMessage + ":" +res[i].errors[key].messageShort);
        } else {
          errs.push(res[i].errMessage); 
        }
      }
    }
  }
  return errs;
}

function checkXsl (dataOrigin, dataDest, nm) {
  function err (line, msgs) {
    if (!Array.isArray(msgs)) {
      console.log(nm + "错误：第" + line + "行：" + (msgs.msg ? msgs.msg : msgs))
    } else {
      console.log(nm + "错误：第" + line + "行：");
      for (var i = 0; i < msgs.length; i++) {
        console.log("     --------     " + (msgs[i].msg? msgs[i].msg : msgs[i]));
      }
    }
  }

  dataDest.eachRow({includeEmpty: true}, function(rowDest, i) {
    var skip = false;
    //不检测表头
    if (fileConfig.head && i < fileConfig.head) {
      skip = true;
    }
    if (skip) {return}
    // 检验原稿与译稿区别
    if (fileConfig.checkDiff) {
      var rowOrigin = dataOrigin.getRow(i);
      var diffErrs = checkDiff(rowOrigin, rowDest);
      if (diffErrs.length) {
        rowDest.getCell(fileConfig.l3 + 2).value = ("问题：\n" + diffErrs.map(data => data.msg).join(';\n'));
        for (var key in diffErrs) {
          var cellId = diffErrs[key].cellId;
          var cell = rowDest.getCell(cellId);
          cell.style = Object.create(cell.style);
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb:'FFFFaaaa'}
          };
        }
        err(i, diffErrs);
      } else {
        rowDest.getCell(fileConfig.l3 + 2).value = (" ");
      }
      // 原稿已经存在译文则不进行校验
      if (rowOrigin.getCell(fileConfig.l2).text) {
        skip = true; 
      }
    }
    // 检验译文是否对应原文
    if (skip) {return}
    var resErrs = checkTranslate(rowDest);
    if (resErrs.length) {
      rowDest.getCell(fileConfig.l3 + 1).value = ("问题：\n" + resErrs.join(';\n'));
      err(i, resErrs);
    } else {
      rowDest.getCell(fileConfig.l3 + 1).value = (" ");
    }

  
  })

  // 检验原稿与译稿区别
  if (fileConfig.checkDiff) {
    if (dataOrigin.rowCount > dataDest.rowCount) {
      err(dataOrigin.rowCount, "译稿缺少行")
      dataDest.addRow(["错误：译稿缺少行"]);
    }
  }

}


///////////
function checkDestFiles(origins) {
  fs.readdir("./译稿", function (err, filesDest) {
    if (err) {
      console.log("译稿读取错误：" + err);
      return;
    }
    filesDest.forEach(function(nm, i) {
      if (nm.match(/\.xlsx$/)) {
        if (!fileConfig.checkDiff || origins[nm]) {
          console.log("开始检测：" + nm)
          
          var originBook = new Excel.Workbook();
          var destBook = new Excel.Workbook();
            debugger;
          Promise.all([
            fileConfig.checkDiff ? originBook.xlsx.readFile("./原稿/" + nm) : Promise.resolve(0),
            destBook.xlsx.readFile("./译稿/" + nm)
          ]).then(function () {
            checkXsl(originBook.worksheets[0],destBook.worksheets[0], nm);
            destBook.xlsx.writeFile("./检测/" + nm).then(() => {
              console.log('详见:/检测/' + nm);
            })
          }).catch(function (e) {
            console.log("读取Excel错误" + nm + ";" + e.message);
          })
        } else {
          console.log("忽略：" + nm + "找不到对应的原稿")
        }
      }
    })
  });
}

if (fileConfig.checkDiff) {
  fs.readdir("./原稿", function (err, filesOrigin) {
    if (err) {
        console.log("原稿读取错误：" + err);
        return;
    }
    var origins = {};
    for (var i = 0; i < filesOrigin.length; i++) {
      if (filesOrigin[i].match(/\.xlsx$/)) {
        origins[filesOrigin[i]] = true;
      }
    }
    checkDestFiles(origins)
  });
} else {
  checkDestFiles()
}