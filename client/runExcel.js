var fs = require('fs');
var strm = require('./libs/strm.js');
var config = require('../var/config.json');
var Excel = require('exceljs');

strm.BuildRules(config.rules, config.files, {
  env: "xsl"
});


var opts = {};
for (var key of process.argv.splice(2)) {
  var keys = key.split('=');
  opts[keys[0]] = keys[1];
  if (parseInt(opts[keys[0]]) + '' == opts[keys[0]]) {
    opts[keys[0]] = parseInt(opts[keys[0]]);
  } 
}
opts.head = opts.head || 0;

function checkDiff(rowOrigin, rowDest) {
  var errs = [];
  rowDest.eachCell({includeEmpty: true}, function (cellDest, i) {
    var cellOrigin = rowOrigin.getCell(i);
    if (cellOrigin.text !== cellDest.text) {
      if (i == opts.l2) {
        if (cellOrigin.text) {
          errs.push({
            cellId: i,
            msg: "原稿已有翻译不能修改"
          })
        }
      } else {
        errs.push({
          cellId: i,
          msg: "第" + (i) + "列内容有修改"
        })
      }
    }
  })
  return errs;
}

function checkTranslate(rowDest) {
  var errs = [];
  var src = rowDest.getCell(opts.l1); src = src ? src.text : ""
  var dest = rowDest.getCell(opts.l2); dest = dest ? dest.text : ""
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
    if (!Array.isArray(msgs) || msgs.length == 1) {
      console.log(nm + "错误：第" + line + "行：" + (msgs.msg ? msgs.msg : msgs))
    } else {
      console.log(nm + "错误：第" + line + "行：");
      for (var i = 0; i < msgs.length; i++) {
        console.log("     --------     " + (msgs[i].msg? msgs[i].msg : msgs[i]));
      }
    }
  }
  // var c = dataDest.getColumn(13);

  dataDest.eachRow({includeEmpty: true}, function(rowDest, i) {
    var rowOrigin = dataOrigin.getRow(i);

    var diffErrs = checkDiff(rowOrigin, rowDest);
    var resErrs = checkTranslate(rowDest);

    if (resErrs.length) {
      rowDest.getCell(opts.l3 + 1).value = ("问题：\n" + resErrs.join(';\n'));
      err(i, resErrs);
    } else {
      rowDest.getCell(opts.l3 + 1).value = (" ");
    }

    if (diffErrs.length) {
      rowDest.getCell(opts.l3 + 2).value = ("问题：\n" + diffErrs.map(data => data.msg).join(';\n'));
      for (var key in diffErrs) {
        var cellId = diffErrs[key].cellId;
        var cell = rowDest.getCell(cellId);
        cell.style = Object.create(cell.style);
        cell.fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{argb:'FFFFaaaa'}
        };
      }
      err(i, diffErrs);
    } else {
      rowDest.getCell(opts.l3 + 2).value = (" ");
    }
  
  })

  if (dataOrigin.rowCount > dataDest.rowCount) {
    err(dataOrigin.rowCount, "译稿缺少行")
    dataDest.addRow(["错误：译稿缺少行"]);
  }

}


///////////
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

  fs.readdir("./译稿", function (err, filesDest) {
    if (err) {
      console.log("译稿读取错误：" + err);
      return;
    }
    for (var i = 0; i < filesDest.length; i++) {
      var nm = filesDest[i];
      if (nm.match(/\.xlsx$/)) {
        if (origins[nm]) {
          console.log("开始检测：" + nm)
          
          var originBook = new Excel.Workbook();
          var destBook = new Excel.Workbook();
          Promise.all([
            originBook.xlsx.readFile("./原稿/" + nm),
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
    }
  });
});