
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

module.exports = {
  GET: function (url, callback) {
    xhr ("GET", url, {}, callback);
  },
  POST: function (url, data, callback) {
    xhr ("POST", url, data, callback);
  },
  POSTStr
}