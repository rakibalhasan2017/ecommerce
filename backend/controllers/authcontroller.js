import User from "../models/user.js";
import { redis } from '../lib/redis.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generatetoken = (userid) => {
  const accesstoken = jwt.sign({ id: userid }, process.env.ACCESSTOKEN, {
    expiresIn: "15m",
  });
  const refreshtoken = jwt.sign({ id: userid }, process.env.REFRESHTOKEN, {
    expiresIn: "7d",
  });
  return { accesstoken, refreshtoken };
};

const setcookies = (res, refreshtoken, accesstoken) => {
  res.cookie("refreshtoken", refreshtoken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("accesstoken", accesstoken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
    maxAge: 7 * 24 * 3600 * 1000, //  7days
  });
};

const storerefreshtoken = async (userid, refreshtoken) => {
  try {
    await redis.set(
      `refreshtoken:${userid}`,
      refreshtoken,
      "EX",
      7 * 24 * 60 * 60
    );
  } catch (error) {
    console.error(error);
  }
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    const salt = await bcrypt.genSalt(10); // 10 is the number of salt rounds
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Save the hashed password
    });
    await newUser.save();
    const { accesstoken, refreshtoken } = generatetoken(newUser._id);
    setcookies(res, refreshtoken, accesstoken);
    await storerefreshtoken(newUser._id, refreshtoken);
    res.status(201).json({
      message: "User created successfully",
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({
        message:
          "Something went wrong in the signup controller, CHECK THE SIGNUP CONTROLLER",
      });
  }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist with this email" });
        }
        const isMatch =  await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const { accesstoken, refreshtoken } = generatetoken(user._id);
       // console.log("accesstoken", accesstoken);
        //console.log("refreshtoken", refreshtoken);
        setcookies(res, refreshtoken, accesstoken);
        await storerefreshtoken(user._id, refreshtoken);
        res.status(200).json({
            message: "Logged in successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
        console.log("Logged in successfully");
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message:"Something went wrong in the login controller, CHECK THE LOGIN CONTROLLER",});
    }
};

export const logout = (req, res) => {
  try {
    const { refreshtoken } = req.cookies;
    if (refreshtoken) {
      const decoded = jwt.verify(refreshtoken, process.env.REFRESHTOKEN);
      redis.del(`refreshtoken:${decoded.id}`);
    }
    res.clearCookie("refreshtoken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("accesstoken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({
        message:
          "Something went wrong in the logout controller, CHECK THE LOGOUT CONTROLLER",
      });
  }
};

export const refreshtoken = async (req, res) => {
    try {
        const { refreshtoken } = req.cookies;
        if (!refreshtoken) {
        return res.status(401).json({ message: "Please login or signup, no refreshtoken in the refresgtoken controller" });
        }
        const decoded = jwt.verify(refreshtoken, process.env.REFRESHTOKEN);
        const token = await redis.get(`refreshtoken:${decoded.id}`);
        if (token !== refreshtoken) {
        return res.status(401).json({ message: "token and refreshtoken isnt matched" });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
        return res.status(401).json({ message: "User not found in the refreshtoken controller" });
        }
        const { accesstoken, refreshtoken: newrefreshtoken } = generatetoken(
        user._id
        );
        setcookies(res, newrefreshtoken, accesstoken);
        await storerefreshtoken(user._id, newrefreshtoken);
        res.status(200).json({
        message: "Token refreshed successfully",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        });
    } catch (error) {
        console.error(error.message);
        res
        .status(500)
        .json({
            message:
            "Something went wrong in the refreshtoken controller, CHECK THE REFRESHTOKEN CONTROLLER",
        });
    }
}


