const bcrypt = require("bcrypt");
const salt = process.env.SALT_ROUNDS;
const User = require("../users/model");
// Security risk: Might be known that a password has been hashed 10 times and can undo it
// More rounds of hashing, more security

// =====2.Function to obscure desired password onto DB=====
const hashPass = async (req, res, next) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, parseInt(salt))
        req.body.password = hashedPass;
        console.log(req.body);
        console.log(hashedPass);
        next();
    } catch (error) {
        res.status(501).json({errorMsg: error.message, error: error})
    }
};

// =====4.Find specific user and compare passwords to match=====
const comparePass = async (req, res, next) => {
    try {
        req.user = await User.findOne({where: {username: req.body.username}})
        console.log(req.user)
        const matchPass = await bcrypt.compare(req.body.password, req.user.password)
        if (!matchPass) {
            const error = new Error("Password does not match")
            res.status(500).json({errorMsg: error.message, error: error})
        };
        next()
    } catch (error) {
        res.status(501).json({errorMsg: error.message, error: error})
    }
};

module.exports = {
    hashPass,
    comparePass,
};