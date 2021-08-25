var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
var User = require('../models/user');

var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');
const config = require('../config');
router.use(bodyParser.json());


/* GET users listing. */
router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

router.get('/',cors.cors, authenticate.verifyUser,(req,res)=>{

	User.findOne({ _id: req.user._id })
		.then(user => {
			if(user){
			res.json({"user":user})
			res.statusCode=200;
			}else{
				res.json({"index":2})
				res.statusCode=404;
			}
			return res;
		}, (err) => next(err))
		.catch((err) => next(err));


})
router.get('/logout', (req, res) => {
	if (req.session) {
		req.session.destroy();
		res.clearCookie('session-id');
		res.redirect(config.baseUrl);
	}
	else {
		var err = new Error('You are not logged in!');
		err.status = 403;
		next(err);
	}
});

router.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
	passport.authenticate('jwt', { session: false }, (err, user, info) => {
		if (err)
			return next(err);

		if (!user) {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			return res.json({ status: 'JWT invalid!', success: false, err: info });
		}
		else {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			return res.json({ status: 'JWT valid!', success: true, user: user });
		}
	})(req, res);
});

router.get('/auth/google', passport.authenticate('google', {  successRedirect: config.baseUrl + '/', failureRedirect: config.baseUrl + '/error?index=4' , scope: ['profile', 'email'] }));

router.get('/auth/google/callback', (req, res,next) => {
	passport.authenticate('google', { successRedirect: '/', failureRedirect: '/error/?index=4' }, (err, user, info) => {
		if (err)
			return next(err);

		if (!user) {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			res.json({index:4, success: false, status: 'Login Unsuccessful!', err: info });
		}
		req.logIn(user, (err) => {
			if (err) {
				return next(err);
			} else {
				var token = authenticate.getToken({ _id: req.user._id });
				res.cookie('jwt', token);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				//res.json({ success: true, status: 'Login Successful!', token: token });
				res.redirect(config.baseUrl);
			}
		});
	})(req, res);
});

router.get("/auth/facebook", passport.authenticate('facebook', {
	successRedirect: config.baseUrl + '/', failureRedirect: config.baseUrl + '/error?index=4' 
}));

router.get(
	"/auth/facebook/callback", (req, res,next) => {
		passport.authenticate("facebook", { successRedirect: config.baseUrl + '/', failureRedirect: config.baseUrl + '/error?index=4' }, (err, user, info) => {
			if (err)
				return next(err);
			if (!user) {
				res.statusCode = 401;
				res.setHeader('Content-Type', 'application/json');
				res.json({ index:2,success: false, status: 'Login Unsuccessful!', err: info });
			}
			req.logIn(user, (err) => {
				if (err) {
					return next(err);
				} else {
					var token = authenticate.getToken({ _id: req.user._id });
					res.cookie('jwt', token);
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					//res.json({ success: true, status: 'Login Successful!', token: token });
					res.redirect(config.baseUrl);
				}
			});
		})(req, res);
	});
//Increase Coins after video watched
router.put('/sponser/coins', cors.cors, authenticate.verifyUser, (req, res, next) => {
	User.findOne({ _id: req.user._id })
		.then(user => {
			if (!user) return res.status(404).json({})
			console.log(req.body);
			for (let i = 0; i < user.spons.length; i++) {
				if (user.spons[i] == req.body.brandName) {
					res.statusCode = 208;
					return res.json({ "coins": user.coins, err: "Already Seen" });
				}
			}
			let coinInc = 500;
			user.coins += coinInc;
			user.totalValue = user.coins+user.assetValue;
			user.spons.push(req.body.brandName);
			user.save().then(user => {
				res.statusCode = 200;
				res.json({ "coins": user.coins, "coinInc": coinInc });
			});
		});

});
router.get('/leaderboard', async function (req, res) {
	//User.find({}, null, { sort: { coins: -1 } }, function (err, docs) { console.log(docs); res.send({ status: true, msg: docs }) });

	const count = await User.countDocuments();
	User.find()
	.sort({totalValue: -1})
	.limit(10)
	.then(leaders => {
	  result = [];
	  for(var i=0;i<leaders.length;i++){
		result[i]= [leaders[i].firstname + ' ' + leaders[i].lastname , leaders[i].coins , leaders[i].assetValue, leaders[i].totalValue];
	  }
	  console.log(result);
	  res.send({ status: true, msg: result ,count:(count) })
	});
	/*
	User.find({}).then(users => {
		var data = JSON.parse(users);
		var result = data.sort((a, b) => { return a.coins - b.coins }).slice(0, 10)
		console.log(Array.from(result));
		res.send({ status: true, msg: result });
	});
	*/
});

module.exports = router;
