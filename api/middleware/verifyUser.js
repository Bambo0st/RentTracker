import jwt from 'jsonwebtoken';
import errorHandler from './errorHandler.js';

export const verifyUser = (req, res, next) => {
    const token = req.cookies.access_token;
    console.log(token)
    if (!token) return next(errorHandler(401, 'Unauthorized'));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, 'Forbidden'));

        req.user = user;
        next();     //This makes it go to next parameter in the  parent functino (see user.rout.js)
    });
};