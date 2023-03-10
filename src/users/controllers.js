const bcrypt = require("bcrypt");
const User = require("./model");
const jwt = require("jsonwebtoken");

// =====Add/Post new user to DB=====
// Responds/console with user and email. Pass omitted
const registerUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        console.log(user);
        res.status(201).json ({
            message: "Success",
            user: {username: req.body.username, email: req.body.email}
        });
    } catch (error) {
        res.status(501).json({errorMsg: error.message, error: error});
    }
};

// =====Login with password=====
// If password match, respond with user details. Pass omitted
// Token is assigned to ID
const login = async (req, res) => {
    try {
        if(req.authCheck) {
            res.status(201).json({
                message: "Success",
                user: {
                    username: req.authCheck.username,
                    email: req.authCheck.email}
            });
            return;
        };
        const token = await jwt.sign({id: req.user.id}, process.env.SECRET);
        console.log("token:", token);
        res.status(201).json({
            message: "Success", 
            user: {
                username: req.user.username,
                email: req.user.email,
                token: token}
        });
    } catch (error) {
        res.status(501).json({errorMsg: error.message, error: error});
    }
};

// =====Get all users if authorised=====
const getAllUsers = async (req, res) => {
    try {
        if(!req.authCheck) {
            const error = new Error("Not authorised");
            res.status(401).json({errorMsg: error.message, error:error});
        };
        const users = await User.findAll();

        for (let user of users) {
            user.password = "";
        };
        res.status(200).json({message: "Success", users: users});
    } catch (error) {
        res.status(501).json({errorMsg: error.message, error: error});
    }
};

// =====Update User information=====
// Is there a way of adding if: user id === authCheck id?
const updateUser = async (req, res) => {
    try {
        if(!req.authCheck) {
            const error = new Error("Not authorised");
            res.status(401).json({errorMsg: error.message, error:error});
        };
        const upUser = await User.update({[req.body.updateKey]: req.body.updateValue}, {
            where: {
                username: req.body.username
            }
        });
        res.status(201).json({message: "Success", updateResult: upUser});
    } catch (error) {
        res.status(501).json({errorMsg: error.message, error: error});
    }
};

// =====Delete user from DB=====
const deleteUser = async (req, res) => {
    try {
        if(!req.authCheck) {
            const error = new Error("Not authorised");
            res.status(401).json({errorMsg: error.message, error:error});
        };
        const removeUser = await User.destroy({
            where: {
                username: req.params.username
            }
        });
        res.status(201).json({message: "Success", result: removeUser});
    } catch (error) {
        res.status(501).json({errorMsg: error.message, error: error});
    }
};

module.exports = {
    registerUser,
    login,
    getAllUsers,
    updateUser,
    deleteUser,
};