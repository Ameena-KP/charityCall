const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
    createUser,
    findUserByEmail,
    findUserById,
    updateUserProfile
} = require("../models/userModel");

// Register User
const registerUser = async (req, res) => {

    const {
        name,
        email,
        phone,
        password,
        address
    } = req.body;

    if (!name || !email || !phone || !password || !address) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {

        // Check if email already exists
        findUserByEmail(email, async (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Email already registered"
                });
            }

            // Hash Password
            const hashedPassword = await bcrypt.hash(password, 10);

            const userData = {
                name,
                email,
                phone,
                password: hashedPassword,
                address
            };

            createUser(userData, (err) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                res.status(201).json({
                    success: true,
                    message: "User Registered Successfully"
                });

            });

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Login User
const loginUser = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and Password are required"
        });
    }

    findUserByEmail(email, async (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
    {
        id: user.id,
        email: user.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
);

       res.status(200).json({

    success:true,

    message:"Login Successful",

    token

});

    });

};
const getProfile = (req, res) => {

    const userId = req.user.id;

    findUserById(userId, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: result[0]
        });

    });

};

const updateProfile = (req, res) => {

    const userId = req.user.id;

    const {
        name,
        phone,
        address
    } = req.body;

    if (!name || !phone || !address) {

        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });

    }

    updateUserProfile(
        {
            id: userId,
            name,
            phone,
            address
        },
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.status(200).json({
                success: true,
                message: "Profile Updated Successfully"
            });

        }
    );

};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile
};