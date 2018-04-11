var http = require('http');
var fse = require('fse');
var packageConfig = require('./package.json');

var host = host + "/";
var host = "http://localhost.com:3000/";
var path = "client/";

function logInfo(type, msg) {
  console.log(msg)
}

function checkUpdate(cb) {
  getHttpData(host + '/client/package.json', function (res) {
    var data = JSON.parse(res);
    
    packageConfig.build = packageConfig.build || -1;
    if (packageConfig.build <= data.build) {
      logInfo('updateInfo', '检测到更新');
      cb && cb(data);
    } else {
      logInfo('updateInfo', '最新版本');
    }
  })
}

checkUpdate(function (data) {
  var updateing = data.files.map(function(file, i) {
    return new Promise(function (resolve, reject) {
      getHttpData(host + path + file, function (res) {
        console.log('downloaded' + file);
        fse.outputFile('./tmp/' + file, res, function () {
          logInfo('updateInfo', '下载' + file);
          resolve(file);
        });
      }, () => {
        reject();
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
    return Promise.all(moveing)
  }, () => {
    logInfo('updateInfo', '更新失败');
  }).then(()=>{
    logInfo('updateInfo', '更新完毕');
  })
});


function getHttpData(filepath, success, error) {
  // 回调缺省时候的处理
  success = success || function () {};
  error = error || function () {};

  var url = filepath + '?r=' + Math.random();

  http.get(url, function (res) {
    var statusCode = res.statusCode;

    if (statusCode !== 200) {
      // 出错回调
      console.log(statusCode + filepath);
      error();
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
  });
};