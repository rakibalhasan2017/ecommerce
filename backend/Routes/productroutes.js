import express from "express";
import {getallproduct, getfeateuredproduct, deleteproduct, createproduct} from "../controllers/productcontroller.js";
import {protectedroute, adminroute} from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/",protectedroute, adminroute, getallproduct);
router.get("/feateured", getfeateuredproduct);
router.post("/", protectedroute, adminroute, createproduct);
router.delete("/:id", protectedroute, adminroute, deleteproduct);

export default router;
