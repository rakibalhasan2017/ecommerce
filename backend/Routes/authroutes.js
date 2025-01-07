import express from "express";
import { signup, login, logout } from "../controllers/authcontroller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/refreshtoken", refreshtoken);

export default router;
