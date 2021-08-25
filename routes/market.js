var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');

var User = require('./../models/user');
var MarketPlace = require('./../models/MarketPlace')
router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

router.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        console.log('logged in');
        MarketPlace.find({})
            .then((items) => {
                if (items.length) { res.statusCode = 200; }
                else{ 
                    res.statusCode = 209;
                }
                res.setHeader('Content-Type', 'application/json');
                console.log(items);
                res.json(items);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
        console.log("Inside Post Request");
        console.log(req.body);
        MarketPlace.create(req.body)
            .then((item) => {
                console.log('item Created ', item);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(item);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
router.route('/buy')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

    .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
        var ObjectId = require('mongodb').ObjectId;
        req.body.itemId = new ObjectId(req.body.itemId);
        console.log(req.body);

        MarketPlace.findById(req.body.itemId).then(item => {
            if (!item) {
                res.statusCode = 404;
                res.json({ "index": 5, "err": "Item Not Found" });
                return res;
            } else {
                if (item.availableQuantity <= 0) {
                    console.log("Stock Out")
                    res.statusCode = 404;
                    res.json({ "index": 0, msg: "Stock Out" });
                    return res;
                } else {
                    console.log("user searching")

                    User.findById(req.user._id).then((user) => {
                        console.log("user Found")
                        if (!user) {
                            res.statusCode = 401;
                            res.json({ "index": 2, "err": "User Not Found" });
                            return res;
                        } else {
                            if (user.coins >= item.cost) {
                                user.coins -= item.cost;
                                user.assetValue += item.cost;
                                user.totalValue = user.coins + user.assetValue;
                                item.availableQuantity -= 1;

                                for (var i = 0; i < user.purchasedItems.length; i++) {
                                    if (user.purchasedItems[i].itemName == item.itemName) {
                                        user.purchasedItems[i].quantity += 1;
                                        user.save();
                                        item.save();
                                        res.json({ "msg": "Purchased Succesfully!", "quantity": user.purchasedItems[i].quantity })
                                        res.statusCode = 200;
                                        return res;
                                    }
                                }
                                user.purchasedItems.push({ itemName: item.itemName, quantity: 1,imageName: item.imageName });
                                user.save();
                                item.save();
                                res.statusCode = 200;
                                res.json({ "msg": "Purchased Succesfully!", "quantity": 1 })
                                return res;
                            } else {
                                res.statusCode = 404;
                                res.json({ index: 3, err: "No Money" });
                                return res;
                            }
                        }
                    }, (err) => next(err))
                        .catch((err) => next(err));
                }
            }
        }, (err) => next(err))
            .catch((err) => next(err));


    });
module.exports = router;