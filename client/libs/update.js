var http = require('http');
var fse = require('fs-extra');
var packageConfig = require('./package.json');
var versionVar = require('./version.json');

var host = "http://guanyuxin.com:3000/";
//var host = "http://localhost:3000/";
var path = "client/";

function logInfo(type, msg) {
  console.log(msg)
}

function checkUpdate(cb) {
  getHttpData(host + 'configVersion', function (res) {
    var v = parseInt(res);
    if (v > versionVar.version) {
      logInfo('updateInfo', '更新规则');
      getHttpData(host + 'config', function (res) {
        try {
          var d = JSON.parse(res);
          fse.outputFile('./libs/config.json', res)
          fse.outputFile('./libs/version.json', JSON.stringify({
            version: v
          }))
          logInfo('updateInfo', '规则更新完毕');
        } catch(e) {
          logInfo('updateInfo', '规则更新异常');
        }
      });
    }
  }, function() {
    logInfo('updateInfo', '无法连接至配置服务器');
  });
  getHttpData(host + path + 'package.json', function (res) {
    var data = JSON.parse(res);
    
    packageConfig.build = packageConfig.build || -1;
    if (packageConfig.build < data.build) {
      logInfo('updateInfo', '检测到更新');
      cb && cb(data);
    } else {
      logInfo('updateInfo', '最新版本');
    }
  }, function() {
    logInfo('updateInfo', '无法连接至更新服务器');
  })
}

checkUpdate(function (data) {
  var updateing = data.files.map(function(file, i) {
    return new Promise(function (resolve, reject) {
      getHttpData(host + path + file, function (res) {
        fse.outputFile('./tmp/' + file, res, function () {
          logInfo('updateInfo', '下载' + file);
          resolve(file);
        });
      }, (e) => {
        console.log(file + "下载失败");
        reject(e);
      });
    });
  });
  Promise.all(updateing).then((res) => {
    logInfo('updateInfo', '下载完成');
    var moveing = res.map((file, i) => {
      return new Promise((resolve, reject) =>{
        fse.rename('./tmp/' + file, './' + file, () => {
          resolve(file);
        })
      })
    })
    return Promise.all(moveing).then(() => {
      logInfo('updateInfo', '更新完毕');
    })
  }, (e) => {
    logInfo('updateInfo', '更新失败' + e.message);
  })
});

function getHttpData(filepath, success, error) {
  // 回调缺省时候的处理
  success = success || function () {};
  error = error || function () {};
  var url = filepath + '?r=' + Math.random();
  console.log(url);
  try {
    http.get(url, function (res) {
      var statusCode = res.statusCode;

      if (statusCode !== 200) {
        // 出错回调
        console.log(statusCode + filepath);
        error("服务器相应码：" + statusCode);
        // 消耗响应数据以释放内存
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      var rawData = '';
      res.on('data', function (chunk) {
        rawData += chunk;
      });

      // 请求结束
      res.on('end', function () {
        // 成功回调
        success(rawData);
      }).on('error', function (e) {
        // 出错回调
        error();
      });
    }).on('error', (e) => {
      error(e);
    });;
  } catch(e) {
    error(e);
  }
};