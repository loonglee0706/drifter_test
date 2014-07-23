var config = require('../config');
var mongoose = require('mongoose');
mongoose.connect(config.db);

/*
{
	bottle : [$picker],
	message : [
		["$owner", "$time", "$content"]
	]
}
*/
var bottleModel = mongoose.model('Bottle',  new mongoose.Schema({
	bottle : Array,
	message : Array
},
{
	collection : "bottles"
}));

exports.save = function (picker, _bottle) {
	var bottle = {bottle : [], message : []};
	bottle.bottle.push(picker);
	bottle.message.push([_bottle.owner, _bottle.time, _bottle.content]);
	bottle = new bottleModel(bottle);
	bottle.save();
}

exports.findAll = function (user, callback) {
	bottleModel.find({"bottle" : user}, function (err, bottles) {
		if (err) {
			return callback({code : 0, msg: "获取漂流瓶列表失败..."});
		}
		callback({code : 1, msg : bottles});
	})
}

exports.getOne = function (_id, callback) {
	bottleModel.findById(_id, function (err, bottle) {
		if (err) {
			return callback({code : 0, msg : "读取漂流瓶失败..."});
		}
		callback({code : 1,msg : bottle});
	})
}