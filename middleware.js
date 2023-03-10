// Middleware is a chain of functions that can pass on information
// to the next function
// SOC: Seperation of Concern

const {Router} = require("express");
const exRouter = Router();

const finalFunc = async (req, res) => {
    console.log("req.body in finalfunc", req.body)
    res.status(201).json({message: "Success", body: req.body})
};

const middleOne = async (req, res, next) => {
    console.log("start middleOne", req.body)
    req.body["middleOne"] = "I'm from the middleOne func"
    next();
 };
// Express is expecting 'next' argument
 const middleTwo = async (req, res, next) => {
    console.log("start middleTwo", req.body)
    req.body["middleTwo"] = "I'm from the middleTwo func"
    next();
 };

// Request comes to url "/example"
// request passes to middleOne, does its task
// next() function is then called
// request passes to middleTwo, does its task
// next() passes to request to finalFunc

exRouter.post("/example", middleOne, middleTwo, finalFunc);

module.exports = exRouter;