var redis = require('redis'),
	client = redis.createClient();

exports.throw = function (bottle, callback) {
	bottle.time = bottle.time || Date.now();
	// create a unique id for every bottle
	var bottleId = Math.random().toString(16);
	var type = {male : 0, female : 1};
	// save drift to different databases by different type
	client.SELECT(type[bottle.type], function(){
		// save drift with HASH
		client.HMSET(bottleId, bottle, function(err, result){
			if (err) {
				return callback({code:0, msg: 'sorry, try later'})
			}
			// return result, return OK while success
			callback({code : 1, msg : result});
			// set the drift survival period of 1 days
			client.EXPIRE(bottleId, 86400);
		})
	})
}

exports.pick = function (info, callback) {
	//hate the starfish
	if (Math.random() < 0.2) {
		return callback({code : 0, msg: "海星"});
	}
	var type = {all : Math.round(Math.random()), male : 0, female : 1};
	info.type = info.type || 'all';
	// according to the request of the bottle type , to take out of the data in different database
	client.SELECT(type[info.type], function(){
		// random returns a drift bottle ID
		client.RANDOMKEY(function (err, bottleId) {
			if (!bottleId) {
				return callback({ code : 0, msg : '海星' });
			}
			// get the drift bottle detail according to the bottleId
			client.HGETALL(bottleId, function (err, bottle) {
				if (err) {
					return callback({ code : 0, msg : '漂流瓶破损了...' });
				}
				// return result,bottle cotains infomation found success
				callback({ code : 1, msg : bottle });
				// drop the bottle in Redis
				client.DEL(bottleId);
			})
		})
	})
}

exports.throwBack = function (bottle, callback) {
	var type = {male : 0, female : 1};
	// randomly generated an id for drift bottle
	var bottleId = Math.random().toString(16);
	// according to the request of the bottle type, to save bottle in different database
	client.SELECT(type[bottle.type], function () {
		// save bottle by hash structrue
		client.HMSET(bottleId, bttle, function (err, result) {
			if (err) {
				return calllback({code : 0, msg : "过会儿再试试吧!"})
			}
			// return result , return OK when success
			callback({code : 1, msg : result});
			// according to the origin timestamp of the bottle, set it's survival period
			client.PEXPIRE(bottleId, bottle.time + 86400000 - Date.now());
		})
	})
}