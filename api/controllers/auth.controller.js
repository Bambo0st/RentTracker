import User from '../models/user.model.js';
import errorHandler from '../middleware/errorHandler.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        const existingUser = await User.findOne({ username: req.body.username });
        const existingUser2 = await User.findOne({ email: req.body.email })
        if (existingUser) {
            next(errorHandler(400, 'Username already taken!'));
            return;
        }
        if (existingUser2) {
            next(errorHandler(400, 'Email already taken!'));
            return;
        }
        await newUser.save();
        res.status(201).json('User created successfully!');
    } catch (error) {
        next(error); //CALLS GLOBAL ERROR HANDLER in index.js
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(new errorHandler(404, "User Not Found!"))
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(new errorHandler(401, "Wrong Credentials Entered!"))
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest)
    }
    catch (error) {
        next(error);
    }
}

export const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User Logged Out Successfully')
    }
    catch (error) {
        next(error);
    }
}
export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest);
        } else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username:
                    req.body.name.split(' ').join('').toLowerCase() +
                    Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
}



