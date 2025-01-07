import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';
dotenv.config();

export const protectedroute = async (req, res, next) => {
    const token = req.cookies.accesstoken;

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token in the protectedroute' });
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESSTOKEN);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id in the protectedroute' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed in the protectedroute' });
    }
};


export const adminroute = async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin in the adminroute' });
    }
}
