const express = require('express');
const bodyParser = require('body-parser')
const fse = require('fs-extra')
const fs = require('fs')
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.static('static'));
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: false, limit:'50mb' }))
app.use(cookieParser());


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


function saveRules(packageObj) {
  fs.rename(__dirname+'/var/config.json', __dirname+'/var/config.json'+new Date().getDay(), ()=>{
    fse.outputFile(__dirname+'/var/config.json', packageObj, (err, data) => {
      console.log("updateed")
    });
  });
}


app.get('/config', function(req, res) {
  res.sendFile(__dirname+'/var/config.json');
})

app.post('/config', function(req, res) {
  console.log(req.body)
  saveRules(req.body);
  res.send("1");
})