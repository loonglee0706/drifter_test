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

exports.reply = function (_id, reply, callback) {
	reply.time = reply.time || Date.now();
	//通过id找到要回复的漂流瓶
	bottleModel.findById(_id, function (err, _bottle) {
		if (err) {
			return callback({code:0,msg:"回复漂流瓶失败"});
		}
		
		var newBottle = {};
		newBottle.bottle = _bottle.bottle;
		newBottle.message = _bottle.message;
		
		//如果拣瓶人第一次回复漂流瓶则在bottle键添加漂流瓶主人
		//如果已经回复过漂流瓶则不再添加
		if (newBottle.bottle.length === 1) {
			newBottle.bottle.push(_bottle.message[0][0]);
		}
		//在message键添加一条回复信息
		newBottle.message.push([reply.user, reply.time, reply.content]);
		//更新数据库中该漂流瓶信息
		bottleModel.findByIdAndUpdate(_id, newBottle, function (err, bottle) {
			if (err) {
				return callback({code:0,msg:"回复漂流瓶失败"});
			}
			callback({code:1,msg:bottle});
		})
	})
	/*
	{
		bottle: [$picker, $owner],
		message: [
			["$owner", $time, $content],
			["$picker", $time, $content],
			[$owner or $picker, $time, $content]
			...
		]
	}
	*/
}

exports.delete = function (_id, callback) {
	bottleModel.findByIdAndRemove(_id, function (err) {
		if (err) {
			return callback({code:0,msg:"remove faliure"});
		}
		callback({code:1,msg:"remove success"});
	})
}