import express from "express";
import {validatecoupon,getcoupon } from "../controllers/couponcontroller.js";
import { protectedroute } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/",protectedroute, getcoupon);
router.post("/validate",protectedroute, validatecoupon);




export default router;
