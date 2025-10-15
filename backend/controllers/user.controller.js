import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: "false"
            });
        };
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User all ready exists with this email",
                success: "false"
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullname,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created Succesfully",
            success: true
        });
    }
    catch (error) {
        console.log(error);
    }
}
export const login = async (req, res) => {
    console.log(req.body);
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: "false"
            });
        };
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: "false"
            });
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: "false"
            });
        };
        const tokendata = {
            userId: user._id
        }
        const token =  jwt.sign(tokendata, process.env.SECRET_KEY, { expiresIn: '1d' });
        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 24 * 60 * 60 * 1000,     // 1 day
                httpOnly: true,
                secure: true,                  // set to true in production with HTTPS
                sameSite: "None"                 // allows cross-origin POST with credentials
            })
            .json({
                message: `Welcome back ${user.fullname}`,
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email
                },
                success: true
            });

    }
    catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "User logged out sucessfully",
            success: true
        })
    }
    catch (error) {
        console.log(error);
    }
}