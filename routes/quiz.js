var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');

var Quiz = require('./../models/quiz');
var User = require('./../models/user');

const Question = require('../models/question');
const Solution = require('../models/Solutions');
const Notif = require('./../models/notification');
router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

router.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        console.log('logged in');
        Quiz.find({})
            .then((quizzes) => {
                var flag = false;
                var quiz;
                var curDateTime = new Date();
                for (var i = 0; i < quizzes.length; i++) {
                    if (curDateTime >= quizzes[i].startTime && curDateTime <= quizzes[i].endTime) {
                        flag = true;
                        quiz = quizzes[i];
                        break;
                    }
                }
                if (flag) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({ "status": true, "quiz": quiz });
                } else {
                    res.statusCode = 256;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({ "status": false, "err": "No Live Quiz" });
                }
                console.log("Couldn't Find And Send Error");
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        console.log(req.body);
        Quiz.create(req.body)
            .then((quiz) => {
                Notif.create({
                    notifText: quiz.QuizName + " is starting Soon!",
                    notifTime: quiz.startTime
                }).then(notif => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(quiz);
                }, (err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
    });


router.route('/:quizID')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Quiz.findById(req.params.quizID)
            .then((quiz) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(quiz);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        console.log("Server reached")
        Quiz.findById(req.params.quizID).then((quiz) => {
            console.log("quiz found");
            console.log(JSON.stringify(req.body));
            console.log((req.body));
            var score = 0;
            var coins = 0;
            async function forLoop() {
                console.log('Start')
                for (var i = 0; i < quiz.Questions.length; i++) {
                    await Solution.findOne({ Question: quiz.Questions[i]._id })
                        .then(solution => {
                            console.log("Solution Found for : " + i);
                            console.log(solution);
                            console.log(Number(req.body['MarkedResponse[]'][i]));
                            if (solution && solution.CorrectOption == Number(req.body['MarkedResponse[]'][i])) {
                                score += quiz.Questions[i].score;
                                coins += 180;
                            }
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
            }
            User.findById(req.user._id)
                .then(user => {
                    if (!user) {
                        console.log("Send Error")

                        res.statusCode = 401;
                        res.setHeader('Content-Type', 'application/json');

                        return res.json({ "index": 2, "status": false, "err": "User Not Found" });
                    }
                    else {
                        var flag = true;
                        // flag is to test if the user has already given the quiz
                        for (var i = 0; i < user.quizzes.length; i++) {
                            if (user.quizzes[i].quiz == quiz.QuizName) {
                                flag = false;
                                break;
                            }
                        }
                        if (flag) {
                            forLoop().then(() => {
                                console.log("Send Score")
                                user.quizzes.push({ "quiz": quiz.QuizName, "score": score });
                                user.coins += coins;
                                user.totalValue += coins;
                                user.save();
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ "status": true, "score": score, "msg": "Success" });
                            })
                        } else { // here we handle the case that he has given the quiz
                            console.log("Quiz Reappear Error")
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({ "status": false, "score": "-1", "msg": "Quiz Already Given" });
                        }
                    }

                });
        }, (err) => next(err))
            .catch((err) => next(err));


    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end('PUT operation not supported on /readItems');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Quiz.findById(req.params.quizID)
            .then(quiz => {
                for (var i = 0; i < quiz.question.length; i++) {
                    solution.findOneAndDelete({ Question: quiz.question[i]._id });
                    quiz.Questions.id(quiz.Questions[i]._id).remove();
                    Question.findByIdAndDelete(quiz.Questions[i]._id);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
        Quiz.findByIdAndRemove(req.params.quizID)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

router.route('/:quizID/questions')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Quiz.findById(req.params.quizID)
            .then((quiz) => {
                if (quiz) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(quiz.Questions);
                }
                else {
                    err = new Error('Quiz ' + req.params.quizID + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        console.log(req.body);

        Quiz.findById(req.params.quizID)
            .then((quiz) => {
                if (quiz) {
                    req.body.options = req.body['options[]'];
                    delete req.body['options[]'];
                    req.body.score = Number(req.body.score);
                    var CorrectOption = Number(req.body.CorrectOption);
                    delete req.body.CorrectOption;
                    console.log(req.body);
                    Question.create(req.body).then(question => {
                        console.log("Question Created " + question);

                        quiz.Questions.push(question);
                        quiz.save()
                            .then((quiz) => {
                                Solution.create({
                                    Question: question._id,
                                    CorrectOption: CorrectOption
                                }).then(solution => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(quiz);
                                }, (err) => next(err));
                            }, (err) => next(err))
                            .catch((err) => {
                                console.log(err);
                            })
                    }).catch((err) => {
                        console.log(err);
                    })
                }
                else {
                    err = new Error('Quiz ' + req.params.quizID + 'not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /quiz/'
            + req.params.quizID + ' comments');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Quiz.findById(req.params.quizID)
            .then(quiz => {
                for (var i = 0; i < quiz.question.length; i++) {
                    solution.findOneAndDelete({ Question: quiz.question[i]._id });
                }
            }, (err) => next(err))
            .catch((err) => next(err));
        Quiz.findById(req.params.quizID)
            .then((quiz) => {
                if (quiz) {
                    for (var i = 0; i < quiz.question.length; i++) {
                        solution.findOneAndDelete({ Question: quiz.question[i]._id });
                        quiz.Questions.id(quiz.Questions[i]._id).remove();
                        Question.findByIdAndDelete(quiz.Questions[i]._id);
                    }
                    quiz.save()
                        .then((quiz) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(quiz);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Quiz ' + req.params.quizID + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

router.route('/:quizID/Questions/:questionID')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Quiz.findById(req.params.quizID)
            .then((quiz) => {
                if (quiz && quiz.Questions.id(req.params.questionID)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(quiz.Questions.id(req.params.questionID));
                }
                else if (quiz == null) {
                    err = new Error('Quiz ' + req.params.quizID + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Question ' + req.params.questionID + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /quizzes/' + req.params.dishId
            + '/question/' + req.params.questionId);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Quiz.findById(req.params.quizID)
            .then((quiz) => {
                if (quiz != null && quiz.Questions.id(req.params.questionID) != null) {
                    if (req.body.QuestionStatement) {
                        quiz.Questions.id(req.params.questionID).QuestionStatement = req.body.QuestionStatement;
                    }
                    if (req.body.options) {
                        quiz.Questions.id(req.params.questionID).options = req.body.options;
                    }
                    if (req.body.CorrectOption) {
                        Solution.findOneAndUpdate({ Question: questionID }, {
                            $set: { CorrectOption: req.body.CorrectOption }
                        }, { new: true });
                    }
                    if (req.body.score) {
                        quiz.Questions.id(req.params.questionID).score = req.body.score;
                    }
                    quiz.save()
                        .then((quiz) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(quiz);
                        }, (err) => next(err));
                }
                else if (quiz == null) {
                    err = new Error('Quiz ' + req.params.quizID + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else if (quiz.Questions.id(req.params.questionID) == null) {
                    err = new Error('Question ' + req.params.questionID + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('you are not authorized to update this Question!');
                    err.status = 403;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Quiz.findById(req.params.quizID)
            .then((quiz) => {
                if (quiz != null && quiz.Questions.id(req.params.questionID) != null) {
                    quiz.Questions.id(req.params.questionID).remove();
                    Question.findByIdAndRemove(req.params.questionID);
                    Solution.findOneAndDelete({ Question: req.params.questionID });
                    quiz.save()
                        .then((quiz) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(quiz);
                        }, (err) => next(err));
                }
                else if (quiz == null) {
                    err = new Error('Quiz ' + req.params.quizID + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else if (quiz.Questions.id(req.params.questionID) == null) {
                    err = new Error('Question ' + req.params.questionID + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('you are not authorized to delete this Question!');
                    err.status = 403;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = router;