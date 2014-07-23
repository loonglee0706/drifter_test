var express = require('express');
var bodyParser = require('body-parser');
var redis = require('./models/redis.js');
var mongodb = require('./models/mongodb.js');

var app = express();
//app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));

//drop a drift bottle
/*
{
	time : timestamp	//timestamp drifts out of,default Date.now()
	owner : username || id	drift bottle master
	type : male || female 	drift bottle type
	content : drift bottle content
}
*/
//POST owner=xxx&type=xxx&content=xxx[&time=xxx]
app.post('/', function(req, res){
	if (!req.body.owner && req.body.type && req.body.content) {
		return res.json({code: 0, msg: ""});
	}
	redis.throw(req.body, function (result) {
		res.json(result);
	});
})

//get a drift bottle
/*
@params
user : username || userid		//unique
type : all || male || female	//default:all
*/
//return value:JSON
/*
{
	code : 0 || 1		identification code 1 success 0 failure
	msg : string		return message
	time : timestamp	drop time
	owner : username || userid	// unique
	type : male || female
	content : content
}
*/
//GET /?user=XXX[&typpe=xxx]
app.get('/', function(req, res){
	if (!req.query.user) {
		return res.json({ code : 0, msg : 'Incomplete information' });
	}
	redis.pick(req.query, function(result){
		res.json(result);
		if (result.code === 1) {
			mongodb.save(req.query.user, result.msg);
		}
	});
})

// throw the bottle into the sea
app.post('/back', function (req, res) {
	redis.throwBack(req.body, function (result) {
		res.json(result);
	});
})

//get all drift bottles of a user
// GET "/user/lee"
app.get("/user/:user", function (req, res) {
	mongodb.getAll(req.params.user, function (result) {
		res.json(result);
	})
})

//get bottle detail by bottle _id
//GET /bottle/23423t349nnfdffif2c3
app.get("/bottle/:id", function (req, res) {
	mongodb.getOne(req.params._id, function (result) {
		res.json(result);
	})
})

app.listen(3000);
console.log('listen : 3000');