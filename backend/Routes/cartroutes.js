import express from "express";
import {addtocart, updatecart, removecart, getcartproduct} from "../controllers/cartcontroller.js";
import { protectedroute } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/",protectedroute, getcartproduct);
router.post("/",protectedroute, addtocart);
router.put("/:id",protectedroute, updatecart);
router.delete("/",protectedroute, removecart);



export default router;
