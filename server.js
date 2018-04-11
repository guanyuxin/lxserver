const express = require('express');
const bodyParser = require('body-parser')
const fse = require('fs-extra')
const fs = require('fs')
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.static('dist'));
app.use('/client', express.static('client'));
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: false, limit:'50mb' }))
app.use(cookieParser());


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('listening at http://%s:%s', host, port);
});


function saveRules(packageObj) {
  return new Promise((resolve, reject) => {
    fs.rename(__dirname+'/var/config.json', __dirname+'/var/config.json'+new Date().getDay(), async ()=>{
      await fse.outputFile(__dirname+'/var/config.json', packageObj);
      try {
        var v = parseInt(await fse.readFile(__dirname+'/var/version'));
      } catch (e) {
        var v = 1;
      }
      fse.outputFile(__dirname+'/var/version', "" + (v+1))
      console.log("updateed v" + v);
      resolve();
    });
  });
}


app.get('/config', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.sendFile(__dirname+'/var/config.json');
})

app.get('/configVersion', async function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    var v = parseInt(await fse.readFile(__dirname+'/var/version'));
  } catch (e) {
    var v = 1;
  }
  res.send("" + v);
})


app.post('/config', async function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  await saveRules(req.body);
  res.send('{"status":0}');
})