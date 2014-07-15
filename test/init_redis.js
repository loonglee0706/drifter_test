var request = require('request');

for (var i = 1; i <= 5; i++) {
  (function(_i){
    request.post({
      url : "http://127.0.0.1:3000",
      json : {
        "owner" : "bottle" + _i,
        "type" : "male",
        "content" : "content" + _i
      }
    })
  })(i);
}

for (var i = 6; i <= 10; i++) {
  (function(_i){
    request.post({
      url : "http://127.0.0.1:3000",
      json : {
      	"owner" : "bottle" + _i,
      	"type" : "female",
      	"content" : "content" + _i
      }
    });
  })(i);
}
